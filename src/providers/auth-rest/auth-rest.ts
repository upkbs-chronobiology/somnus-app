import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { LoginComponent } from '../../components/login/login';
import { ensure } from '../../util/streams';
import { AuthenticationProvider } from '../authentication/authentication';
import { ConfirmationProvider } from '../confirmation/confirmation';
import { ErrorResponse, RestProvider } from '../rest/rest';

const AUTH_TOKEN_HEADER = 'X-Auth-Token';

const UNAUTHORIZED = 401;

const GET = 'get';
const POST = 'post';
const PUT = 'put';
const DELETE = 'delete';

@Injectable()
export class AuthRestProvider {

  private loginFinish: Observable<any>;

  // needs to be public for (integration) testing purposes
  get authToken(): string {
    return localStorage.authToken;
  }

  set authToken(token: string) {
    if (!token)
      delete localStorage.authToken;
    else
      localStorage.authToken = token;
  }

  constructor(
    public rest: RestProvider,
    private modal: ModalController,
    private authentication: AuthenticationProvider,
    private confirmation: ConfirmationProvider,
  ) {
  }

  private buildHeaders(authenticate: boolean = true): HttpHeaders {
    let headers = new HttpHeaders();
    if (authenticate && this.authToken) headers = headers.append(AUTH_TOKEN_HEADER, this.authToken);
    return headers;
  }

  private logIn(): Observable<any> {
    if (this.loginFinish) return this.loginFinish;

    const overlay = this.modal.create(LoginComponent, {}, { enableBackdropDismiss: false });
    overlay.present();

    const finishSubject = new Subject();
    this.loginFinish = finishSubject;
    overlay.onDidDismiss((token: string) => {
      this.authToken = token;
      delete this.loginFinish;
      finishSubject.next();
    });
    return finishSubject;
  }

  // XXX: Might semantically better fit to AuthenticationProvider, but lives here for technical reasons:
  //  This one depends on LoginComponent (to display the modal on-the-go when necessary), and adding
  //  having a dependency from AuthenticationProvider to here would cause a circular dependency chain.
  //  This whole setup could use some refactoring.
  logOut() {
    this.get('auth/logout')
      .subscribe(
        () => this.forgetSession(),
        _err => this.confirmation
          .confirm('Logout failed. Do you want to log in as a different user anyway?')
          .subscribe(confirmed => confirmed && this.forgetSession()));
  }

  private forgetSession() {
    this.authToken = null;
    this.authentication.forgetUser();

    // XXX: A bit hacky, maybe `this.logIn()` and manual cleanup instead?
    location.reload();
  }

  private fetchResponse<T>(
    method: string, endpoint: string, authenticate: boolean = true, options = {}
  ): Observable<HttpResponse<T>> {
    const loginAndRetry: () => Observable<HttpResponse<T>> = () => this.logIn().concatMap(() => this.fetchResponse(method, endpoint, authenticate, options));

    if (authenticate && !this.authToken)
      return loginAndRetry();

    return this.rest.fetchResponse(method, endpoint, {
      headers: this.buildHeaders(authenticate),
      ...options
    }).concatMap((response: HttpResponse<Object>): Observable<HttpResponse<Object>> => {
      if (response.status === UNAUTHORIZED)
        return loginAndRetry();

      return Observable.of(response);
    }).catch(error => {
      if (error.status === UNAUTHORIZED)
        return loginAndRetry();

      // XXX: Why is this?
      const body = error.error;
      if (body.message) {
        const message = (body as ErrorResponse).message;
        return Observable.throw(new Error(message));
      }

      return Observable.throw(error);
    });
  }

  private fetchBody<T>(
    method: string, endpoint: string, authenticate: boolean = true, options = {}
  ): Observable<T> {
    return this.fetchResponse(method, endpoint, authenticate, options)
      .concatMap((response: HttpResponse<T>) => Observable.of(response.body));
  }

  public get(endpoint: string, authenticate: boolean = true): Observable<Object> {
    return ensure(this.fetchBody(GET, endpoint, authenticate));
  }

  public getBlob(endpoint: string, authenticate: boolean = true): Observable<Blob> {
    return ensure(this.fetchBody(GET, endpoint, authenticate, { responseType: 'blob' }));
  }

  public post(endpoint: string, body: any): Observable<Object> {
    return ensure(this.fetchBody(POST, endpoint, true, {
      body: body
    }));
  }

  public put(endpoint: string, body: any): Observable<Object> {
    return ensure(this.fetchBody(PUT, endpoint, true, {
      body: body
    }));
  }

  public delete(endpoint: string): Observable<Object> {
    return ensure(this.fetchBody(DELETE, endpoint, true));
  }

  public postResponse(endpoint: string, body: any, authenticate: boolean = true): Observable<HttpResponse<Object>> {
    const action = this.fetchResponse(POST, endpoint, authenticate, {
      body: body,
      // XXX: Maybe not too clean but currently required, as the server sometimes returns non-json (e.g. on login success)
      responseType: 'text'
    });
    return ensure(action);
  }
}
