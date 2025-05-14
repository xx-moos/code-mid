import { Component, type OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class NoteListComponent implements OnInit {
  validateForm!: UntypedFormGroup;

  loading = false;

  search = {
    current: 1,
    size: 10,
    title: '',
    category: '',
  };

  lists: any = [];
  totalCount = 0;

  nodes = [
    { title: 'Expand to load', key: '0' },
    { title: 'Expand to load', key: '1' },
    { title: 'Tree Node', key: '2', isLeaf: true },
  ];

  nzEvent(event: any): void {
    console.log(`event ->:`, event);
    this.search.category = event.node.key;
    this.loadList(1);
  }

  loadNode(): any {
    this.apiService.get('/categories/list').subscribe((res: any) => {
      console.log(`res ->:`, res);
    });
    return [];
  }

  constructor(
    private apiService: ApiService,
    private message: NzMessageService,
    private fb: UntypedFormBuilder,
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

    this.apiService
      .get('/api/public/announcements', { params: this.search })
      .subscribe(
        (res: any) => {
          this.loading = false;
          var data = res;
          this.lists = data.list || [];
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
    console.log(`size ->:`, size);
    this.search.size = size;
    this.loadList(1);
  };

  deleteItems = (ids: any) => {
    // return new Promise((resolve, reject) => {
    //     ElMessageBox.confirm("确定删除？")
    //         .then((res) => {
    //             canTushuxinxiDelete(ids).then((res) => {
    //                 if (res.code == 0) {
    //                     ElMessage.success("删除成功");
    //                     loadList(search.page);
    //                     resolve(res.data);
    //                 } else {
    //                     ElMessage.error(res.msg);
    //                 }
    //             });
    //         })
    //         .catch((err) => {
    //             reject(err);
    //         });
    // });
  };

  // 把扁平的树结构转换为树结构
  convertToTree = (data: any[]): any[] => {
    return data.map((item: any) => {
      return {
        title: item.categoryName,
        key: item.categoryId,
        isLeaf: item.children.length === 0,
        children: item.children ? this.convertToTree(item.children) : [],
      };
    });
  };

  gotoDetail = (id: any) => {
    this.router.navigate(['/note-info'], {
      queryParams: {
        id: id,
      },
    });
  };
}
