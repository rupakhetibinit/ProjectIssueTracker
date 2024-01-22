import {
  Injectable,
  Signal,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  Issue,
  IssueCreate,
  IssueCreateWithid,
} from '../components/issue/issue.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment';

export type IssueState = {
  issues: Issue[];
  totalIssues: Number;
};

@Injectable({ providedIn: 'root' })
export class IssuesStore {
  private readonly state: WritableSignal<IssueState> = signal({
    issues: [],
    totalIssues: 0,
  });
  pageNumber = 1;
  pageSize = 5;

  totalIssues = computed(() => this.state().totalIssues);

  private readonly httpClient = inject(HttpClient);
  issues = computed(() => this.state().issues);

  setIssues(issues: Issue[]) {
    this.state.set({ issues, totalIssues: this.state().totalIssues });
  }

  getIssuesForProject(projectId: string, pageIndex: number) {
    this.httpClient
      .get<Issue[]>(
        `${environment.baseUrl}/projects/${projectId}/issues?pageSize=${this.pageSize}&pageNumber=${pageIndex}`
      )
      .subscribe({
        next: (value) =>
          this.getIssueCount(projectId).subscribe({
            next: (v) => {
              this.pageNumber = pageIndex;
              this.state.set({
                issues: value,
                totalIssues: v.count,
              });
            },

            error: (e) => console.log(e),
          }),
      });
    console.log(this.state());
  }

  createIssueForProject(projectId: string, issue: IssueCreate) {
    this.httpClient
      .post(`${environment.baseUrl}/projects/${projectId}/issues`, {
        ...issue,
      })
      .subscribe({
        next: (_) => {
          console.log(_);
          this.getIssuesForProject(projectId, this.pageNumber);
        },
      });
  }

  updateIssueForProject(projectId: string, issue: IssueCreateWithid) {
    this.httpClient
      .put(`${environment.baseUrl}/projects/${projectId}/issues/${issue.id}`, {
        ...issue,
      })
      .subscribe({
        next: (_) => this.getIssuesForProject(projectId, this.pageNumber),
      });
  }

  getIssueCount(projectId: string) {
    return this.httpClient.get<{ count: number }>(
      `${environment.baseUrl}/projects/${projectId}/issues/count`
    );
  }

  deleteIssue(projectId: string, id: string) {
    return this.httpClient.delete(
      `${environment.baseUrl}/projects/${projectId}/issues/${id}`
    );
    // .subscribe({
    //   next: (_) => {
    //     console.log(_);
    //     this.getIssuesForProject(projectId, this.pageNumber);
    //   },
    // });
  }
}
