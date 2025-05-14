import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reader-dashboard',
  templateUrl: './reader-dashboard.component.html',
  styleUrls: ['./reader-dashboard.component.scss']
})
export class ReaderDashboardComponent implements OnInit {
  isCollapsed = false;

  constructor() { }

  ngOnInit(): void {
    console.log('Reader dashboard loaded');
    // 用户将在这里实现读者仪表盘的具体内容
  }

} 