import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // 未来可以考虑将 baseUrl 提取到环境配置中
  // import { environment } from 'src/environments/environment';
  // private baseUrl = environment.apiUrl;
  private baseUrl = 'http://localhost:8080/bapi';
  constructor(private http: HttpClient) {}

  /**
   * 发送 GET 请求
   * @template T 响应数据的预期类型
   * @param endpoint 请求路径 (若配置了 baseUrl, 此为相对路径)
   * @param options 可选的请求配置 (HttpParams, HttpHeaders 等)
   * @returns Observable<T> 响应数据的 Observable
   */
  get<T>(
    endpoint: string,
    options?: {
      params?:
        | HttpParams
        | {
            [param: string]:
              | string
              | number
              | boolean
              | ReadonlyArray<string | number | boolean>;
          };
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body';
      responseType?: 'json';
    }
  ): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = localStorage.getItem('token');

    const feature = {
      ...options,
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : '',
      }),
    };

    return this.http.get<T>(url, feature).pipe(catchError(this.handleError));
  }

  /**
   * 发送 POST 请求
   * @template T 响应数据的预期类型
   * @param endpoint 请求路径 (若配置了 baseUrl, 此为相对路径)
   * @param body 请求体
   * @param options 可选的请求配置 (HttpParams, HttpHeaders 等)
   * @returns Observable<T> 响应数据的 Observable
   */
  post<T>(
    endpoint: string,
    body: any | null,
    options?: {
      params?:
        | HttpParams
        | {
            [param: string]:
              | string
              | number
              | boolean
              | ReadonlyArray<string | number | boolean>;
          };
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body';
      responseType?: 'json';
    }
  ): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = localStorage.getItem('token');

    const feature = {
      ...options,
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : '',
      }),
    };
    return this.http
      .post<T>(url, body, feature)
      .pipe(catchError(this.handleError));
  }

  delete<T>(
    endpoint: string,
    options?: {
      params?:
        | HttpParams
        | {
            [param: string]:
              | string
              | number
              | boolean
              | ReadonlyArray<string | number | boolean>;
          };
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body';
      responseType?: 'json';
    }
  ): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = localStorage.getItem('token');

    const feature = {
      ...options,
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : '',
      }),
    };
    return this.http.delete<T>(url, feature).pipe(catchError(this.handleError));
  }

  put<T>(
    endpoint: string,
    body?: any | null,
    options?: {
      params?: HttpParams | { [param: string]: string | string[] };
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body';
      responseType?: 'json';
    }
  ): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = localStorage.getItem('token');

    const feature = {
      ...options,
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : '',
      }),
    };
    return this.http
      .put<T>(url, body, feature)
      .pipe(catchError(this.handleError));
  }

  /**
   * 私有错误处理方法
   * @param error HTTP 错误响应对象
   * @returns 返回一个包含错误信息的 Observable，供调用者处理
   */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // 客户端或网络错误
      console.error('发生客户端或网络错误:', error.error.message);
    } else {
      // 后端返回了不成功的响应码
      // 响应体可能包含错误原因的详细信息
      console.error(
        `后端返回错误代码 ${error.status}, ` +
          `错误详情: ${JSON.stringify(error.error)}`
      );
    }
    // 返回一个对调用者友好的错误信息
    // 在实际应用中，这里可能需要更复杂的错误转换和用户通知逻辑
    return throwError(
      () => new Error('请求处理失败，请稍后再试或联系技术支持。')
    );
  }
}
