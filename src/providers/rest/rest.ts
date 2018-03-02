import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/catch';
import { ensure } from '../../util/streams';

// TODO: Read domain from (environment-specific) config file
const BASE_URL = 'http://localhost:9000/v1';

export interface ErrorResponse {
  message: string;
}

@Injectable()
export class RestProvider {

  constructor(private http: HttpClient) {
  }

  public fetchResponse(
    method: string, endpoint: string, options = {}
  ): Observable<HttpResponse<Object>> {
    return this.http.request(method, `${BASE_URL}/${endpoint}`, {
      observe: 'response',
      ...options
    });
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
