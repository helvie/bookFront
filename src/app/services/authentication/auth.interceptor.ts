import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.endsWith('/user/login')) {
      // Ne pas ajouter l'en-tête d'authentification pour la requête de connexion
      return next.handle(request);
    }

    try {
      const token = this.authService.getToken();
      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Token not found during request interception:', error);
    }

    return next.handle(request);
  }
}
