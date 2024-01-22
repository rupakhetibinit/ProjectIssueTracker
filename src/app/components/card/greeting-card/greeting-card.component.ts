import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-greeting-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './greeting-card.component.html',
  styleUrls: ['./greeting-card.component.scss'],
})
export class GreetingCardComponent {
  private readonly authService = inject(AuthService);
  name = this.authService.getUser().name;
}
