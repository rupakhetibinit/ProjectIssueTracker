import { inject } from '@angular/core';
import {
  ResolveFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { ProjectWithOwnerId, ProjectsStore } from '../services/projects.store';
import { Observable } from 'rxjs';
import { IssuesStore } from '../services/issues.store';

export const projectResolver: ResolveFn<Observable<ProjectWithOwnerId>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const projectStore = inject(ProjectsStore);
  const issueStore = inject(IssuesStore);
  console.log(route.paramMap.get('id'));
  issueStore.getIssuesForProject(route.paramMap.get('id')!, 1);
  return projectStore.getProject(route.paramMap.get('id')!);
};
