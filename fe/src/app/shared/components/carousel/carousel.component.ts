import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit {

  array = [1, 2, 3, 4];
  effect = 'scrollx';

  constructor() { }

  ngOnInit(): void {
    console.log('Carousel component loaded');
    // 用户将在这里实现轮播图逻辑
  }

} 