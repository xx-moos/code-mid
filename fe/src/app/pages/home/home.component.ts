import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import dayjs from 'dayjs/esm/index.js';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  gonggaoxinxilist: any[] = [];

  token: string = localStorage.getItem('token') || '';
  userId: string = JSON.parse(localStorage.getItem('userInfo') || '{}').id;

  hotBooks: any[] = [];

  tushuxinxilist1: any[] = [];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    console.log('Home component loaded');
    // 用户将在这里实现轮播图和其他首页逻辑

    this.getGonggaoxinxilist();
    this.getHotBooks();
    this.getTushuxinxilist1();
  }

  resetDate(format: string, date: string): string {
    return dayjs(date).format(format);
  }

  goto(url: string, id: string) {
    this.router.navigate([url], { queryParams: { id } });
  }

  getGonggaoxinxilist() {
    this.api
      .get('/api/public/announcements', {
        params: {
          page: 1,
          pageSize: 5,
        },
      })
      .subscribe((res: any) => {
        this.gonggaoxinxilist = res.list || [];
      });
  }

  getHotBooks() {
    this.api
      .get('/book/hotBooks', {
        params: {},
      })
      .subscribe((res: any) => {
        this.hotBooks = res.data || [];
      });
  }

  getTushuxinxilist1() {
    if (!this.token) {
      this.tushuxinxilist1 = this.hotBooks;
      return;
    }

    console.log(`this.userId ->:`, this.userId);

    this.api
      .get('/api/recommendations/user/' + this.userId)
      .subscribe((res: any) => {
        this.tushuxinxilist1 = res.data || [];
      });
  }
}
