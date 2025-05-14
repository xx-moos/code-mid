import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service'; // Correct path
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  returnUrl: string = '/'; // Default return URL

  config = {
    title: '图书管理系统',
  };
  captchUrl: string = '';
  captchaId: string = '';
  loading: boolean = false;
  captchCode: string = '';

  form = {
    username: '',
    password: '',
    role: '0',

    captcha: '',
  };

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // 获取重定向 URL (如果有)
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    // console.log('Login component loaded, return URL:', this.returnUrl);
    this.form.role = '0';
    this.loadCaptch();
  }

  loadCaptch() {
    this.apiService.get<any>('/auth/captcha').subscribe((res) => {
      this.captchUrl = res?.data?.captchaImg;
      this.captchaId = res?.data?.captchaId;
    });
  }

  // 用户将在这里实现登录表单逻辑并调用此方法
  login(): void {
    console.log('Attempting login with:', this.form);
    this.apiService
      .post<any>('/auth/login', { ...this.form, captchaId: this.captchaId })
      .subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          localStorage.setItem(
            'userInfo',
            JSON.stringify(response.data?.user || null)
          );
          localStorage.setItem('token', response.data?.token || '');

          if (response.data?.user?.role == 1) {
            this.router.navigateByUrl('/admin/user-list?type=admin');
          } else {
            this.router.navigateByUrl('/reader/borrow-list');
          }
        },
        error: (error) => {
          console.error('Login failed:', error);
          // 显示错误消息给用户
        },
      });
  }
}
