import { Component, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  gonggaoxinxilist: any[] = [];

  tushuxinxilist: any[] = [];

  tushuxinxilist1: any[] = [];

  constructor() { }

  ngOnInit(): void {
    console.log('Home component loaded');
    // 用户将在这里实现轮播图和其他首页逻辑
  }

  resetDate(format: string, date: string): string {
    return dayjs(date).format(format);
  }

  goto(url: string) {
    window.location.href = url;
  }

  getGonggaoxinxilist() {
    // this.http.get<any>('http://localhost:3000/gonggaoxinxilist').subscribe(res => {
    //   this.gonggaoxinxilist = res;
    // });
  }

  getTushuxinxilist() {
    // this.http.get<any>('http://localhost:3000/tushuxinxilist').subscribe(res => {
    //   this.tushuxinxilist = res;
    // });
  }

  getTushuxinxilist1() {
    // this.http.get<any>('http://localhost:3000/tushuxinxilist1').subscribe(res => {
    //   this.tushuxinxilist1 = res;
    // });
  }
  


} 