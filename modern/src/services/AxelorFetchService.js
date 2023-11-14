class AxelorFetchService {
  constructor(baseURL, options) {
    this.baseURL = baseURL;
    this.options = options;
  }

  async post(url, options) {
    const _options = this.buildOptions({ method: 'POST', ...options });
    return fetch(this.baseURL + url, _options);
  }

  async get(url, options) {
    const _options = this.buildOptions({ method: 'GET', ...options });
    return fetch(this.baseURL + url, _options);
  }

  initAuthHeaders(args) {
    const { TOKEN, 'CSRF-TOKEN': CSRF_TOKEN } = args;
    this.headers = { Authorization: `Basic ${TOKEN}`, 'X-CSRF-TOKEN': CSRF_TOKEN };
  }

  set headers(headers) {
    this.options.headers = { ...this.options.headers, ...headers };
  }

  buildOptions(options) {
    return {
      ...this.options,
      ...options,
      headers: {
        ...this.options.headers,
        ...options.headers,
      },
    };
  }
}

const http = new AxelorFetchService('/axelor-api', { headers: { 'Content-Type': 'application/json' } });

// eslint-disable-next-line import/prefer-default-export
export { http };
