import { Component, OnInit, WritableSignal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsStore } from 'src/app/services/projects.store';
import { MatGridListModule } from '@angular/material/grid-list';
import { Project } from './project.model';
import { ProjectCardComponent } from './project-card/project-card.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GreetingCardComponent } from '../card/greeting-card/greeting-card.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CreateOrUpdateDialogComponent } from './forms/create-or-update-dialog/create-or-update-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  standalone: true,
  providers: [],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  imports: [
    CommonModule,
    ProjectCardComponent,
    MatGridListModule,
    MatDialogModule,
    GreetingCardComponent,
    NzGridModule,
    NzButtonModule,
    NzIconModule,
    NzPaginationModule
],
})
export class ProjectsComponent implements OnInit {
  projectsStore = inject(ProjectsStore);
  private dialog = inject(MatDialog);
  projects = this.projectsStore.projects;
  router = inject(Router);

  private authService = inject(AuthService);
  ngOnInit(): void {
    this.projectsStore.fetchProjectsForUser(1);
  }
  openProjectCreateOrUpdateDialog() {
    const dialogRef = this.dialog.open(CreateOrUpdateDialogComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.data) {
        this.projectsStore.createProjectForUser({
          ...result.data,
          ownerId: this.authService.getUser().id,
        });
      }
    });
  }
}
