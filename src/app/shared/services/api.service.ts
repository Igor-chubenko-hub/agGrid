import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Headers {
  [name: string]: string;
}

@Injectable()
export class ApiService {

  constructor(
    private http: HttpClient,
  ) { }

  static setHeaders(headerType): any {
    const headersConf: Headers = {};
    headersConf['Access-Control-Allow-Origin'] = '*';
    if (headerType === 'json') {
      headersConf['Content-Type'] = 'application/json; charset=utf-8';
    } else if (headerType === 'form') {
      headersConf['Content-Type'] = 'application/x-www-form-urlencoded';
    } else if (headerType === 'multipart') {
      headersConf['Content-Type'] = 'multipart/form-data';
    }
    return new HttpHeaders(headersConf);
  }

  static handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    return throwError(error.error.error || 'Something bad happened. Please try again later.');
  }

  get(path: string, headerType: string = 'json'): Observable<any> {
    const headers = ApiService.setHeaders(headerType);

    return this.http.get(path, { headers });
  }

  patch(path: string, headerType: string = 'json'): Observable<any> {
    const headers = ApiService.setHeaders(headerType);

    return this.http.patch(path, {}, { headers });
  }

  post(path: string, body, headerType: string = 'json', responseType?: string): Observable<any> {
    const headers = ApiService.setHeaders(headerType);
    const options: any = { headers };
    if (responseType === 'text') {
      options.responseType = 'text';
    }

    return this.http.post(path, body, options);
  }

  put(path: string, body, headerType: string = 'json', responseType?: string): Observable<any> {
    const headers = ApiService.setHeaders(headerType);
    const options: any = { headers };
    if (responseType === 'text') {
      options.responseType = 'text';
    }

    return this.http.put(path, body, options);
  }

  delete(path: string, headerType?: string): Observable<any> {
    const headers = ApiService.setHeaders(headerType);

    return this.http.delete(path, { headers, responseType : 'text' });
  }

  upload(path, formData, method = 'post'): any {
    const headers = ApiService.setHeaders('');

    return this.http[method](path, formData, {
      reportProgress: true,
      observe: 'events',
      headers
    }).pipe(
      map((event: any) => {
        switch (event.type) {

          case HttpEventType.UploadProgress:
            const progress = Math.round(100 * event.loaded / event.total);
            return { status: 'progress', message: progress };

          case HttpEventType.Response:
            return event.body;
          default:
            return `Unhandled event: ${event.type}`;
        }
      }),
      catchError(ApiService.handleError)
    );
  }

  download(path): Observable<any> {
    const headers = ApiService.setHeaders('json');
    return this.http.get(path, { responseType: 'arraybuffer', headers });
  }
}
