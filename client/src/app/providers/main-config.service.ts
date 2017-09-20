import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';

@Injectable()
export class MainConfigService {
    protected data: any = null;
    protected loaded: boolean = false;

    constructor(protected http: Http) {
        console.log('DEBUG paso por aca');    
        if (!environment.api.mainConfig) {
            this.data = {};
            this.loaded = true;
        }
    }

    public config(): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            if (this.loaded) {
                observer.next(this.data);
                observer.complete();
            } else {
                this.load().subscribe(data => {
                    this.data = data;
                    this.loaded = true;

                    observer.next(this.data);
                }, err => observer.error(err), () => observer.complete());
            }
        });
    }

    protected getHeaders(): RequestOptions {
        return new RequestOptions({
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            })
        });
    }
    protected load(): Observable<Response> {
        return this.http.get(`${environment.api.host}/public-configs/main`, this.getHeaders()).map(d => d.json());
    }
}