import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ReaderDashboardComponent } from './pages/reader/reader-dashboard.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard.component';
import { CarouselComponent } from './shared/components/carousel/carousel.component';
import { CommonHeaderComponent } from './shared/components/common-header/common-header.component';
import { CommonFooterComponent } from './shared/components/common-footer/common-footer.component';
import { EContainerComponent } from './shared/components/e-container/e-container.component';
import { ListComponent } from './pages/book/list/list.component';
import { NoteListComponent } from './pages/note/list/list.component';
import { UserEditComponent } from './pages/user/edit/edit.component';
import { BookListComponent } from './pages/book/admin-list/list.component';
import { BookEditComponent } from './pages/book/admin-edit/edit.component';
import { UserListComponent } from './pages/user/list/list.component';
import { CategoryListComponent } from './pages/category/list/list.component';
import { CategoryEditComponent } from './pages/category/edit/edit.component';
import { BorrowAdminListComponent } from './pages/borrow/admin-list/list.component';
import { BorrowListComponent } from './pages/borrow/list/list.component';
import { NoteAdminListComponent } from './pages/note/admin-list/list.component';
import { NoteAdminEditComponent } from './pages/note/admin-edit/edit.component';
import { CommentAdminListComponent } from './pages/comment/admin-list/list.component';
import { CommentAdminEditComponent } from './pages/comment/admin-edit/edit.component';
import { BookInfoComponent } from './pages/book/info/info.component';

import { BannerComponent } from './shared/components/banner/banner.component';
import { CommentComponent } from './shared/components/comment/comment.component';

import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzRateModule } from 'ng-zorro-antd/rate';

import { AuthService } from './core/services/auth.service';
import { AuthGuard } from './core/guards/auth.guard';
import { ReactiveFormsModule } from '@angular/forms';
import { SwiperModule } from 'swiper/angular';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    HomeComponent,
    LoginComponent,
    ReaderDashboardComponent,
    AdminDashboardComponent,
    CarouselComponent,
    CommonHeaderComponent,
    CommonFooterComponent,
    EContainerComponent,
    ListComponent,
    NoteListComponent,

    UserListComponent,
    UserEditComponent,

    BookListComponent,
    BookEditComponent,
    BookInfoComponent,

    CategoryListComponent,
    CategoryEditComponent,

    BorrowAdminListComponent,
    BorrowListComponent,

    NoteAdminListComponent,
    NoteAdminEditComponent,

    CommentAdminListComponent,
    CommentAdminEditComponent,

    BannerComponent,
    CommentComponent,
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzCarouselModule,
    NzButtonModule,
    NzGridModule,
    NzImageModule,
    NzRadioModule,
    NzCardModule,
    NzFormModule,
    NzMessageModule,
    NzTableModule,
    NzPaginationModule,
    NzInputModule,
    NzTreeModule,
    NzUploadModule,
    NzSelectModule,
    NzSpaceModule,
    NzModalModule,
    NzPopconfirmModule,
    NzDatePickerModule,
    NzTabsModule,
    NzRateModule,
    SwiperModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }, AuthService, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
