import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { IssuesStore } from 'src/app/services/issues.store';
import { Issue, IssueCreate } from '../issue.model';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CreateOrUpdateDialogComponent } from '../create-or-update-dialog/create-or-update-dialog.component';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { ProjectsStore } from 'src/app/services/projects.store';
import { ViewModalComponent } from '../../collaboration/view-modal/view-modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-issue-table',
  standalone: true,
  providers: [NzModalService],
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    NzTableModule,
    NzDividerModule,
    NzDropDownModule,
    NzIconModule,
    NzPaginationModule
],
  templateUrl: './issue-table.component.html',
  styleUrls: ['./issue-table.component.scss'],
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
  }
  @Input() issues!: Issue[];

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

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
