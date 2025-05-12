import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // 可能需要用于 API 调用
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' // 或者在 CoreModule 中提供
})
export class AuthService {
  // 使用 BehaviorSubject 来跟踪认证状态，初始为 false
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) { }

  // 暴露认证状态的 Observable
  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  // 检查本地存储中是否有 Token
  private hasToken(): boolean {
    // 实际检查 localStorage 或 sessionStorage
    return !!localStorage.getItem('authToken'); 
  }

  // 登录方法 (示例: 实际应调用 API)
  login(credentials: any): Observable<any> {
    console.log('Login attempt with:', credentials);
    // 示例: 模拟 API 调用
    // return this.http.post<any>('/api/login', credentials).pipe(
    //   tap(response => {
    //     if (response && response.token) {
    //       localStorage.setItem('authToken', response.token);
    //       // 可以存储用户信息，例如角色
    //       // localStorage.setItem('userRole', response.role);
    //       this.loggedIn.next(true);
    //     }
    //   })
    // );
    
    // --- 模拟成功登录 ---
    localStorage.setItem('authToken', 'fake-jwt-token');
    localStorage.setItem('userRole', 'reader'); // 默认模拟为 reader
    this.loggedIn.next(true);
    return of({ success: true, token: 'fake-jwt-token', role: 'reader' }); // 返回 Observable
    // --- 模拟结束 ---
  }

  // 注销方法
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    this.loggedIn.next(false);
    // 可能需要导航到登录页
    // this.router.navigate(['/login']);
  }

  // 检查是否认证的方法
  isAuthenticated(): boolean {
    // 可以添加更复杂的 Token 验证逻辑 (例如检查过期时间)
    return this.hasToken();
  }

  // 获取用户角色 (示例)
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  // 获取 Token (如果需要直接访问)
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
} 