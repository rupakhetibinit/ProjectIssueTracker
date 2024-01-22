import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { User, UserLogin } from 'src/app/services/user.model';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
@Component({
  selector: 'app-login',
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
    NzInputModule,
    NzButtonModule
],
  providers: [],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  error = '';
  user!: UserLogin;
  loginForm!: FormGroup;
  ngOnInit(): void {
    console.log(this.authService.isAuthenticated());
    this.initLoginForm();
  }
  initLoginForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(8)],
      }),
    });
  }
  login(): void {
    this.authService.login(this.loginForm.value).subscribe({
      next: (data) => {
        this.authService.authState.set(data);
        localStorage.setItem(
          'user',
          JSON.stringify(this.authService.authState())
        );
        this.router.navigate(['home']);
      },
      error: (err) => {
        // this.error = err.error;
        // setTimeout(() => {
        //   this.error = '';
        // }, 5000);
        console.log(err);
        this.snackBar.open(
          err?.error?.errors?.['Email'] ||
            err?.error?.errors?.['Password'] ||
            err?.error,
          'Close',
          {
            duration: 3000,
          }
        );
      },
    });
  }
}
