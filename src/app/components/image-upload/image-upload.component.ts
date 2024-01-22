import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment';
import { MatIconModule } from '@angular/material/icon';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent {
  fileName = '';

  form!: FormGroup;
  file!: File;
  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    this.fileName = this.file.name;
  }
  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
    });
  }

  upload() {
    if (this.file) {
      const formData = new FormData();

      formData.append('file', this.file);
      formData.append('email', this.form.value.email);

      const upload$ = this.http.post(
        environment.baseUrl + '/auth/image-upload',
        formData
      );

      upload$.subscribe();
    }
  }
}
