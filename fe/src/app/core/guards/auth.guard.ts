import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // 稍后取消注释 -> 取消注释

@Injectable({
  providedIn: 'root', // 或者在 CoreModule 中提供
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  // constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // 这里是基础的 Token 检查逻辑
    // 实际实现需要调用 AuthService 的 isAuthenticated 方法
    const isAuthenticated = this.authService.isAuthenticated(); // 示例调用

    if (isAuthenticated) {
      // 如果已认证，允许访问
      // 后续可以添加角色检查逻辑
      // const expectedRole = route.data?.expectedRole; // 使用 optional chaining
      // const currentRole = this.authService.getUserRole();
      // console.log(`Expected role: ${expectedRole}, Current role: ${currentRole}`); // 调试日志
      // if (expectedRole && currentRole !== expectedRole) {
      //   console.log('Role mismatch, redirecting...'); // 调试日志
      //   // 角色不匹配，可以重定向到无权限页面或首页
      //   return this.router.createUrlTree(['/']); // 或者专门的 /unauthorized 页面
      // }
      return true;
    } else {
      // 如果未认证，重定向到登录页面，并传递当前尝试访问的 URL
      // console.log('Not authenticated, redirecting to login...'); // 调试日志
      return this.router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url },
      });
    }
  }
}
