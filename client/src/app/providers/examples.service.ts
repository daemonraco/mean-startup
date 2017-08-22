import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';

@Injectable()
export class ExamplesService {
  model: string = 'examples';
  api: string = environment.api.host + environment.api.restUri;
  httpOptions: RequestOptions = null;

  constructor(private http: Http) {
    this.httpOptions = new RequestOptions({
      headers: new Headers({
        'Accept': 'application/json'
      })
    });
  }

  all(): Observable<any> {
    return this.http.get(this.api + '/' + this.model, this.httpOptions).map(d => d.json());
  }
  create(data): Observable<any> {
    return this.http.post(this.api + '/' + this.model, data, this.httpOptions).map(d => d.json());
  }
  delete(id): Observable<any> {
    return this.http.delete(this.api + '/' + this.model + '/' + id, this.httpOptions).map(d => d.json());
  }
  find(query: any): Observable<any> {
    return this.http.get(`${this.api}/${this.model}/?query=${JSON.stringify(query)}`, this.httpOptions).map(d => d.json());
  }
  get(id): Observable<any> {
    return this.http.get(this.api + '/' + this.model + '/' + id, this.httpOptions).map(d => d.json());
  }
  update(id, data): Observable<any> {
    return this.http.patch(this.api + '/' + this.model + '/' + id, data, this.httpOptions).map(d => d.json());
  }
}
