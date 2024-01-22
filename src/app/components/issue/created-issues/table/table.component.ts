import {
  Component,
  Input,
  createEnvironmentInjector,
  inject,
} from '@angular/core';

import { NzTableModule } from 'ng-zorro-antd/table';
import { Issue } from '../../issue.model';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzModalService } from 'ng-zorro-antd/modal';
import { IssuesStore } from 'src/app/services/issues.store';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CreatedIssuesService } from '../created-issues.service';
import { IssueCreateComponent } from '../../issue-create/issue-create.component';
import { ViewModalComponent } from 'src/app/components/collaboration/view-modal/view-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [NzTableModule, NzDropDownModule, NzIconModule],
  template: `
    <nz-table
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
                <li
                  (click)="editIssue(data)"
                  style="padding-left: 1rem; padding-right: 1rem"
                  nz-menu-item
                >
                  <a>Edit</a>
                </li>
                <li
                  (click)="deleteIssue(data)"
                  style="padding-left: 1rem; padding-right: 1rem"
                  nz-menu-item
                >
                  <a>Delete</a>
                </li>
              </ul>
            </nz-dropdown-menu>
          </td>
        </tr>
}
      </tbody>
    </nz-table>
  `,
  styles: [``],
})
export class TableComponent {
  @Input() issues!: Issue[];
  router = inject(Router);
  option = ['Not Started', 'Ongoing', 'Completed'];
  modal = inject(NzModalService);
  issuesService = inject(IssuesStore);
  createdIssuesService = inject(CreatedIssuesService);

  deleteIssue(issue: Issue) {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this issue?',
      nzContent: '<b style="color: red;">This action is irreversible.</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: (data) =>
        new Promise((res, rej) => {
          this.issuesService.deleteIssue(issue.projectId, issue.id).subscribe({
            next: (_) => {
              this.createdIssuesService.loadIssueByPageNumber(
                this.createdIssuesService.state().pageNumber
              );
              res();
            },
          });
        }),
      nzCancelText: 'No',
      nzOnCancel: () => {},
    });
  }

  editIssue(issue: Issue) {
    this.modal.create<
      IssueCreateComponent,
      Pick<Issue, 'status' | 'title' | 'description'>
    >({
      nzTitle: 'Issue Edit',
      nzContent: IssueCreateComponent,
      nzData: {
        title: issue.title,
        description: issue.description,
        status: issue.status,
      },
      nzOkText: 'Update',
      nzOnOk: (v) => {
        const index = this.option.findIndex(
          (val) => val === v.createOrUpdateIssueForm.value.status
        );
        new Promise<void>((res, rej) => {
          console.log(v);
          this.issuesService.updateIssueForProject(issue.projectId, {
            description: v.createOrUpdateIssueForm.value.description as string,
            title: v.createOrUpdateIssueForm.value.title as string,
            status: index,
            id: issue.id,
          });

          this.redirectTo('/home/your-issues');

          res();
        });
      },
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

  redirectTo(uri: string) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }
}
