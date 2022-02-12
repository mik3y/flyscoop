import { getLogger } from "./Logging";

const debug = getLogger("ApiClient");

const QUERY_GET_VIEWER = () => `query { viewer { email } }`;

const QUERY_GET_APPS = () => `
query {
  apps(role:null) {
    nodes {
      name
      status
      state
      appUrl
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
  app(name:"paasthru") {
    runtime
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

class HTTPError extends Error {
  constructor(response) {
    super(response.statusText);
    this.response = response;
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === "function") {
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
  constructor(accessToken = null, baseUrl = "https://api.fly.io") {
    this.accessToken = accessToken;
    this.baseUrl = baseUrl;
  }

  toString() {
    return `<ApiClient baseUrl=${this.baseUrl} accessToken=${this.accessToken}>`;
  }

  /** Fetch standard headers that should be set per-request. */
  _getHeaders(withAccessToken = true) {
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization:
        this.accessToken && withAccessToken
          ? `Bearer ${this.accessToken}`
          : undefined,
    };
  }

  async _processResponse(response) {
    const contentType = response.headers.get("Content-Type");
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

  async _fetch(method, path, data = null, params = {}, withAccessToken = true) {
    console.log("### API call: ", this.accessToken);

    const querystring = new URLSearchParams();
    for (let key in params) {
      querystring.append(key, params[key]);
    }
    const rawQs = querystring.toString();
    const qs = rawQs ? `?${rawQs}` : "";
    const url = `${this.baseUrl}${path}${qs}`;
    const headers = this._getHeaders(withAccessToken);

    const encodedData = data ? JSON.stringify(data) : null;
    const options = {
      method,
      headers: {
        ...headers,
      },
    };
    if (data) {
      options.headers["Content-Length"] = encodedData.length;
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
    return this._fetch("GET", path, null, params);
  }

  async _post(path, data = null, params = {}, withAccessToken = true) {
    return this._fetch("POST", path, data, params, withAccessToken);
  }

  async query(q) {
    const data = {
      query: q,
    };
    return this._post("/graphql", data);
  }

  async getViewer() {
    const q = QUERY_GET_VIEWER()
    return this.query(q);
  }

  async getApps() {
    const q = QUERY_GET_APPS()
    const nodes = (await this.query(q)).data.apps.nodes;
    return nodes.filter((app) => app.role === null);
  }

  async getAppDetail(appName) {
    const q = QUERY_GET_APP_DETAIL(appName);
    const result = (await this.query(q)).data.app;
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
    const responseJson = await this.get(`/api/v1/apps/${appName}/logs`, params);
    const lines = responseJson.data;
    const nextToken =
      (responseJson.meta && responseJson.meta.next_token) || null;

    return { lines, nextToken };
  }
}

export default ApiClient;
