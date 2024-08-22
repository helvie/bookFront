import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { User } from 'src/app/models/user/user';
import { constant } from 'src/app/conf/constant';
import { LoginCredentials } from '../models/loginCredentials';
import { SignupCredentials } from '../models/signupCredentials';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = constant.apiUrl; // URL de base pour les appels API
  private refreshTokenSubject = new BehaviorSubject<boolean>(false); // Suivi de l'état du rafraîchissement du token

  constructor(private http: HttpClient, private router: Router) {}


// ----------------------------------------------- LOGIN ---------------------------------------------


  // Méthode de connexion
  login(credentials: LoginCredentials): Observable<User> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this.http.post<User>(`${this.baseUrl}/user/login`, credentials, { headers }).pipe(
      tap(response => {
        if (response.token && response.refreshToken) {
          // Stocker les tokens dans le localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          console.log('Token stored in localStorage:', response.token);
        } else {
          console.error('Token or refreshToken not found in the response');
        }
      }),
      catchError(this.handleError) // Gestion des erreurs
    );
  }


  // -------------------------------------- REQUEST RESET PASSWORD ------------------------------------


  // Méthode pour demander une réinitialisation de mot de passe
  requestResetPassword(email: string): Observable<any> {
    const body = JSON.stringify({ email });
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    console.log('Sending password reset request:', body);

    return this.http.post(`${this.baseUrl}/auth/forgot-password`, body, { headers }).pipe(
        tap(response => {
            console.log('Received response:', response);
        }),
        catchError((error: HttpErrorResponse) => {
            console.error('Request failed', error);
            return throwError(() => new Error('Password reset request failed'));
        })
    );
  }


  // ---------------------------------------------- SIGNUP --------------------------------------------


  // Méthode d'inscription
  signup(credentials: SignupCredentials): Observable<User> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    console.log('Sending signup data:', credentials);

    return this.http.post<User>(`${this.baseUrl}/user/signup`, credentials, { headers }).pipe(
      tap(response => {
        if (response.token && response.refreshToken) {

          // Stockage des tokens dans le localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          console.log('Token stored in localStorage:', response.token);
        } else {
          console.error('Token or refreshToken not found in the response');
        }
      }),
      catchError(this.handleError) // Gestion des erreurs
    );
  }


  // ------------------------------------------- REFRESH TOKEN -----------------------------------------

  // Méthode pour rafraîchir le token JWT
  refreshToken(): Observable<any> {
    const token = localStorage.getItem('refreshToken');
    if (!token) {
      throw new Error('Refresh token not found');
    }

    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const body = JSON.stringify({ refreshToken: token });

    return this.http.post<any>(`${this.baseUrl}/auth/refresh-token`, body, { headers }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token); // Stocke le nouveau token
          console.log('New token stored in localStorage:', response.token);
        } else {
          console.error('New token not found in the response');
        }
      }),
      catchError(this.handleError) // Gestion des erreurs
    );
  }


  // -------------------------------------------- HANDLE ERROR ------------------------------------------

  // Méthode pour gérer les erreurs HTTP
  private handleError(error: HttpErrorResponse) {
    console.error('HTTP error occurred:', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }


  // ----------------------------------------------- LOGOUT ---------------------------------------------
  
  // Méthode de déconnexion
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']); // Redirige l'utilisateur vers la page de login
  }


  // -------------------------------------------- IS LOGGED IN ------------------------------------------

  // Vérifie si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Retourne true si un token est présent
  }


  // ---------------------------------------------- GET TOKEN --------------------------------------------

  // Récupère le token JWT actuel
  getToken(): string {
    const token = localStorage.getItem('token');
    if (token === null) {
      throw new Error('Token not found');
    }
    return token;
  }


  // ------------------------------------------- RESET PASSWORD -----------------------------------------

  // Réinitialisation du mot de passe avec un token
  resetPassword(newPassword: string, token: string): Observable<any> {
    const body = JSON.stringify({ newPassword, token });
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this.http.post<any>(`${this.baseUrl}/auth/reset-password`, body, { headers }).pipe(
      tap(response => {
        console.log('Password reset successfully:', response);
      }),
      catchError(this.handleError) 
    );
  }
  // ------------------------------------------ CHANGE PASSWORD ----------------------------------------

  // Cahngement du mot de passe de l'utilisateur
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const body = JSON.stringify({ oldPassword, newPassword });
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}` // Ajoute le token dans les headers pour l'authentification
    });

    return this.http.post<any>(`${this.baseUrl}/auth/change-password`, body, { headers }).pipe(
      tap(response => {
        console.log('Password changed successfully:', response);
      }),
      catchError(this.handleError) 
    );
  }
}

