import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import {
  ProjectWithOwnerId,
  ProjectsStore,
} from 'src/app/services/projects.store';
import { Project } from '../project.model';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from 'src/app/services/auth.service';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CreateOrUpdateDialogComponent } from 'src/app/components/issue/create-or-update-dialog/create-or-update-dialog.component';
import { IssuesStore } from 'src/app/services/issues.store';
import { IssueCreate } from '../../issue/issue.model';
import { IssueTableComponent } from '../../issue/issue-table/issue-table.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

import { NzListModule } from 'ng-zorro-antd/list';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UpdateFormComponent } from '../forms/update-form/update-form.component';
import { AddCollaboratorComponent } from '../../collaboration/forms/add-collaborator/add-collaborator.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment';

@Component({
  selector: 'app-project-item',
  standalone: true,
  providers: [NzModalService, IssuesStore],
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatGridListModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    IssueTableComponent,
    NzGridModule,
    NzCardModule,
    NzButtonModule,
    NzPaginationModule,
    NzListModule,
    NzIconModule
],
})
export class ProjectItemComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly httpClient = inject(HttpClient);
  modal = inject(NzModalService);
  private routeSub!: Subscription;
  issuesService = inject(IssuesStore);
  private readonly dialog = inject(MatDialog);
  private readonly projectStore = inject(ProjectsStore);
  private readonly authService = inject(AuthService);
  issues = this.issuesService.issues;
  issuesCount = this.issuesService.totalIssues;
  private id!: string;
  project!: ProjectWithOwnerId;
  isOwner: boolean = false;
  private activatedRoute = inject(ActivatedRoute);
  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe({
      next: (params) => {
        console.log(params);
        console.log(params['id']);
        this.id = params['id'];
        this.loadProject();
      },
    });
    // this.activatedRoute.data.subscribe(({ p }) => {
    //   console.log(p);
    //   this.project = p;
    // });
    // if (this.project.ownerId == this.authService.getUser().id) {
    //   this.isOwner = true;
    // }
  }

  loadProject() {
    this.projectStore.getProject(this.id).subscribe({
      next: (value) => {
        this.project = value;
        // this.issuesService.setIssues(value.issues);
        this.issuesService.getIssuesForProject(this.id, 1);
        if (this.project.ownerId == this.authService.getUser().id) {
          this.isOwner = true;
        }
      },
    });
  }

  showConfirm(): void {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this project?',
      nzContent:
        '<b style="color: red;">This action is irreversible and will delete all related issues as well.</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.projectStore.deleteProjectForUser(this.id),
      nzCancelText: 'No',
      nzOnCancel: () => {},
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  openIssueCreateDialog() {
    const dialogRef = this.dialog.open(CreateOrUpdateDialogComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result: { data: IssueCreate }) => {
      this.issuesService.createIssueForProject(this.id, result.data);
    });
  }

  openEditForm() {
    const modalEdit = this.modal.create<
      UpdateFormComponent,
      {
        name: string;
        description: string;
      }
    >({
      nzTitle: 'Update Project',
      nzContent: UpdateFormComponent,

      nzData: {
        name: this.project.name,
        description: this.project.description,
      },
      nzOnOk: (result) =>
        this.projectStore
          .updateProject(
            result.editForm.value.name!,
            this.project.id,
            result.editForm.value.description!
          )
          .subscribe({
            next: (_) => this.loadProject(),
          }),
      nzOkText: 'Update',
      nzOnCancel: () => {},
      nzCancelText: 'Cancel',
    });

    modalEdit.afterClose.subscribe();
  }

  openAddCollaborator() {
    const modalEdit = this.modal.create<
      AddCollaboratorComponent,
      {
        projectId: string;
      }
    >({
      nzTitle: 'Add Collaborator',
      nzContent: AddCollaboratorComponent,
      nzData: {
        projectId: this.id,
      },
      nzOnOk: (result) => {
        const findCollaborator = result.collaborators.find(
          (v) => v.label == result.inputValue
        );
        if (findCollaborator?.value) {
          this.httpClient
            .post(`${environment.baseUrl}/projects/${this.id}/collaborators`, {
              userId: findCollaborator.value,
            })
            .subscribe({
              next: (_) => this.loadProject(),
            });
        }
      },
      nzOkText: 'Add',
      nzOnCancel: () => {},
      nzCancelText: 'Cancel',
    });

    modalEdit.afterClose.subscribe();
  }

  openCollaboratorDelete(collaboratorId: string) {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this collaborator?',
      nzContent: '<b style="color: red;">This action is irreversible.</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () =>
        new Promise((res, rej) => {
          this.httpClient
            .delete(
              `${environment.baseUrl}/projects/${this.id}/collaborators/${collaboratorId}`
            )
            .subscribe({
              next: (_) => {
                this.loadProject();
                res();
              },
            });
        }),
      nzCancelText: 'No',
      nzOnCancel: () => {},
    });
  }
}
