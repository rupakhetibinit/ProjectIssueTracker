import {
  Injectable,
  inject,
  signal,
  WritableSignal,
  computed,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthState, User, UserLogin, UserRegister } from './user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  authState: WritableSignal<AuthState> = signal({
    token: '',
    user: {
      email: '',
      id: '',
      name: '',
    },
  });

  isAuthenticated = computed(() => this.authState().token !== '');

  getToken = computed(() => this.authState().token);
  getUser = computed(() => this.authState().user);

  logout = () => {
    this.authState.set({
      token: '',
      user: {
        email: '',
        id: '',
        name: '',
      },
    });
    localStorage.removeItem('user');
  };

  login(user: UserLogin) {
    return this.httpClient.post<{ token: string; user: User }>(
      'https://localhost:7268/api/auth/login',
      user
    );
  }

  register(user: UserRegister) {
    return this.httpClient.post<{ token: string; user: User }>(
      'https://localhost:7268/api/auth/register',
      user
    );
  }
}
