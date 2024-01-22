import { Routes } from '@angular/router';
import { CreatedIssuesComponent } from './created-issues.component';
import { authGuard } from 'src/app/services/auth.constant';

export const routes: Routes = [
  {
    path: '',
    component: CreatedIssuesComponent,
    canActivate: [authGuard],
  },
];
