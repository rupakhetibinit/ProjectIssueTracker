import { Component, inject } from '@angular/core';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NZ_MODAL_DATA, NzModalModule } from 'ng-zorro-antd/modal';
import { Issue } from '../../issue/issue.model';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-view-modal',
  standalone: true,
  imports: [
    NzFormModule,
    NzInputModule,
    NzCardModule,
    NzModalModule,
    NzTypographyModule
],
  providers: [NzModalModule],
  template: `<div>
    <h4 nz-typography>Title: {{ data.title }}</h4>
    <p nz-typography>Description: {{ data.description }}</p>
    <p nz-typography>Status : {{ option[data.status] }}</p>
    <p nz-typography>Created By : {{ data.creatorName }}</p>
    <p nz-typography>Creator Email : {{ data.creatorEmail }}</p>
  </div>`,
  styles: [``],
})
export class ViewModalComponent {
  data: Issue = inject(NZ_MODAL_DATA);
  option = ['Not started', 'Ongoing', 'Completed'];

  ngOnInit(): void {
    console.log(this.data);
  }
}
