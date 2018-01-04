import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from 'ngx-login-client';
import { WIT_API_URL, Contexts } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/operators/map';

@Injectable()
export class PipelineInsightsService {

  constructor(
    private http: Http,
  ) {}

}
