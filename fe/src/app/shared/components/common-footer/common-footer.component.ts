import { Component } from '@angular/core';

@Component({
  selector: 'app-common-footer',
  templateUrl: './common-footer.component.html',
  styleUrls: ['./common-footer.component.scss'],
})
export class CommonFooterComponent {
  public order = ''; // 对应 Vue 中的 $order
  public likeList: any = [
    { id: 1, wangzhi: 'https://angular.io', wangzhanmingcheng: 'Angular 官网' },
    { id: 2, wangzhi: 'https://example.com', wangzhanmingcheng: '示例链接' },
    {
      id: 3,
      wangzhi: 'https://anotherexample.com',
      wangzhanmingcheng: '另一个示例',
    },
  ];
  constructor() {} // 注入 DataService
  ngOnInit(): void {
    this.loadLikeList();
  }
  async loadLikeList(): Promise<void> {}
}
