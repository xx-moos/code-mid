import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// 导入所需组件和守卫
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ReaderDashboardComponent } from './pages/reader/reader-dashboard.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ListComponent } from './pages/book/list/list.component';
import { NoteListComponent } from './pages/note/list/list.component';

const routes: Routes = [
  // 公共路由: 登录页
  { path: 'login', component: LoginComponent },

  // 主布局路由 (包含公共页眉/页脚等)
  {
    path: '', // 应用于根路径及其子路径
    component: MainLayoutComponent,
    children: [
      // 默认展示首页 (对所有用户可见)
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'book-list', component: ListComponent },
      { path: 'note-list', component: NoteListComponent },
      // 读者区域路由 (需要登录)
      {
        path: 'reader',
        // canActivate: [AuthGuard], // 使用认证守卫
        // 可以在这里添加 canActivateChild 守卫进行更细粒度的控制
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // 默认重定向到仪表盘
          // { path: 'dashboard', component: ReaderDashboardComponent },
          // ... 其他读者页面路由
        ],
      },
      // 管理员区域路由 (需要登录和角色验证 - 在 AuthGuard 中实现或使用 RoleGuard)
      {
        path: 'admin',
        canActivate: [AuthGuard], // 使用认证守卫 (需要包含角色检查)
        data: { expectedRole: 'admin' }, // 将期望角色传递给守卫
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: AdminDashboardComponent },
          // ... 其他管理员页面路由
        ],
      },
      // ... 其他需要主布局的公共页面路由可以放在这里
    ],
  },

  // 通配符路由: 匹配所有未定义的路径，重定向到首页
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })], // 保持 useHash: true 或根据需要修改
  exports: [RouterModule],
})
export class AppRoutingModule {}
