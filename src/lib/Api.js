import dayjs from 'dayjs';

import { getLogger } from './Logging';

const debug = getLogger('ApiClient');

const QUERY_GET_VIEWER = () => `query { viewer { email } }`;

const QUERY_GET_ORGANIZATIONS = () => `
query {
  organizations {
    nodes {
      id
      slug
      name
    }
  }
}`;

const QUERY_GET_APPS = () => `
query {
  apps(role:null) {
    nodes {
      name
      status
      state
      appUrl
      organization {
        id
      }
      regions {
        name
        code
        gatewayAvailable
        latitude
        longitude
      }
      currentRelease {
        createdAt
        description
        version
      }
      appUrl
      deployed
      hostname
      role {
        __typename
      }
    }
  }
}`;

const QUERY_GET_APP_DETAIL = (appName) => `
query {
  app(name:"${appName}") {
    name
    id
    runtime
    hostname
    organization {
      slug
    }
    allocations {
      id
      region
      status
      desiredStatus
      healthy
      privateIP
      version
      createdAt
      updatedAt
    }
    vmSize {
      name
      cpuCores
      memoryGb
      memoryMb
      priceMonth
      priceSecond
    }
    taskGroupCounts {
      name
      count
    }
    processGroups {
      name
      maxPerRegion
    }
    regions {
      name
      code
      latitude
      longitude
    }
    changes {
      nodes {
        id
        description
        createdAt
      }
    }
  }
}`;

const QUERY_GET_RELEASES = (appName) => `
query {
  app(name:"${appName}") {
    releases {
      nodes {
        id
        createdAt
        image {
          absoluteRef
          createdAt
          id
          label
          tag
        }
        imageRef
        reason
        status
        version
      }
    }
  }
}`;

const METRIC_QUERIES = {
  data_sent: (app) =>
    `sum(rate(fly_instance_net_sent_bytes{app="${app.name}",device="eth0"}[15s]))`,
  data_recv: (app) =>
    `sum(rate(fly_instance_net_recv_bytes{app="${app.name}",device="eth0"}[15s]))`,
};

class HTTPError extends Error {
  constructor(response) {
    super(response.statusText);
    this.response = response;
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(response.statusText).stack;
    }
    this.status = response.status;
  }
}

class TextHTTPError extends HTTPError {
  constructor(response, data) {
    super(response);
    this.data = data;
  }
}

class NotAuthorizedError extends HTTPError {
  constructor(response) {
    super(response);
  }
}

class JSONHTTPError extends HTTPError {
  constructor(response, json) {
    super(response);
    this.json = json;
  }
}

class ApiClient {
  constructor(accessToken = null, baseUrl = 'https://api.fly.io') {
    this.accessToken = accessToken;
    this.baseUrl = baseUrl;
  }

  toString() {
    return `<ApiClient baseUrl=${this.baseUrl} accessToken=${this.accessToken}>`;
  }

  /** Fetch standard headers that should be set per-request. */
  _getHeaders(withAccessToken = true, formEncode = false) {
    return {
      Authorization: this.accessToken && withAccessToken ? `Bearer ${this.accessToken}` : undefined,
      Accept: 'application/json',
      'Content-Type': formEncode
        ? 'application/x-www-form-urlencoded;charset=UTF-8'
        : 'application/json',
    };
  }

  async _processResponse(response) {
    const contentType = response.headers.get('Content-Type');
    const isJSON = contentType && contentType.match(/json/);
    const data = isJSON ? await response.json() : await response.text();
    if (response.ok) {
      return data;
    }
    if (isJSON) {
      debug(data);
      throw new JSONHTTPError(response, data);
    }
    debug(data);
    throw new TextHTTPError(response, data);
  }

  async _fetch(method, path, data = null, params = {}, withAccessToken = true, formEncode) {
    const querystring = new URLSearchParams();
    for (let key in params) {
      querystring.append(key, params[key]);
    }

    const rawQs = querystring.toString();
    const qs = rawQs ? `?${rawQs}` : '';
    const url = `${this.baseUrl}${path}${qs}`;

    const headers = this._getHeaders(withAccessToken, formEncode);
    const encodedData = data
      ? formEncode
        ? Object.keys(data)
            .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
            .join('&')
        : JSON.stringify(data)
      : null;

    const options = {
      method,
      headers,
    };

    if (data) {
      options.headers['Content-Length'] = encodedData.length;
      options.body = encodedData;
    }

    debug(`>>> ${method} ${url} options=${JSON.stringify(options)}`);
    try {
      const response = await fetch(url, options);
      const data = await this._processResponse(response);
      debug(`<<< ${method} ${url} [${response.status}]`);
      return data;
    } catch (e) {
      debug(`!!! ${method} ${url} [${e.status}]: ${e}`);
      throw e;
    }
  }

  async _get(path, params = {}) {
    return this._fetch('GET', path, null, params);
  }

  async _post(path, data = null, params = {}, withAccessToken = true, formEncode = false) {
    return this._fetch('POST', path, data, params, withAccessToken, formEncode);
  }

  async queryGql(q) {
    const data = {
      query: q,
    };
    const result = await this._post('/graphql', data);
    if (result.errors) {
      const errorMessage = result.errrors[0].message;
      throw new Error(`GraphQL error: ${errorMessage}`);
    }
    return result;
  }

  async queryProm({ app, query, step = 60 * 5, minutes = 60 * 1 }) {
    const data = {
      query,
    };
    const params = {
      step,
      start: dayjs().subtract(minutes, 'minute').toISOString(),
      end: dayjs().toISOString(),
    };
    debug('querying prometheus: %j params %j', query, params);
    const result = await this._post(
      `/prometheus/${app.organization.slug}/api/v1/query_range`,
      data,
      params,
      true,
      true
    );
    if (result.status === 'success') {
      return {
        data: result.data.result,
        resultType: result.data.resultType,
      };
    }
    throw new Error(`Prom query failed: status=${result.status}`);
  }

  async getViewer() {
    const q = QUERY_GET_VIEWER();
    return this.queryGql(q);
  }

  async getOrganizations() {
    const q = QUERY_GET_ORGANIZATIONS();
    return (await this.queryGql(q)).data.organizations.nodes;
  }

  async getApps() {
    const q = QUERY_GET_APPS();
    const nodes = (await this.queryGql(q)).data.apps.nodes;
    return nodes.filter((app) => app.role === null);
  }

  async getAppDetail(appName) {
    const q = QUERY_GET_APP_DETAIL(appName);
    const result = (await this.queryGql(q)).data.app;
    return result;
  }

  async getAppReleases(appName) {
    const q = QUERY_GET_RELEASES(appName);
    const result = (await this.queryGql(q)).data.app.releases.nodes;
    return result;
  }

  async getLogs({ appName, region = null, token = null, instance = null }) {
    const params = {};
    if (region) {
      params.region = region;
    }
    if (token) {
      params.token = token;
    }
    if (instance) {
      params.instace = instance;
    }
    const responseJson = await this._get(`/api/v1/apps/${appName}/logs`, params);
    const lines = responseJson.data;
    const nextToken = (responseJson.meta && responseJson.meta.next_token) || null;

    return { lines, nextToken };
  }
}

ApiClient.METRIC_QUERIES = METRIC_QUERIES;

export default ApiClient;
