import { Component, OnInit, inject } from '@angular/core';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-issue-create',
  standalone: true,
  imports: [
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    ReactiveFormsModule
],
  template: `
    <form [formGroup]="createOrUpdateIssueForm">
      <nz-form-item>
        <nz-form-control nzErrorTip="Issue title is required">
          <label>Title</label>
          <input
            type="text"
            nz-input
            [nzSize]="'large'"
            formControlName="title"
            placeholder="Title"
          />
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-control nzErrorTip="Description must be at least 6 characters">
          <label>Description</label>
          <nz-textarea-count [nzMaxCharacterCount]="200">
            <textarea
              rows="4"
              formControlName="description"
              nz-input
            ></textarea>
          </nz-textarea-count>
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-control nzErrorTip="Status is required">
          <label>Status</label>
          <nz-select
            nzShowSearch
            formControlName="status"
            nzPlaceHolder="Select a status"
          >
            @for (s of option; track s) {
  <nz-option [nzValue]="s" [nzLabel]="s">
              {{ s }}
            </nz-option>
}
          </nz-select>
        </nz-form-control>
      </nz-form-item>
    </form>
  `,
  styles: [
    `
      form {
        display: flex;
        flex-direction: column;
      }
    `,
  ],
})
export class IssueCreateComponent implements OnInit {
  fb = inject(FormBuilder);
  data = inject(NZ_MODAL_DATA);
  isUpdate = false;
  option = ['Not Started', 'Ongoing', 'Completed'];
  createOrUpdateIssueForm = this.fb.group({
    title: this.fb.control('', [Validators.required, Validators.minLength(5)]),
    description: this.fb.control('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    status: this.fb.control('', Validators.required),
  });

  initUpdateIssueForm() {
    this.createOrUpdateIssueForm.patchValue({
      description: this.data.description,
      status: this.option[this.data.status],
      title: this.data.title,
    });
  }

  ngOnInit(): void {
    this.initUpdateIssueForm();
  }
}
