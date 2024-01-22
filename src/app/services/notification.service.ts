import { Injectable, inject } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ProjectsStore } from './projects.store';
@Injectable()
export class NotificationService {
  private authService = inject(AuthService);
  private toastrService = inject(ToastrService);
  private hubConnection!: signalR.HubConnection;
  private projectsService = inject(ProjectsStore);

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7268/issue-notifications', {
        withCredentials: true,
        accessTokenFactory: () => this.authService.getToken(),
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Debug)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch((err) => console.log('Error while starting connection: ' + err));
  };
  connection = this.hubConnection;

  public addNotificationListener = () => {
    this.hubConnection.on('IssueUpdate', (data) => {
      this.toastrService.success(data, 'Issue Update');
      this.projectsService.fetchProjectsForUser(
        this.projectsService.pageNumber
      );
    });
    this.hubConnection.on('CollaboratorUpdate', (data) => {
      console.log(data);
      this.toastrService.success(data);
    });
    this.hubConnection.on('CollaboratorRemove', (data) => {
      console.log(data);
      this.toastrService.info(data, 'Collaborator Update');
    });
    this.hubConnection.on('OwnerNotification', (data) => {
      this.toastrService.info(data, 'Project Update');
      this.projectsService.fetchProjectsForUser(
        this.projectsService.pageNumber
      );
    });
  };
}
