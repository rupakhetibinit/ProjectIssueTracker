import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();
    console.log(authToken);
    const authReq = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + authToken,
      },
    });

    return next.handle(authReq).pipe(
      catchError((e) => {
        if (e instanceof HttpErrorResponse) {
          if (e.status === 401) {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
        return throwError(() => new Error(e));
      })
    );
  }
}
