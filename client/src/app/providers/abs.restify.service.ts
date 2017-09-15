import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';

@Injectable()
export abstract class RestifyService {
    protected model: string = 'examples';
    protected api: string = environment.api.host + environment.api.restUri;

    constructor(protected http: Http) {
    }

    all(query: object = {}): Observable<Response> {
        return this.http.get(`${this.api}/${this.model}${this.jsonToQuery(query)}`, this.getHeaders()).map(d => d.json());
    }
    create(data): Observable<Response> {
        return this.http.post(`${this.api}/${this.model}`, data, this.getHeaders()).map(d => d.json());
    }
    count(options: object = {}): Observable<Response> {
        return this.http.get(`${this.api}/${this.model}/count${this.jsonToQuery(options)}`, this.getHeaders()).map(d => d.json());
    }
    delete(id): Observable<Response> {
        return this.http.delete(`${this.api}/${this.model}/${id}`, this.getHeaders()).map(d => d.json());
    }
    find(query: any): Observable<Response> {
        return this.http.get(`${this.api}/${this.model}/?query=${JSON.stringify(query)}`, this.getHeaders()).map(d => d.json());
    }
    get(id): Observable<Response> {
        return this.http.get(`${this.api}/${this.model}/${id}`, this.getHeaders()).map(d => d.json());
    }
    update(id, data): Observable<Response> {
        return this.http.patch(`${this.api}/${this.model}/${id}`, data, this.getHeaders()).map(d => d.json());
    }

    protected getHeaders(): RequestOptions {
        return new RequestOptions({
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            })
        });
    }
    protected jsonToQuery(data: object, beginning: boolean = true): string {
        let query: any = [];

        for (let k in data) {
            query.push(`${k}=${JSON.stringify(data[k])}`);
        }

        query = query.join('&');

        if (query && beginning) {
            query = `?${query}`;
        }

        return query;
    }
}