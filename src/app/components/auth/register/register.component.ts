import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { UserLogin, UserRegister } from 'src/app/services/user.model';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
    RouterModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule,
  ],
  providers: [],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  user!: UserRegister;
  registerForm!: FormGroup;
  ngOnInit(): void {
    this.initRegisterForm();
  }
  initRegisterForm(): void {
    this.registerForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(8)],
      }),
      name: new FormControl('', {
        validators: [Validators.required, Validators.minLength(1)],
      }),
    });
  }
  register(): void {
    if (this.registerForm.invalid) {
      this.snackBar.open('Credential issue');
      return;
    }
    this.authService
      .register({
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        name: this.registerForm.value.name,
      })
      .subscribe({
        next: (data) => {
          this.authService.authState.set(data);
          localStorage.setItem(
            'user',
            JSON.stringify(this.authService.authState())
          );
          this.router.navigate(['home']);
        },
        error: (err) => {
          this.snackBar.open(
            err?.error?.errors?.['Email'] ||
              err?.error?.errors?.['Password'] ||
              err?.error?.errors?.['Name'] ||
              err?.error,
            'Close',
            {
              duration: 3000,
            }
          );
        },
      });
    // console.log(this.registerForm.value);
    // Object.keys(this.registerForm.controls).forEach((key) => {
    //   console.log(this.registerForm.get(key)?.errors);
    // });
  }

  getEmailError() {
    this.registerForm.invalid;
  }
}
