import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginComponent } from '../../components/login/login';
import { ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/catch';

// TODO: Read domain from (environment-specific) config file
const BASE_URL = 'http://localhost:9000/v1'

const AUTH_TOKEN_HEADER = 'X-Auth-Token';

const UNAUTHORIZED = 401;

const GET = 'get';
const POST = 'post';
// const PUT = 'put';
// const DELETE = 'delete';

// XXX: Split off authentication to a separate class/layer? E.g. AuthHttp?
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

  constructor(private http: HttpClient, private modal: ModalController) {
  }

  public setAuthToken(token: string): void {
    this.authToken = token;
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
    if (authenticate && this.authToken) headers = headers.append(AUTH_TOKEN_HEADER, this.authToken);
    return headers;
  }

  private logIn(): Observable<any> {
    const overlay = this.modal.create(LoginComponent, {}, { enableBackdropDismiss: false });
    overlay.present();

    const finishSubject = new Subject();
    overlay.onDidDismiss(data => finishSubject.next(data));
    return finishSubject;
  }

  private fetchResponse(
    method: string, endpoint: string, authenticate: boolean = true, options = {}
  ): Observable<HttpResponse<Object>> {
    if (authenticate && !this.authToken)
      return this.logIn().concatMap(() => this.fetchResponse(method, endpoint, authenticate, options));

    const mapResponse = (response: HttpResponse<Object>): Observable<HttpResponse<Object>> => {
      if (response.status === UNAUTHORIZED)
        return this.logIn().concatMap(() => this.fetchResponse(method, endpoint, authenticate, options));

      return Observable.of(response);
    }

    return this.http.request(method, `${BASE_URL}/${endpoint}`, {
      headers: this.buildHeaders(authenticate),
      observe: 'response',
      ...options
    }).catch(mapResponse)
      .concatMap(mapResponse);
  }

  private fetchBody(
    method: string, endpoint: string, authenticate: boolean = true, options = {}
  ): Observable<Object> {
    return this.fetchResponse(method, endpoint, authenticate, options)
      .map(response => response.body);
  }

  public get(endpoint: string, authenticate: boolean = true): Observable<Object> {
    return this.ensure(this.fetchBody(GET, endpoint, authenticate));
  }

  public post(endpoint: string, body: any): Observable<Object> {
    return this.ensure(this.fetchBody(POST, endpoint, true, {
      body: body
    }));
  }

  public postResponse(endpoint: string, body: any, authenticate: boolean = true): Observable<HttpResponse<Object>> {
    const action = this.fetchResponse(POST, endpoint, authenticate, {
      body: body,
      // XXX: Maybe not too clean but currently required, as the server sometimes returns non-json (e.g. on login success)
      responseType: 'text'
    })
    return this.ensure(action);
  }
}
