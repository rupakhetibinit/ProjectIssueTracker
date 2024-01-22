import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-create-or-update-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule
],
  templateUrl: './create-or-update-dialog.component.html',
  styleUrls: ['./create-or-update-dialog.component.scss'],
})
export class CreateOrUpdateDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  readonly dialogData = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef);
  projectCreateOrUpdateForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
  });

  ngOnInit(): void {}

  createOrUpdateProject() {
    this.dialogRef.close({
      data: this.projectCreateOrUpdateForm.value,
    });
  }
}
