import { Component, type OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class CommentListComponent implements OnInit {
  validateForm!: UntypedFormGroup;

  loading = false;

  search = {
    current: 1,
    size: 10,
    bookId: '',
  };

  lists: any = [];
  totalCount = 0;

  // 0-待审核, 1-审核通过，2-审核拒绝
  statusMap: any = {
    0: '待审核',
    1: '审核通过',
    2: '审核拒绝',
  };

  constructor(
    private apiService: ApiService,
    private message: NzMessageService,
    private fb: UntypedFormBuilder,
    private modal: NzModalService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadList(1);
  }

  loadList = (page: number) => {
    // 加载
    if (this.loading) return;
    this.loading = true;
    this.search.current = page;

    this.apiService
      .get('/api/book-comment/all', { params: this.search })
      .subscribe(
        (res: any) => {
          this.loading = false;
          var data = res.data;
          this.lists = data?.records || [];
          this.totalCount = data?.total || 0;
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
    this.apiService
      .delete('/api/book-comment/' + id)
      .subscribe(
        (res: any) => {
          this.message.success('成功');
          this.loadList(1);
        },
        (err) => {
          this.message.error(err.message);
        }
      );
  };

  
}
