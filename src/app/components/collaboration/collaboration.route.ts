import { Routes } from '@angular/router';
import { CollaborationComponent } from './collaboration.component';
import { authGuard } from 'src/app/services/auth.constant';
import { ProjectItemComponent } from './project-item/project-item.component';

export const routes: Routes = [
  {
    path: '',
    component: CollaborationComponent,
    canActivate: [authGuard],
  },
  {
    path: ':id',
    component: ProjectItemComponent,
    canActivate: [authGuard],
  },
];
