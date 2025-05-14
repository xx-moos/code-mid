import { Component, type OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { Router, ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import dayjs from 'dayjs/esm';

@Component({
  selector: 'app-book-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class BookInfoComponent implements OnInit {
  validateForm!: UntypedFormGroup;

  token = localStorage.getItem('token');

  id: any;

  map: any = {};

  loading = false;

  search = {
    current: 1,
    size: 10,
    title: '',
    category: '',
  };

  constructor(
    private apiService: ApiService,
    private message: NzMessageService,
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private modal: NzModalService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.queryParams['id'];
    this.loadList();
    this.checkCollect();

    this.validateForm = this.fb.group({
      title: ['', []],
      category: ['', []],
    });
  }

  loadList = () => {
    // 加载
    if (this.loading) return;
    this.loading = true;

    this.apiService.get('/book/' + this.id).subscribe(
      (res: any) => {
        this.loading = false;
        console.log(`res ->:`, res);
        this.map = res.data;
        this.map.cover = this.map.cover
          ? `http://localhost:8080${this.map.cover}`.split(',')
          : [];
      },
      (err) => {
        this.loading = false;
        this.message.error(err.message);
      }
    );
  };

  searchSubmit = () => {
    this.loadList();
  };

  sizeChange = (size: number) => {
    console.log(`size ->:`, size);
    this.search.size = size;
    this.loadList();
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

  // 递归把扁平的树结构转换为树结构
  convertToTree = (data: any[], options?: any): any[] => {
    const {
      idKey = 'id',
      parentIdKey = 'parentId',
      childrenKey = 'children',
      rootParentId = null, // 默认根节点的 parentId 是 null
    } = options || {};

    // 创建一个副本进行操作，避免修改原始数组中的对象
    const list = data.map((item: any) => ({ ...item }));
    function buildTreeRecursive(currentParentId: any): any {
      const children: any[] = [];
      for (let i = 0; i < list.length; i++) {
        const item = list[i];

        if (item[parentIdKey] === currentParentId) {
          // 找到一个子节点
          // 从列表中移除该节点，以减少后续迭代的搜索范围 (可选优化，但要注意副作用)
          // const [foundItem] = list.splice(i, 1);
          // i--; // 因为 splice 会改变数组长度和索引
          // 或者不修改 list，直接使用 item
          const node: any = {
            ...item,
            title: item.name,
            key: item.code,
          };
          // 递归查找当前节点的子节点
          const grandChildren = buildTreeRecursive(node[idKey]);
          if (grandChildren.length > 0) {
            node[childrenKey] = grandChildren;
            node.isLeaf = false;
          } else {
            node.isLeaf = true;
          }
          children.push(node);
        }
      }
      return children;
    }
    return buildTreeRecursive(rootParentId);
  };

  gotoDetail = (id: any) => {
    this.router.navigate(['/book-detail', id]);
  };

  returnDate = '';
  borrowBookModalRef: any = null;
  disabledDate = (current: Date): boolean => {
    // 最长期限为当前日期的后两个月
    return current && current > dayjs().add(2, 'month').toDate();
  };

  borrowBook = (id: any, borrowBookModal: any) => {
    this.borrowBookModalRef = this.modal.create({
      nzTitle: '图书借阅',
      nzContent: borrowBookModal,
      nzFooter: null,
    });
  };

  borrowBookRequest = () => {
    if (!this.returnDate) {
      this.message.error('请选择预计归还日期');
      return;
    }
    this.apiService
      .post('/borrow', {
        bookId: this.id,
        returnDate: this.returnDate,
      })
      .subscribe(
        (res: any) => {
          this.message.success('操作成功');
          this.borrowBookModalRef.destroy();
        },
        (err) => {
          this.message.error(err.message);
        }
      );
  };

  collectBook = (id: any) => {
    this.apiService
      .post('/book-collection', {
        bookId: id,
      })
      .subscribe(
        (res: any) => {
          this.message.success('操作成功');
          this.checkCollect();
        },
        (err) => {
          this.message.error(err.message);
        }
      );
  };

  isCollect = false;

  checkCollect = () => {
    this.apiService.get('/book-collection/is-collected/' + this.id).subscribe(
      (res: any) => {
        this.isCollect = res.data;
      },
      (err) => {
        this.message.error(err.message);
      }
    );
  };

  deleteCollect = (id: any) => {
    this.apiService.delete('/book-collection/' + id).subscribe(
      (res: any) => {
        this.message.success('操作成功');
        this.checkCollect();
      },
      (err) => {
        this.message.error(err.message);
      }
    );
  };
}
