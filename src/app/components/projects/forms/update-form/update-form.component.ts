import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../project.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-update-form',
  standalone: true,
  imports: [CommonModule, NzFormModule, NzInputModule, ReactiveFormsModule],
  templateUrl: './update-form.component.html',
  styleUrls: ['./update-form.component.scss'],
})
export class UpdateFormComponent implements OnInit {
  // @Input() updateValues!: Pick<Project, 'name' | 'description'>;

  data = inject(NZ_MODAL_DATA);
  private readonly fb = inject(FormBuilder);
  editForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
  });

  ngOnInit(): void {
    console.log(this.data);
    this.editForm.patchValue({
      name: this.data.name,
      description: this.data.description,
    });
  }
}
