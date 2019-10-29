import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class ApiService {

  constructor(
    private http: HttpClient,
  ) { }
  static setHeaders(headerType): any {
    const contentType = {
      json: 'application/json; charset=utf-8',
      form: 'application/x-www-form-urlencoded',
      multipart: 'multipart/form-data',
    };

    return new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': contentType[headerType]
    });
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
}
