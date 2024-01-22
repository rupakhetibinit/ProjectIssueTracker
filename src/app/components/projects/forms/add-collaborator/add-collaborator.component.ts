import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, switchMap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-collaborator',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatInputModule
],
  templateUrl: './add-collaborator.component.html',
  styleUrls: ['./add-collaborator.component.scss'],
})
export class AddCollaboratorComponent {
  private fb = inject(FormBuilder);
  isLoading = false;
  addCollaboratorForm = this.fb.group({
    nameOrEmail: ['', Validators.required],
  });
  searchResult!: Observable<any[]>;

  onChanges(): void {
    this.searchResult;
  }
}
