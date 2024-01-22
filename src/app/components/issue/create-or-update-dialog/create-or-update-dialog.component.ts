import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { IssuesStore } from 'src/app/services/issues.store';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-create-or-update-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    FormsModule
],
  providers: [IssuesStore],
  templateUrl: './create-or-update-dialog.component.html',
  styleUrls: ['./create-or-update-dialog.component.scss'],
})
export class CreateOrUpdateDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  id!: string;
  isUpdate: boolean = false;
  private readonly matDialogData = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef);
  createOrUpdateIssueForm = this.fb.group({
    title: this.fb.control('', [Validators.required, Validators.minLength(5)]),
    description: this.fb.control('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    status: this.fb.control('', Validators.required),
  });

  initUpdateIssueForm() {
    console.log(this.matDialogData);
    this.createOrUpdateIssueForm.patchValue({
      description: this.matDialogData.description,
      title: this.matDialogData.title,
      status: this.option[this.matDialogData.status],
    });
  }

  ngOnInit(): void {
    if (this.matDialogData.description) {
      this.initUpdateIssueForm();
      this.isUpdate = true;
    }
  }
  option = ['Not Started', 'Ongoing', 'Completed'];

  createIssue() {
    const index = this.option.findIndex(
      (v) => v === this.createOrUpdateIssueForm.value.status
    );

    if (this.createOrUpdateIssueForm.valid) {
      if (this.isUpdate) {
        this.dialogRef.close({
          data: {
            description: this.createOrUpdateIssueForm.value.description!,
            title: this.createOrUpdateIssueForm.value.title!,
            status: index,
            id: this.matDialogData.id,
          },
        });
      } else {
        this.dialogRef.close({
          data: {
            description: this.createOrUpdateIssueForm.value.description!,
            title: this.createOrUpdateIssueForm.value.title!,
            status: index,
          },
        });
      }
    }
  }
}
