import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import { RestifyService } from './abs.restify.service';

@Injectable()
export class ExamplesService extends RestifyService {
  constructor( @Inject(Http) http: Http) {
    super(http);
    this.model = 'examples';
  }
}
