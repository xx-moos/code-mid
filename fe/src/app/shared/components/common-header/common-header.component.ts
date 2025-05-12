import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-common-header',
  templateUrl: './common-header.component.html',
  styleUrls: ['./common-header.component.scss'],
})
export class CommonHeaderComponent {
  constructor(private router: Router) {
    this.isShowLogin = false;
  }
  isShowLogin = false;

  isFixMenuDesktop = false;

  loginBoxRef = null;
  captchaUrl = '';
  rules = ['0', '1'];

  loginForm = {
    password: '',
    username: '',
    captchaId: '',
    captcha: '',
  };

  isHover = false;

  hideMenu() {
    this.isHover = false;
  }

  isFullPathActive(path: any) {
    return this.router.url.includes(path);
  }

  showLogin() {
    this.isShowLogin = true;
  }

  logout() {
    this.isShowLogin = false;
  }
}
