import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false; // Indicateur pour savoir si un token est en cours de rafraîchissement
  private refreshTokenSubject: any; // Sujet utilisé pour diffuser le nouvel access token aux abonnés

  constructor(private authService: AuthService) {}

  
  // ---------------------------------------------- INTERCEPT --------------------------------------------

  // Intercepte toutes les requêtes HTTP sortantes
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Ne pas intercepter les requêtes de login et signup
    if (request.url.endsWith('/user/login') || request.url.endsWith('/user/signup')) {
      return next.handle(request);
    }

    // Ajoute le header d'autorisation avec le token si disponible
    return this.addAuthHeader(request, next).pipe(
      catchError(error => {
        // Si la réponse est 401 (non autorisé) et que ce n'est pas une demande de refresh token
        if (error instanceof HttpErrorResponse && error.status === 401 && !request.url.endsWith('/auth/refresh-token')) {
          return this.handle401Error(request, next); // Tente de rafraîchir le token
        }
        return throwError(() => error); // Si autre erreur, la remonter
      })
    );
  }

    // ------------------------------------------ ADD AUTH HEADER ----------------------------------------


  // Ajoute le header d'autorisation à la requête si un token est présent
  private addAuthHeader(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}` // Ajout du token dans le header Authorization
        }
      });
    }
    return next.handle(request); // Passe la requête au prochain handler

  }


  // -------------------------------------------- HANDLE 401 ERROR ------------------------------------------

  // Gère le cas d'une erreur 401 en tentant de rafraîchir le token
  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) { // Si on n'est pas déjà en train de rafraîchir le token
      this.isRefreshing = true;
      this.refreshTokenSubject = new Observable<any>();

      return this.authService.refreshToken().pipe(
        switchMap((response: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject = null;
          if (response.token) {
            localStorage.setItem('token', response.token); // Sauvegarde le nouveau token
            return this.addAuthHeader(request, next); // Réessaie la requête initiale avec le nouveau token
          } else {
            this.authService.logout(); // Si le refresh échoue, déconnexion
            return throwError(() => new Error('Could not refresh token. Please log in again.'));
          }
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.authService.logout(); // En cas d'erreur, déconnexion
          return throwError(() => err);
        })
      );
    } else {
      // Si le token est déjà en cours de rafraîchissement, attendre qu'il soit rafraîchi
      return this.refreshTokenSubject.pipe(
        switchMap(() => this.addAuthHeader(request, next)),
        catchError(err => throwError(() => err))
      );
    }
  }
}
