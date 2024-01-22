import {
  Component,
  Input,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { IssuesStore } from 'src/app/services/issues.store';
import { ProjectsStore } from 'src/app/services/projects.store';
import { ViewModalComponent } from '../../collaboration/view-modal/view-modal.component';
import { CreateOrUpdateDialogComponent } from '../create-or-update-dialog/create-or-update-dialog.component';
import { Issue, IssueCreate } from '../issue.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment';
import { TableComponent } from './table/table.component';
import {
  NzPaginationComponent,
  NzPaginationModule,
} from 'ng-zorro-antd/pagination';
import { CreatedIssuesService } from './created-issues.service';

@Component({
  selector: 'app-created-issues',
  standalone: true,
  imports: [NzPaginationModule, TableComponent],
  providers: [NzModalService, CreatedIssuesService],
  template: `
    <div class="w-full h-[80vh]">
      <h3 class="font-bold text-medium">Created Issues</h3>
      <app-table [issues]="state().issues"></app-table>
      <div class=" pr-24 flex justify-end">
        <nz-pagination
          (nzPageIndexChange)="
            createdIssuesService.loadIssueByPageNumber($event)
          "
          [nzPageSize]="state().pageSize"
          [(nzPageIndex)]="state().pageNumber"
          [nzTotal]="state().totalCount"
        >
          >
        </nz-pagination>
      </div>
    </div>
  `,
  styles: [
    `
      nz-pagination {
        position: absolute;
        bottom: 5rem;
      }
    `,
  ],
})
export class CreatedIssuesComponent implements OnInit {
  private readonly httpClient = inject(HttpClient);
  createdIssuesService = inject(CreatedIssuesService);
  state = this.createdIssuesService.state;

  ngOnInit(): void {
    this.createdIssuesService.loadIssues();
  }
}
