import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { IssuesStore } from 'src/app/services/issues.store';
import { NzListModule } from 'ng-zorro-antd/list';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ProjectWithOwnerId,
  ProjectsStore,
} from 'src/app/services/projects.store';
import { AuthService } from 'src/app/services/auth.service';
import { CreateOrUpdateDialogComponent } from '../../issue/create-or-update-dialog/create-or-update-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { IssueCreate } from '../../issue/issue.model';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { IssueTableComponent } from '../issue-table/issue-table.component';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-project-item',
  standalone: true,
  imports: [
    NzGridModule,
    NzCardModule,
    NzPaginationModule,
    IssueTableComponent,
    NzListModule,
    NzButtonModule
],
  providers: [NzModalService],
  template: ` <div [nzGutter]="[16, 24]" nz-row nzAlign="top" nzJustify="start">
    <div style="margin-top: 1rem" nz-col nzSpan="18" class="height-100">
      <nz-card [nzTitle]="title">
        <ng-template #title>
          <div class="flex justify-between">
            <h2 nz-typography>{{ project.name }}</h2>
            <div></div>
          </div>
        </ng-template>
        <div class="flex justify-between">
          <p nz-typography>Description : {{ project.description }}</p>
          <button (click)="openIssueCreateDialog()" nz-button nzType="primary">
            Create Issue
          </button>
        </div>
        <h3 nz-typography>List of Issues</h3>
        <app-issue-table [issues]="issues()"></app-issue-table>
        <div class="pr-24 flex justify-end">
          <nz-pagination
            (nzPageIndexChange)="
              issuesService.getIssuesForProject(project.id, $event)
            "
            [nzPageSize]="issuesService.pageSize"
            [(nzPageIndex)]="issuesService.pageNumber"
            [nzTotal]="$any(issuesService.totalIssues())"
          >
            >
          </nz-pagination>
        </div>
      </nz-card>
    </div>
    <div style="margin-top: 1rem" nz-col nzSpan="6" class="height-100">
      <div nz-col style="max-height: 60vh" class="height-50">
        <nz-card nzTitle="Collaborators">
          <nz-list nzItemLayout="horizontal">
            @for (person of project.collaborators; track person; let i = $index) {
  <nz-list-item
             
            >
              <nz-list-item-meta [nzDescription]="person.email">
                <nz-list-item-meta-title
                  ><div
                    style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                  "
                  >
                    <a nz-typography>{{ person.name }}</a>
                  </div>
                </nz-list-item-meta-title>
              </nz-list-item-meta>
            </nz-list-item>
}
            @if (project.collaborators.length === 0) {
<nz-list-empty
             
            ></nz-list-empty>
}
          </nz-list>
        </nz-card>
      </div>
    </div>
  </div>`,
  styles: [``],
})
export class ProjectItemComponent implements OnInit, OnDestroy {
  private readonly issueService = inject(IssuesStore);
  private readonly route = inject(ActivatedRoute);
  project!: ProjectWithOwnerId;
  private readonly dialog = inject(MatDialog);
  private routeSub!: Subscription;
  issuesService = inject(IssuesStore);
  private readonly projectStore = inject(ProjectsStore);
  private readonly authService = inject(AuthService);
  issues = this.issuesService.issues;
  issuesCount = this.issuesService.totalIssues;
  private id!: string;
  isOwner: boolean = false;
  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe({
      next: (params) => {
        console.log(params);
        console.log(params['id']);
        this.id = params['id'];
        this.loadProject();
      },
    });
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
  openIssueCreateDialog() {
    const dialogRef = this.dialog.open(CreateOrUpdateDialogComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result: { data: IssueCreate }) => {
      this.issuesService.createIssueForProject(this.id, result.data);
    });
  }
  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }
}
