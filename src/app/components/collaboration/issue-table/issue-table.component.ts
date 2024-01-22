import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { Issue, IssueCreate } from '../../issue/issue.model';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { IssuesStore } from 'src/app/services/issues.store';
import { ProjectsStore } from 'src/app/services/projects.store';
import { CreateOrUpdateDialogComponent } from '../../issue/create-or-update-dialog/create-or-update-dialog.component';
import { ViewModalComponent } from '../view-modal/view-modal.component';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-issue-table',
  standalone: true,
  imports: [NzTableModule, NzDropDownModule, NzIconModule],
  template: `<nz-table
    nzSize="small"
    [nzFrontPagination]="false"
    #basicTable
    [nzData]="issues"
  >
    <thead>
      <tr>
        <th>ID</th>
        <th>Title</th>
        <th>Created By</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      @for (data of basicTable.data; track data) {
  <tr>
        <td>{{ data.id }}</td>
        <td>{{ data.title }}</td>
        <td>{{ data.creatorName }}</td>
        <td>{{ option[data.status] }}</td>
        <td>
          <a
            nzType="primary"
            nz-button
            nz-dropdown
            [nzDropdownMenu]="menu"
            nzTrigger="click"
            nzPlacement="bottomRight"
          >
            <span nz-icon nzType="ellipsis"></span>
          </a>
          <nz-dropdown-menu #menu="nzDropdownMenu">
            <ul nz-menu>
              <li
                (click)="viewIssue(data)"
                style="padding-left: 1rem; padding-right: 1rem"
                nz-menu-item
              >
                <a>View</a>
              </li>
              @if (data.creatorId === userId) {
<li
               
                [ariaDisabled]="data.creatorId !== userId"
                [nzDisabled]="data.creatorId !== userId"
                (click)="editIssue(data)"
                style="padding-left: 1rem;
                padding-right: 1rem"
                nz-menu-item
              >
                <a [ariaDisabled]="data.creatorId !== userId">Edit</a>
              </li>
}
              @if (data.creatorId === userId) {
<li
               
                [nzDisabled]="data.creatorId !== userId"
                (click)="deleteIssue(data)"
                style="padding-left: 1rem;
                padding-right: 1rem"
                nz-menu-item
              >
                <a [ariaDisabled]="data.creatorId !== userId">Delete</a>
              </li>
}
            </ul>
          </nz-dropdown-menu>
        </td>
      </tr>
}
    </tbody>
  </nz-table> `,
  styles: [``],
})
export class IssueTableComponent implements OnInit, OnDestroy {
  private readonly issuesService = inject(IssuesStore);
  readonly projectsStore = inject(ProjectsStore);
  private dialog = inject(MatDialog);
  private modal = inject(NzModalService);
  private id!: string;
  private routeSub!: Subscription;
  private readonly route = inject(ActivatedRoute);

  option = ['Not Started', 'Ongoing', 'Completed'];
  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe({
      next: (params) => {
        console.log(params);
        console.log(params['id']);
        this.id = params['id'];
      },
    });
    console.log('owner', this.userId);
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  @Input() issues!: Issue[];
  authservice = inject(AuthService);
  userId = this.authservice.getUser().id;

  editIssue(issue: IssueCreate) {
    const dialogRef = this.dialog.open(CreateOrUpdateDialogComponent, {
      data: {
        ...issue,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.issuesService.updateIssueForProject(this.id, result.data);
    });
  }

  viewIssue(issue: Issue) {
    const modalEdit = this.modal.create<ViewModalComponent, Issue>({
      nzTitle: 'Issue Details',
      nzContent: ViewModalComponent,

      nzData: {
        ...issue,
      },
      nzFooter: null,
    });

    modalEdit.afterClose.subscribe();
  }

  deleteIssue(issue: Issue) {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this issue?',
      nzContent: '<b style="color: red;">This action is irreversible.</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () =>
        new Promise((res, rej) => {
          this.issuesService.deleteIssue(this.id, issue.id).subscribe({
            next: (_) => {
              res();
              this.issuesService.getIssuesForProject(
                this.id,
                this.issuesService.pageNumber
              );
            },
          });
        }),
      nzCancelText: 'No',
      nzOnCancel: () => {},
    });
  }
}
