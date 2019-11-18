import { Device } from '@ionic-native/device';
import { ensure } from '../../util/streams';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IS_PROD } from '@environment';
import { Observable } from 'rxjs/Observable';
import { Platform } from 'ionic-angular';
import { ReplaySubject } from 'rxjs';
import { ToastProvider } from '../toast/toast';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/catch';

export interface ErrorResponse {
  message: string;
}

@Injectable()
export class RestProvider {

  private readonly baseUrlObs: Observable<string>;

  constructor(private http: HttpClient, private toast: ToastProvider, platform: Platform, device: Device) {
    const subject = new ReplaySubject<string>(1);
    this.baseUrlObs = subject;

    if (IS_PROD) {
      subject.next('https://somnus.ch/v1');
      subject.complete();
      return;
    }

    platform.ready().then(() => {
      const baseUrl = platform.platforms().indexOf('mobile') >= 0 && device.isVirtual ?
        'http://10.0.2.2:9000/v1' : // android emulator loopback IP
        'http://localhost:9000/v1';
      subject.next(baseUrl);
      subject.complete();
    });
  }

  public fetchResponse(
    method: string, endpoint: string, options = {}
  ): Observable<HttpResponse<Object>> {
    return this.baseUrlObs.flatMap(baseUrl =>
      this.http.request(method, `${baseUrl}/${endpoint}`, {
        observe: 'response',
        ...options
      }).catch((error, caught) => {
        if (error.status === 0)
          this.toast.show('The service cannot be reached at the moment', true);
        return Observable.throw(error);
      }));
  }

  public get(endpoint: string): Observable<Object> {
    return ensure(this.fetchResponse('get', endpoint)).map(r => r.body);
  }

  public getHeaders(endpoint: string): Observable<HttpHeaders> {
    return ensure(this.fetchResponse('get', endpoint)).map(r => r.headers);
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
