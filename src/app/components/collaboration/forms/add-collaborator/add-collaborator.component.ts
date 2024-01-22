import { Component, Input, OnInit, inject } from '@angular/core';

import { NzInputModule } from 'ng-zorro-antd/input';
import {
  AutocompleteDataSourceItem,
  NzAutocompleteModule,
} from 'ng-zorro-antd/auto-complete';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { FormsModule, NgModel } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-collaborator',
  standalone: true,
  imports: [NzInputModule, NzAutocompleteModule, FormsModule],
  template: `
    <div>
      <input
        placeholder="Search For People (by Name or Email)"
        nz-input
        [(ngModel)]="inputValue"
        (ngModelChange)="onInput()"
        [nzAutocomplete]="auto"
      />
      <nz-autocomplete #auto>
        @for (collaborator of collaborators; track collaborator) {
        <nz-auto-option [nzValue]="collaborator.label">
          {{ collaborator.label }}
        </nz-auto-option>
        }
      </nz-autocomplete>
    </div>
  `,
  styles: [``],
})
export class AddCollaboratorComponent {
  private data = inject(NZ_MODAL_DATA);
  private authService = inject(AuthService);
  private httpClient = inject(HttpClient);
  collaborators!: AutocompleteDataSourceItem[];
  inputValue: string = '';
  inputSubject = new Subject<string>();
  constructor() {
    this.inputSubject
      .pipe(
        debounceTime(300), // Adjust debounce time as needed
        distinctUntilChanged()
      )
      .subscribe((searchTerm) => {
        if (searchTerm !== '') {
          this.httpClient
            .get<{ email: string; id: string; name: string }[]>(
              `${environment.baseUrl}/projects/${this.data.projectId}/collaborators?searchQuery=${searchTerm}`
            )
            .subscribe({
              next: (value) => {
                this.collaborators = value
                  .filter((i) => i.email != this.authService.getUser().email)
                  .map((i) => ({
                    label: i.email,
                    value: i.id,
                  }));
              },
            });
        }
      });
  }
  onInput() {
    this.inputSubject.next(this.inputValue);
  }
}
