import { Component, Input, inject } from '@angular/core';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { Project } from '../collaboration.store';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [NzCardModule, NzGridModule, NzTypographyModule],
  template: ` <div style="margin: 0.5rem" nz-col [nzSpan]="8">
    <nz-card
      (click)="navigate()"
      nzHoverable
      class="card"
      [nzTitle]="project.name"
    >
      <p nz-typography nzEllipsis [nzEllipsisRows]="1">
        {{ project.description }}
      </p>
    </nz-card>
  </div>`,
  styles: [
    `
      .card {
        width: 26vw;
      }
    `,
  ],
})
export class ProjectCardComponent {
  @Input() project!: Project;
  private readonly router = inject(Router);

  navigate() {
    this.router.navigate([`home/your-collaborations/${this.project.id}`]);
  }
}
