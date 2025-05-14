import { Component, type OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class NoteInfoComponent implements OnInit {
  validateForm!: UntypedFormGroup;

  loading = false;

  id = '';

  search = {
    current: 1,
    size: 10,
    title: '',
  };

  map: any = {};

  constructor(
    private apiService: ApiService,
    private message: NzMessageService,
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.queryParams['id'];
    this.loadList();
  }

  loadList = () => {
    this.apiService.get('/api/public/announcements/' + this.id).subscribe(
      (res: any) => {
        console.log(`res ->:`, res);
        this.loading = false;
        this.map = res;
      },
      (err) => {
        this.loading = false;
        this.message.error(err.message);
      }
    );
  };
}
