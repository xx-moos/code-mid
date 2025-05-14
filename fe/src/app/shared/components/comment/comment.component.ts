import { Component, OnInit, Output } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

// 敏感词数组
const sensitiveWords = ['敏感词1', '敏感词2', '敏感词3', 'cao', 'tm'];

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  bookId = '';
  validateForm!: UntypedFormGroup;

  lists: any[] = [];

  selectedComment: any = {};

  constructor(
    private fb: UntypedFormBuilder,
    private ApiService: ApiService,
    private route: ActivatedRoute,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      star: [null, Validators.required],
      content: ['', Validators.required],
    });
    this.bookId = this.route.snapshot.queryParams['id'];
    this.getComments();
  }

  getComments() {
    this.ApiService.get(`/api/book-comment/page`, {
      params: {
        bookId: this.bookId,
        current: 1,
        size: 9999,
        status: 1,
      },
    }).subscribe((res: any) => {
      this.lists = res.data.records.map((v: any) => {
        return {
          ...v,
          star: Number(v.star),
        };
      });
      console.log(`this.lists ->:`, this.lists);
    });
  }

  submitComment() {
    if (this.validateForm.valid) {
      const content = this.validateForm.value.content;
      const isSensitive = sensitiveWords.some((word) => content.includes(word));
      if (isSensitive) {
        this.message.error('评论内容包含敏感词,请重新输入');
        return;
      }
      this.ApiService.post(`/api/book-comment`, {
        ...this.validateForm.value,
        bookId: this.bookId,
        parentId: this.selectedComment.id,
      }).subscribe((res: any) => {
        this.validateForm.reset();
        this.getComments();
        this.message.success('操作成功');
        this.selectedComment = {};
      });
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  replyComment(comment: any) {
    console.log(`comment ->:`, comment);
    this.selectedComment = comment;
  }

  cancelReply() {
    this.selectedComment = {};
  }
}
