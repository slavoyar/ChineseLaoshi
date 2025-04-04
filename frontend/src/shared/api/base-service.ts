import axios, { CancelTokenSource } from 'axios';

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

  async get<Response = Entity>(id?: string) {
    return axios.get<Response, Response>(this.getUrlWithId(id), { cancelToken: this.getCancelToken('get') });
  }

  async getList<Response = Entity[]>(id?: string) {
    return axios.get<Response, Response>(this.getUrlWithId(id), {
      cancelToken: this.getCancelToken('getList'),
    });
  }

  post<Request = Create, Response = Entity>(data: Request, id?: string) {
    return axios.post<Request, Response>(this.getUrlWithId(id), data, {
      cancelToken: this.getCancelToken('post'),
    });
  }

  put<Request = Update, Response = Entity>(data: Request, id?: string) {
    return axios.put<Request, Response>(this.getUrlWithId(id), data, {
      cancelToken: this.getCancelToken('put'),
    });
  }

  delete(id: string) {
    return axios.delete(`${this.url}/${id}`, { cancelToken: this.getCancelToken('delete') });
  }
}
