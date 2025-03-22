import { Id } from '@chinese-laoshi/shared';
import axios from 'axios';

export class BaseService<Data> {
  protected url: string;

  constructor(url: string) {
    this.url = url;
  }

  private getUrlWithId(id?: Id) {
    return id ? `${this.url}/${id}` : this.url;
  }

  get<Response = Data>(id?: Id) {
    return axios.get<Response, Response>(this.getUrlWithId(id));
  }

  getList<Response = Data[]>(id?: Id) {
    return axios.get<Response, Response>(this.getUrlWithId(id));
  }

  post<Request = Omit<Data, 'id'>, Response = Data>(data: Request, id?: Id) {
    return axios.post<Request, Response>(this.getUrlWithId(id), data);
  }

  put<Request = Data, Response = Data>(data: Request, id?: Id) {
    return axios.put<Request, Response>(this.getUrlWithId(id), data);
  }

  delete(id: Id) {
    return axios.delete(`${this.url}/${id}`);
  }
}
