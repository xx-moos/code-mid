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

import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzRadioModule } from 'ng-zorro-antd/radio';


import { AuthService } from './core/services/auth.service';
import { AuthGuard } from './core/guards/auth.guard';

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
    EContainerComponent
  ],
  imports: [
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
    NzRadioModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
