import { Route } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ProjectItemComponent } from './project-item/project-item.component';
import { isLoggedIn } from 'src/app/services/auth.constant';
import { ImageUploadComponent } from '../image-upload/image-upload.component';
import { projectResolver } from 'src/app/resolvers/project.resolver';

export const routes: Route[] = [
  { path: '', redirectTo: 'your-projects', pathMatch: 'full' },
  { path: 'your-projects', component: ProjectsComponent },
  {
    path: 'your-projects/:id',
    component: ProjectItemComponent,
  },
  {
    path: 'image-upload',
    component: ImageUploadComponent,
  },
];
