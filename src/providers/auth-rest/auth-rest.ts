import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { RestProvider } from '../rest/rest';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { ensure } from '../../util/streams'
import { LoginComponent } from '../../components/login/login';

const AUTH_TOKEN_HEADER = 'X-Auth-Token';

const UNAUTHORIZED = 401;

const GET = 'get';
const POST = 'post';
// const PUT = 'put';
// const DELETE = 'delete';

@Injectable()
export class AuthRestProvider {

  private get authToken(): string {
    return localStorage.authToken;
  }

  private set authToken(token: string) {
    if (!token)
      delete localStorage.authToken;
    else
      localStorage.authToken = token;
  }

  constructor(public rest: RestProvider, private modal: ModalController) {
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
    overlay.onDidDismiss((token: string) => {
      this.authToken = token;
      finishSubject.next();
    });
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

    return this.rest.fetchResponse(method, endpoint, {
      headers: this.buildHeaders(authenticate),
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
    return ensure(this.fetchBody(GET, endpoint, authenticate));
  }

  public post(endpoint: string, body: any): Observable<Object> {
    return ensure(this.fetchBody(POST, endpoint, true, {
      body: body
    }));
  }

  public postResponse(endpoint: string, body: any, authenticate: boolean = true): Observable<HttpResponse<Object>> {
    const action = this.fetchResponse(POST, endpoint, authenticate, {
      body: body,
      // XXX: Maybe not too clean but currently required, as the server sometimes returns non-json (e.g. on login success)
      responseType: 'text'
    })
    return ensure(action);
  }
}
