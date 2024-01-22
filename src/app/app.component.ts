import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/auth/login/login.component';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthInterceptor } from './interceptors/auth-interceptors';
import { ProjectsStore } from './services/projects.store';
import { IssuesStore } from './services/issues.store';

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [ProjectsStore, IssuesStore],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,
    LoginComponent,
    RouterModule,
    HttpClientModule,
    MatSnackBarModule
],
})
export class AppComponent implements OnInit {
  title = 'ProjectIssueTracker';
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') as string) || null;
    this.authService.authState.set({ user: user.user, token: user.token });
  }
}
