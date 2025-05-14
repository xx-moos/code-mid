import { Component, OnInit, Output } from '@angular/core';
import SwiperCore, { Navigation, Thumbs } from 'swiper';

SwiperCore.use([Navigation, Thumbs]);

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  inputs: ['fileList'],
})
export class BannerComponent implements OnInit {
  @Output() fileList: any[] = [];

  ngOnInit() {}

  thumbsSwiper: any;

  onSwiper(swiper: any) {}
  onSlideChange() {}

  setThumbsSwiper(swiper: any) {
    this.thumbsSwiper = swiper;
  }
}
