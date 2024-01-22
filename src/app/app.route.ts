import { Router, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { authGuard, isLoggedIn } from './services/auth.constant';
import { ProjectsComponent } from './components/projects/projects.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    // pathMatch: 'full',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./components/projects/projects.route').then((p) => p.routes),
      },
      {
        path: 'your-collaborations',
        loadChildren: () =>
          import('./components/collaboration/collaboration.route').then(
            (c) => c.routes
          ),
      },
      {
        path: 'your-issues',
        loadChildren: () =>
          import('./components/issue/created-issues/created-issues.route').then(
            (c) => c.routes
          ),
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full',
    canActivate: [isLoggedIn],
  },
  {
    path: 'register',
    component: RegisterComponent,
    pathMatch: 'full',
    canActivate: [isLoggedIn],
  },
];
