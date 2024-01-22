import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from 'src/app/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProjectsStore } from 'src/app/services/projects.store';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateOrUpdateDialogComponent } from '../projects/forms/create-or-update-dialog/create-or-update-dialog.component';
import { IssuesStore } from 'src/app/services/issues.store';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    FormsModule,
    RouterModule,
    MatMenuModule,
    MatDialogModule,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzMenuModule,
    NzIconModule,
    NzDropDownModule
],
  providers: [NotificationService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private readonly notificationService = inject(NotificationService);
  private readonly httpClient = inject(HttpClient);
  private readonly snackBar = inject(MatSnackBar);
  private readonly authService = inject(AuthService);
  private readonly route = inject(Router);
  readonly dialog = inject(MatDialog);
  private readonly projectStore = inject(ProjectsStore);
  events: string[] = [];
  opened: boolean = true;
  userName = this.authService.getUser().name;
  activeClass = 'mat-accent bg-mat-accent';

  logout() {
    this.authService.logout();
    this.route.navigate(['login']);
  }

  ngOnInit(): void {
    this.notificationService.startConnection();
    this.notificationService.addNotificationListener();
  }
}
