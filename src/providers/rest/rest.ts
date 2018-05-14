import { ensure } from '../../util/streams';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ToastProvider } from '../toast/toast';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/catch';

// TODO: Read domain from (environment-specific) config file
const BASE_URL = 'http://localhost:9000/v1';

export interface ErrorResponse {
  message: string;
}

@Injectable()
export class RestProvider {

  constructor(private http: HttpClient, private toast: ToastProvider) {
  }

  public fetchResponse(
    method: string, endpoint: string, options = {}
  ): Observable<HttpResponse<Object>> {
    return this.http.request(method, `${BASE_URL}/${endpoint}`, {
      observe: 'response',
      ...options
    }).catch((error, caught) => {
      if (error.status === 0)
        this.toast.show('The service cannot be reached at the moment', true);
      return Observable.throw(error);
    });
  }

  public get(endpoint: string): Observable<Object> {
    return ensure(this.fetchResponse('get', endpoint)).map(r => r.body);
  }

  public post(endpoint: string, body: any): Observable<Object> {
    return ensure(this.fetchResponse('post', endpoint, {
      body: body
    }).map(r => r.body));
  }

  // XXX: text response type as default needed atm because server sometimes responds with non-json
  public postResponse(endpoint: string, body: any, responseType: string = 'text'): Observable<HttpResponse<Object>> {
    return ensure(this.fetchResponse('post', endpoint, {
      body: body,
      responseType: responseType
    }));
  }
}
