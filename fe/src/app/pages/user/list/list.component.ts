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
export class UserListComponent implements OnInit {
  validateForm!: UntypedFormGroup;

  loading = false;

  search = {
    current: 1,
    size: 10,
    username: '',
  };

  lists: any = [];
  totalCount = 0;

  constructor(
    private apiService: ApiService,
    private message: NzMessageService,
    private fb: UntypedFormBuilder,
    private modal: NzModalService,
    private router: Router
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

    this.apiService.get('/user/page', { params: this.search }).subscribe(
      (res: any) => {
        this.loading = false;
        console.log(`res ->:`, res);
        var data = res.data;
        this.lists = data?.records || [];
        console.log(`this.lists ->:`, this.lists);
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

  deleteUser = (ids: any) => {
    console.log(`ids ->:`, ids);
    this.apiService.delete('/user/' + ids).subscribe(
      (res: any) => {
        this.message.success('删除成功');
        this.loadList(1);
      },
      (err) => {
        this.message.error(err.message);
      }
    );
  };

  addUser = () => {
    this.router.navigate(['/admin/user-edit'], {
      queryParams: {
        type: 'admin',
      },
    });
  };

  editUser = (user: any) => {
    this.router.navigate(['/admin/user-edit'], {
      queryParams: {
        type: 'admin',
        id: user.id,
      },
    });
  };
}
