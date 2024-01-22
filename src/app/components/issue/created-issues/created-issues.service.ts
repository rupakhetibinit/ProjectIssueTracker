import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { Issue } from '../issue.model';
import { environment } from 'src/environment';

Injectable({ providedIn: 'root' });
export class CreatedIssuesService {
  httpClient = inject(HttpClient);

  state: WritableSignal<{
    issues: Issue[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
  }> = signal({
    issues: [],
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
  });

  loadIssues() {
    this.httpClient
      .get<{ count: number; issues: Issue[] }>(
        `${environment.baseUrl}/projects/issues?pageSize=${
          this.state().pageSize
        }&pageNumber=${this.state().pageNumber}`
      )
      .subscribe({
        next: (v) => {
          // this.state.mutate((value) => {
          //   value.issues = [...v.issues];
          //   value.totalCount = v.count;
          // });
          this.state.update((value) => ({
            ...value,
            issues: [...v.issues],
            totalCount: v.count,
          }));
        },
      });
  }

  loadIssueByPageNumber(pageNum: number) {
    // this.state.mutate((v) => {
    //   v.pageNumber = Number(pageNum);
    // });
    this.state.update((v) => ({
      ...v,
      pageNumber: Number(pageNum),
    }));
    this.loadIssues();
  }
}
