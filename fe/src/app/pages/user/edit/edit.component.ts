import { Component, type OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiService } from '../../../core/services/api.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class UserEditComponent implements OnInit {
  id: number = 0;
  type: string = '';

  token: string = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
      this.type = params['type'];
    });

    if (this.id) {
      this.getUserInfo();
    }

    this.token = localStorage.getItem('token') || '';
  }
  validateForm: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private message: NzMessageService,
    private ApiService: ApiService,
    private route: ActivatedRoute
  ) {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      realName: [null, [Validators.required]],
      phone: [null, []],
      email: [null, []],
      avatar: [null, []],
      role: ['0', []],
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

    this.ApiService.post('/user', {
      ...this.validateForm.value,
    }).subscribe(
      (res) => {
        console.log(res);
        this.message.success('注册成功');
        this.resetForm();
      },
      (error) => {
        console.log(error);
        this.message.error('注册失败');
      }
    );
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
        avatar: info.file.response.data || '',
      });
    } else if (info.file.status === 'error') {
      this.message.error('上传失败');
    }
  }

  setDefaultAvatar(event: any) {
    event.preventDefault();
  }

  getUserInfo() {
    this.ApiService.get('/user/' + this.id).subscribe((res: any) => {
      console.log(`res ->:`, res);
      this.validateForm.patchValue({
        username: res.data.username,
        password: res.data.password,
        realName: res.data.realName,
        phone: res.data.phone,
        email: res.data.email,
        avatar: res.data.avatar,
        role: res.data.role,
      });
    });
  }
}
