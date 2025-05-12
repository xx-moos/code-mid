import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service'; // Correct path

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  returnUrl: string = '/'; // Default return URL

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // 获取重定向 URL (如果有)
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    console.log('Login component loaded, return URL:', this.returnUrl);
  }

  // 用户将在这里实现登录表单逻辑并调用此方法
  loginUser(formData: any): void {
    console.log('Attempting login with:', formData);
    this.authService.login(formData).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        // 根据角色导航
        const role = this.authService.getUserRole();
        let navigateTo = this.returnUrl;
        // 如果返回 URL 是登录页或未定义，则根据角色决定去向
        if (navigateTo === '/' || navigateTo === '/login') {
           navigateTo = (role === 'admin') ? '/admin/dashboard' : '/reader/dashboard'; // 假设读者默认页
        }
        console.log(`Navigating to: ${navigateTo}`);
        this.router.navigateByUrl(navigateTo);
      },
      error: (error) => {
        console.error('Login failed:', error);
        // 显示错误消息给用户
      }
    });
  }
} 