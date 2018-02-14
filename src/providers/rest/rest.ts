import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

// TODO: Read domain from (environment-specific) config file
const BASE_URL = 'http://localhost:9000/v1'

const AUTH_TOKEN_HEADER = 'X-Auth-Token';

@Injectable()
export class RestProvider {

  private get authToken(): string {
    return localStorage.authToken;
  }

  private set authToken(token: string) {
    if (!token)
      delete localStorage.authToken;
    else
      localStorage.authToken = token;
  }

  constructor(private http: HttpClient) {
  }

  /**
   * Make sure the provided observable gets executed, even without an
   * external subscriber.
   * @param observable Task to certainly be executed
   */
  private ensure<T>(observable: Observable<T>): Observable<T> {
    const subject = new ReplaySubject<T>(1);
    observable.subscribe(subject);
    return subject;
  }

  private buildHeaders(authenticate: boolean = true): HttpHeaders {
    let headers = new HttpHeaders();
    // TODO: Somehow trigger login prompt if token is missing (or expired). Might require some refactoring.
    if (authenticate && this.authToken) headers = headers.append(AUTH_TOKEN_HEADER, this.authToken);
    return headers;
  }

  public get(endpoint: string, authenticate: boolean = true): Observable<Object> {
    const action = this.http.get(`${BASE_URL}/${endpoint}`, { headers: this.buildHeaders(authenticate) });
    return this.ensure(action);
  }

  public post(endpoint: string, body: any): Observable<Object> {
    const action = this.http.post(`${BASE_URL}/${endpoint}`, body, { headers: this.buildHeaders() });
    return this.ensure(action);
  }

  public postResponse(endpoint: string, body: any): Observable<HttpResponse<Object>> {
    const action = this.http.post(`${BASE_URL}/${endpoint}`, body, {
      headers: this.buildHeaders(),
      observe: 'response',
      // XXX: Maybe not too clean but currently required, as the server sometimes returns non-json (e.g. on login success)
      responseType: 'text'
    });
    return this.ensure(action);
  }

  public setAuthToken(token: string): void {
    this.authToken = token;
  }

  public isLoggedIn(): boolean {
    return !!this.authToken;
  }
}
