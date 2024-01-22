import {
  Inject,
  Injectable,
  Signal,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Project } from '../components/projects/project.model';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment';

export type ProjectsState = {
  projects: Project[];
  totalProjects?: number;
};

type ProjectCreate = Omit<Project, 'id' | 'ownerName'> & {
  ownerId: string;
};

export type ProjectWithOwnerId = Project & {
  ownerId: string;
};

@Injectable({ providedIn: 'root' })
export class ProjectsStore {
  private readonly authService = inject(AuthService);
  private readonly httpClient = inject(HttpClient);
  private state: WritableSignal<ProjectsState> = signal<ProjectsState>({
    projects: [],
    totalProjects: 0,
  });
  pageNumber = 1;
  pageSize = 6;

  projects = computed(() => this.state().projects);
  totalProjects = computed(() => this.state().totalProjects);

  fetchProjectsForUser(pageIndex: number): void {
    if (pageIndex < 1) {
      this.pageNumber = 1;
    } else {
      this.pageNumber = pageIndex;
    }

    this.httpClient
      .get<Project[]>(
        `${environment.baseUrl}/projects/user/${
          this.authService.getUser().id
        }/?pageNumber=${this.pageNumber}&pageSize=${this.pageSize}`
      )
      .subscribe((projects) => {
        this.state.update((value) => ({
          ...value,
          projects,
        }));
      });

    this.getPageCount().subscribe(({ count }) => {
      this.state.update((value) => {
        return { ...value, totalProjects: count };
      });
    });
  }

  createProjectForUser(project: ProjectCreate): void {
    this.httpClient
      .post(`${environment.baseUrl}/projects`, {
        ...project,
      })
      .subscribe({
        next: (_) => this.fetchProjectsForUser(this.pageNumber),
      });
  }

  deleteProjectForUser(projectId: string) {
    return this.httpClient
      .delete('https://localhost:7268/api/projects/' + projectId, {})
      .subscribe({
        next: (_) => this.fetchProjectsForUser(this.pageNumber),
      });
  }

  updateProject(
    projectName: string,
    projectId: string,
    projectDescription: string
  ) {
    return this.httpClient.put(`${environment.baseUrl}/projects/${projectId}`, {
      name: projectName,
      description: projectDescription,
    });
  }

  getProject(projectId: string) {
    console.log(projectId);
    return this.httpClient.get<ProjectWithOwnerId>(
      'https://localhost:7268/api/projects/' + projectId
    );
  }

  getPageCount() {
    return this.httpClient.get<{ count: number }>(
      `${environment.baseUrl}/projects/user/${
        this.authService.getUser().id
      }/count`
    );
  }

  // addCollaboratorToProject({projectId:number,userId:number}){
  //   this.httpClient.post("https://localhost:7268/api/projects/user")
  // }
}
