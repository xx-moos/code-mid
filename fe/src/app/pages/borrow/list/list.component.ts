import { Component, type OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import { BorrowEditComponent } from '../edit/edit.component';

@Component({
  selector: 'app-borrow-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class BorrowListComponent implements OnInit {
  validateForm!: UntypedFormGroup;

  loading = false;

  search = {
    current: 1,
    size: 10,
    username: '',
    bookName: '',
    status: '',
  };

  lists: any = [];
  totalCount = 0;

  statusList = [
    { value: '', label: '全部' },
    { value: '0', label: '待审核' },
    { value: '1', label: '借阅中' },
    { value: '2', label: '已归还' },
    { value: '3', label: '逾期未还' },
  ];

  getStatusName = (status: string) => {
    const statusObj = this.statusList.find((item) => item.value === status);
    return statusObj ? statusObj.label : '';
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

    this.apiService.get('/borrow/page', { params: this.search }).subscribe(
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

  auditItem = (ids: any) => {
    this.apiService.put('/borrow/audit/' + ids).subscribe(
      (res: any) => {
        this.message.success('审核成功');
        this.loadList(1);
      },
      (err) => {
        this.message.error(err.message);
      }
    );
  };

  addItem = () => {
    const modalRef = this.modal.create({
      nzTitle: '新增图书类别',
      nzContent: BorrowEditComponent,
      nzFooter: null,
    });

    modalRef.afterClose.subscribe((result) => {
      if (result) {
        this.loadList(1);
      }
    });
  };

  editItem = (category: any) => {
    const modalRef = this.modal.create({
      nzTitle: '编辑图书类别',
      nzContent: BorrowEditComponent,
      nzFooter: null,
      nzData: category,
    });

    modalRef.afterClose.subscribe((result) => {
      if (result) {
        this.loadList(1);
      }
    });

    // this.router.navigate(['/admin/book-edit'], {
    //   queryParams: {
    //     type: 'admin',
    //     id: book.id,
    //   },
    // });
  };
}
