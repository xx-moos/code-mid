import { Component, type OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
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
      this.nodes = this.convertToTree(res.data);
      console.log(`this.nodes ->:`, this.nodes);
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
    this.loadNode();

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

    this.apiService.get('/book/page', { params: this.search }).subscribe(
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
}
