import { Component, type OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class CollectListComponent implements OnInit {
  validateForm!: UntypedFormGroup;

  loading = false;

  search = {
    current: 1,
    size: 10,
  };

  lists: any[] = [];
  totalCount = 0;

  constructor(
    private apiService: ApiService,
    private message: NzMessageService,
    private fb: UntypedFormBuilder
  ) {}

  ngOnInit() {
    this.loadList(1);

    this.validateForm = this.fb.group({
      title: ['', []],
      category: ['', []],
    });
  }

  loadList = (page: number) => {
    // 加载
    if (this.loading) return;
    this.loading = true;
    this.search.current = page;

    this.apiService
      .get('/book-collection/my', { params: this.search })
      .subscribe(
        (res: any) => {
          this.loading = false;
          console.log(`res ->:`, res);
          var data = res.data;
          this.lists = data.records || [];
          this.totalCount = data.total || 0;
        },
        (err) => {
          this.loading = false;
          this.message.error(err.message);
        }
      );
  };

  searchSubmit = () => {
    this.loadList(1);
  };

  sizeChange = (size: number) => {
    this.loadList(size);
  };

  deleteItem = (id: any) => {
    this.apiService.delete(`/book-collection/${id}`).subscribe((res: any) => {
      this.message.success('删除成功');
      this.loadList(1);
    });
  };
}
