import { Component, type OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiService } from '../../../core/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-borrow-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class BorrowEditComponent implements OnInit {
  id: number = 0;
  type: string = '';

  token: string = '';

  categoryList: any[] = [];

  editData: any = {};

  ngOnInit(): void {
    this.getCategoryList();

    this.getInfoData();
    this.token = localStorage.getItem('token') || '';
  }

  validateForm: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private message: NzMessageService,
    private ApiService: ApiService,
    private route: ActivatedRoute,
    private modalRef: NzModalRef
  ) {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      code: [null, [Validators.required]],
      parentId: [null, []],
    });
  }

  submit() {
    console.log(`this.validateForm.value ->:`, this.validateForm.value);
    if (!this.validateForm.valid) {
      this.message.error('请填写完整信息');
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    if (this.editData.id) {
      this.ApiService.put('/categories/' + this.editData.id, {
        ...this.validateForm.value,
        id: this.editData.id,
      }).subscribe(
        (res) => {
          console.log(res);
          this.message.success('操作成功');
          this.resetForm();
          this.modalRef.close(true);
        },
        (error) => {
          console.log(error);
          this.message.error('操作失败');
        }
      );
    } else {
      this.ApiService.post('/categories', {
        ...this.validateForm.value,
      }).subscribe(
        (res) => {
          console.log(res);
          this.message.success('操作成功');
          this.resetForm();
          this.modalRef.close(true);
        },
        (error) => {
          console.log(error);
          this.message.error('操作失败');
        }
      );
    }
  }

  resetForm(): void {
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsPristine();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
  }

  handleChange(info: any): void {
    if (info.file.status !== 'uploading') {
      console.log(`info.file ->:`, info.file);
    }
    if (info.file.status === 'done') {
      this.validateForm.patchValue({
        cover: info.file.response.data || '',
      });
    } else if (info.file.status === 'error') {
      this.message.error('上传失败');
    }
  }

  setDefaultAvatar(event: any) {
    event.preventDefault();
  }

  getInfoData() {
    const res = this.modalRef.getConfig()?.nzData;
    this.editData = res;
    console.log(`res ->:`, res);
    this.validateForm.patchValue({
      name: res.name,
      code: res.code,
      parentId: res.parentId,
    });
  }

  getCategoryList() {
    this.ApiService.get('/categories/list').subscribe((res: any) => {
      this.categoryList = res.data || [];
    });
  }
}
