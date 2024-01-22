import { Component, OnInit, inject } from '@angular/core';

import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { CollaborationStore } from './collaboration.store';
import { ProjectCardComponent } from './project-card/project-card.component';

@Component({
  selector: 'app-collaboration',
  standalone: true,
  imports: [NzPaginationModule, NzGridModule, ProjectCardComponent],
  providers: [CollaborationStore, NzGridModule, NzPaginationModule],
  template: ` <div
      style="display: flex; justify-content: space-between; align-items: center"
    >
      <h1
        style="margin-left: 1rem; margin-top: 0.25rem; margin-bottom: -0.25rem"
      >
        Your Collaborations
      </h1>
    </div>
    <div style="min-height: 60vh">
      @for (project of projects(); track project) {
      <span>
        <div
          style="display: flex; justify-content: center; align-items: center"
          nz-row
          [nzGutter]="8"
        >
          <app-project-card [project]="project" />
        </div>
      </span>
      }
      <div
        style="
      display: flex;
      flex-direction: column-reverse;
      align-items: flex-end;
      padding-right: 6rem;
    "
      >
        <nz-pagination
          (nzPageIndexChange)="fetchUserCollaborations($event)"
          [nzPageSize]="9"
          [(nzPageIndex)]="pageIndex"
          [nzTotal]="totalCount()"
        >
        </nz-pagination>
      </div>
    </div>`,
  styles: [
    `
      span {
        display: inline-block;
      }

      nz-pagination {
        margin-top: 0;
        margin-bottom: 0;
        position: absolute;
        bottom: 5rem;
      }
    `,
  ],
})
export class CollaborationComponent implements OnInit {
  private readonly collaborationService = inject(CollaborationStore);
  totalCount = this.collaborationService.totalCount;
  pageIndex = this.collaborationService.pageIndex();
  store = this.collaborationService.store;
  projects = this.collaborationService.projects;

  ngOnInit(): void {
    this.collaborationService.loadProjects();
  }

  fetchUserCollaborations(index: number) {
    this.store.update((value) => ({ ...value, pageIndex: index }));
    this.collaborationService.loadProjects();
  }
}
