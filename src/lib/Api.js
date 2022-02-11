import { getLogger } from "./Logging";

const debug = getLogger("ApiClient");

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
  constructor(
    baseUrl,
    installationId,
    accessToken = null,
  ) {
    this.baseUrl = baseUrl;
    this.installationId = installationId;
    this.accessToken = accessToken;
  }

  toString() {
    return `<ApiClient baseUrl=${this.baseUrl} installationId=${this.installationId} accessToken=${this.accessToken}>`;
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
    const querystring = new URLSearchParams();
    for (let key in params) {
      querystring.append(key, params[key]);
    }
    const rawQs = querystring.toString();
    const qs = rawQs ? `?${rawQs}` : "";
    const url = `${this.baseUrl}${path}${qs}`;

    if (withAccessToken) {
      await this._refreshAccessTokenIfNeeded();
    }

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

}

export default ApiClient;
