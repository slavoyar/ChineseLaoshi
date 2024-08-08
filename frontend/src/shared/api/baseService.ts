import axios from 'axios';

export default class BaseService<Data> {
  protected url: string;

  constructor(url: string) {
    this.url = url;
  }

  private getUrlWithId(id?: string) {
    return id ? `${this.url}/${id}` : this.url;
  }

  get<Response = Data>(id?: string) {
    return axios.get<Response, Response>(this.getUrlWithId(id));
  }

  getList<Response = Data[]>(id?: string) {
    return axios.get<Response, Response>(this.getUrlWithId(id));
  }

  post<Request = Omit<Data, 'id'>, Response = Data>(data: Request, id?: string) {
    return axios.post<Request, Response>(this.getUrlWithId(id), data);
  }

  put<Request = Data, Response = Data>(data: Request, id?: string) {
    return axios.put<Request, Response>(this.getUrlWithId(id), data);
  }

  delete(id: string) {
    return axios.delete(`${this.url}/${id}`);
  }
}
