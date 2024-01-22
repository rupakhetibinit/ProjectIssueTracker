import { HttpClient } from '@angular/common/http';
import {
  Injectable,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environment';

export type Project = {
  id: string;
  name: string;
  description: string;
  collaborators: Collaborators[];
  //   issues: Issue[];
};

type Collaborators = {
  userId: string;
  name: string;
  email: string;
  projectId: string;
};

type Issue = {
  id: string;
  title: string;
  description: string;
  status: string;
  creatorId: string;
  creatorName: string;
  creatorEmail: string;
  projectId: string;
};

type CollaborationState = {
  projects: Project[];
  pageSize: number;
  pageIndex: number;
  totalCount: number;
};

type FetchProjectsResponse = {
  projects: Project[];
  count: number;
};

@Injectable()
export class CollaborationStore {
  private readonly state: WritableSignal<CollaborationState> = signal({
    projects: [],
    pageSize: 9,
    pageIndex: 1,
    totalCount: 0,
  });
  private readonly httpClient = inject(HttpClient);
  private readonly authService = inject(AuthService);

  totalCount = computed(() => this.state().totalCount);
  projects = computed(() => this.state().projects);
  pageSize = computed(() => this.state().pageSize);
  pageIndex = computed(() => this.state().pageIndex);
  store = this.state;

  loadProjects() {
    this.httpClient
      .get<FetchProjectsResponse>(
        `${environment.baseUrl}/projects/collaborations/${
          this.authService.getUser().id
        }?pageNumber=${this.pageIndex()}&pageSize=${this.pageSize()}`
      )
      .subscribe({
        next: (v) => {
          this.state.set({
            ...this.state(),
            projects: v.projects,
            totalCount: v.count,
          });
        },
      });
  }
}
