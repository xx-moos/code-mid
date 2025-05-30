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
import { NoteAdminListComponent } from './pages/note/admin-list/list.component';
import { UserEditComponent } from './pages/user/edit/edit.component';
import { UserListComponent } from './pages/user/list/list.component';
import { BookEditComponent } from './pages/book/admin-edit/edit.component';
import { BookListComponent } from './pages/book/admin-list/list.component';
import { BorrowAdminListComponent } from './pages/borrow/admin-list/list.component';
import { BorrowListComponent } from './pages/borrow/list/list.component';
import { CommentAdminListComponent } from './pages/comment/admin-list/list.component';
import { BookInfoComponent } from './pages/book/info/info.component';
import { CategoryListComponent } from './pages/category/list/list.component';

import { CollectListComponent } from './pages/collection/list/list.component';
import { CommentListComponent } from './pages/comment/list/list.component';
import { NoteInfoComponent } from './pages/note/info/list.component';

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
      { path: 'book-info', component: BookInfoComponent },
      { path: 'note-list', component: NoteListComponent },
      { path: 'note-info', component: NoteInfoComponent },
      { path: 'user-edit', component: UserEditComponent },
    ],
  },
  // 读者区域路由 (需要登录)
  {
    path: 'reader',
    canActivate: [AuthGuard], // 使用认证守卫
    component: ReaderDashboardComponent,
    children: [
      { path: '', redirectTo: 'borrow-list', pathMatch: 'full' }, // 默认重定向到仪表盘
      { path: 'borrow-list', component: BorrowListComponent },
      { path: 'collect-list', component: CollectListComponent },
      { path: 'comment-list', component: CommentListComponent },
    ],
  },
  // 管理员区域路由 (需要登录和角色验证 - 在 AuthGuard 中实现或使用 RoleGuard)
  {
    path: 'admin',
    canActivate: [AuthGuard], // 使用认证守卫 (需要包含角色检查)
    data: { expectedRole: 'admin' }, // 将期望角色传递给守卫
    component: AdminDashboardComponent,
    children: [
      { path: '', redirectTo: 'user-list', pathMatch: 'full' },
      // { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'user-list', component: UserListComponent },
      { path: 'user-edit', component: UserEditComponent },

      { path: 'book-list', component: BookListComponent },
      { path: 'book-edit', component: BookEditComponent },

      { path: 'category-list', component: CategoryListComponent },
      { path: 'borrow-list', component: BorrowAdminListComponent },

      { path: 'note-list', component: NoteAdminListComponent },

      { path: 'comment-list', component: CommentAdminListComponent },
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
