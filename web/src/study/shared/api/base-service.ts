import axios, { CancelTokenSource } from 'axios';

import { apiRequest, ApiRequestOptions } from './api-error';

export class BaseService<Entity, Create = Entity, Update = Entity> {
  protected url: string;
  protected cancelTokenByUrl = new Map<string, CancelTokenSource>();

  constructor(url: string) {
    this.url = url;
  }

  private getUrlWithId(id?: string) {
    return id ? `${this.url}/${id}` : this.url;
  }

  protected getCancelToken(id: string) {
    const cancelToken = this.cancelTokenByUrl.get(id);

    if (cancelToken) {
      cancelToken.cancel();
    }

    const cancelTokenSource = axios.CancelToken.source();
    this.cancelTokenByUrl.set(id, cancelTokenSource);
    return cancelTokenSource.token;
  }

  protected request<T>(promise: Promise<T>, options?: ApiRequestOptions) {
    return apiRequest(promise, options);
  }

  async get<Response = Entity>(id?: string) {
    return this.request(
      axios.get<Response, Response>(this.getUrlWithId(id), {
        cancelToken: this.getCancelToken(`get:${id ?? 'all'}`),
      }),
      { notify: false }
    );
  }

  async getList<Response = Entity[]>(id?: string) {
    return this.request(
      axios.get<Response, Response>(this.getUrlWithId(id), {
        cancelToken: this.getCancelToken(`getList:${id ?? 'all'}`),
      }),
      { notify: false }
    );
  }

  post<Request = Create, Response = Entity>(data: Request, id?: string) {
    return this.request(
      axios.post<Request, Response>(this.getUrlWithId(id), data, {
        cancelToken: this.getCancelToken('post'),
      }),
      { notify: true }
    );
  }

  put<Request = Update, Response = Entity>(data: Request, id?: string) {
    return this.request(
      axios.put<Request, Response>(this.getUrlWithId(id), data, {
        cancelToken: this.getCancelToken('put'),
      }),
      { notify: true }
    );
  }

  delete(id: string) {
    return this.request(axios.delete(`${this.url}/${id}`, { cancelToken: this.getCancelToken('delete') }), {
      notify: true,
    });
  }
}
