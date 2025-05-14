import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit {
  array = [
    '/assets/lubo/4a708273765b0a115d93d47f3bb73bb2.png',
    '/assets/lubo/5e87dfdc8d63aa4f55a3222e3ac9e425.png',
    '/assets/lubo/05024b83d1e0dcea4a6ca499053ca41f.png',
    '/assets/lubo/d21c0c6b4de77ba1d0130988fc43b012.png',
  ];
  effect = 'scrollx';

  constructor() {}

  ngOnInit(): void {
    console.log('Carousel component loaded');
    // 用户将在这里实现轮播图逻辑
  }
}
