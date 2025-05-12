import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('Admin dashboard loaded');
    // 用户将在这里实现管理员仪表盘的具体内容
  }

} 