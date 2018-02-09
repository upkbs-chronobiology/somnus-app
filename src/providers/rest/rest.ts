import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

// TODO: Read domain from (environment-specific) config file
const BASE_URL = 'http://localhost:9000/v1'

const AUTH_TOKEN_HEADER = 'X-Auth-Token';

@Injectable()
export class RestProvider {

  private authToken: string;

  constructor(public http: HttpClient) {
  }

  private buildHeaders(): HttpHeaders {
    const headers = new HttpHeaders();
    if (this.authToken) headers.append(AUTH_TOKEN_HEADER, this.authToken);
    return headers;
  }

  public get(endpoint: string): Observable<Object> {
    return this.http.get(`${BASE_URL}/${endpoint}`, { headers: this.buildHeaders() });
  }

  public post(endpoint: string, body: any): Observable<Object> {
    return this.http.post(`${BASE_URL}/${endpoint}`, body, { headers: this.buildHeaders() });
  }

  public postResponse(endpoint: string, body: any): Observable<HttpResponse<Object>> {
    return this.http.post(`${BASE_URL}/${endpoint}`, body, {
      headers: this.buildHeaders(),
      observe: 'response',
      // XXX: Maybe not too clean but currently required, as the server sometimes returns non-json (e.g. on login success)
      responseType: 'text'
    });
  }

  public setAuthToken(token: string): void {
    this.authToken = token;
  }

  public isLoggedIn(): boolean {
    return !!this.authToken;
  }
}
