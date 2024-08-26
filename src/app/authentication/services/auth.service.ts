import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { User } from 'src/app/models/user/user';
import { constant } from 'src/app/conf/constant';
import { LoginCredentials } from '../models/loginCredentials';
import { SignupCredentials } from '../models/signupCredentials';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = constant.apiUrl; // URL de base pour les appels API
  private refreshTokenSubject = new BehaviorSubject<boolean>(false); // Suivi de l'état du rafraîchissement du token

  constructor(
    private http: HttpClient, 
    private router: Router,
    private errorHandler: ErrorHandlerService //
    ) {}


// ----------------------------------------------- LOGIN ---------------------------------------------


login(credentials: LoginCredentials): Observable<User> {
  const headers = new HttpHeaders({'Content-Type': 'application/json'});

  return this.http.post<User>(`${this.baseUrl}/user/login`, credentials, { headers }).pipe(
    tap(response => {
      if (response.firstname && response.lastname) {
        localStorage.setItem('firstname', response.firstname);
        localStorage.setItem('lastname', response.lastname);       
      }
      if (response.token && response.refreshToken) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);

        localStorage.setItem('email', response.email);

        console.log('Token stored in localStorage:', response.token);
      } else {
        console.error('Token or refreshToken not found in the response');
      }
    }),
    catchError((error: HttpErrorResponse) => {
      console.error('Login failed', error);

      // Gestion des erreurs en fonction des statuts HTTP
      let errorMessage = 'Une erreur inattendue est survenue.';
      if (error.status === 404) {
        errorMessage = 'Utilisateur non trouvé.';
      } else if (error.status === 423) {
        errorMessage = 'Compte verrouillé. Réessayez dans 15 minutes.';
      } else if (error.status === 401) {
        errorMessage = 'Échec de l\'authentification. Vérifiez vos identifiants.';
      } else if (error.error && typeof error.error === 'string') {
        // Si le backend renvoie un message d'erreur comme une chaîne
        errorMessage = error.error;
      }

      // Retourne une erreur sous forme d'Observable pour être capturée par l'appelant
      return throwError(() => new Error(errorMessage));
    })
  );
}


  // -------------------------------------- REQUEST RESET PASSWORD ------------------------------------


  // Méthode pour demander une réinitialisation de mot de passe
  requestResetPassword(email: string): Observable<any> {
    const body = JSON.stringify({ email });
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
  
    console.log('Sending password reset request:', body);
    console.log(`${this.baseUrl}/user/forgot-password`);
  
    return this.http.post(`${this.baseUrl}/user/forgot-password`, body, { headers, responseType: 'text' }).pipe(
        tap(response => {
            console.log('Received response:', response);
        }),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Une erreur inattendue est survenue.';
  
          console.error('Request failed', error);
  
          if (error.status === 404) {
            errorMessage = 'Utilisateur non trouvé.';
          } else if (error.status === 423) {
            errorMessage = 'Compte verrouillé. Réessayez dans 15 minutes.';
          } else if (error.error && typeof error.error === 'string') {
            // Si le backend renvoie un message d'erreur sous forme de chaîne
            errorMessage = error.error;
          }
  
          return throwError(() => new Error(errorMessage));
        })
    );
  }
  
  


  // ---------------------------------------------- SIGNUP --------------------------------------------


  // Méthode d'inscription
  signup(credentials: SignupCredentials): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log('Sending signup data:', credentials);

    return this.http.post<User>(`${this.baseUrl}/user/signup`, credentials, { headers }).pipe(
      tap(response => {
        if (response.token && response.refreshToken) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          console.log('Token stored in localStorage:', response.token);
        } else {
          console.error('Token or refreshToken not found in the response');
        }
      }),
      catchError(this.errorHandler.handleError) // Utilisation du service ErrorHandlerService pour gérer les erreurs
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

    return this.http.post<any>(`${this.baseUrl}/user/refresh-token`, body, { headers }).pipe(
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
  
  resetPassword(newPassword: string, token: string): Observable<any> {
    const body = { newPassword, token };
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
  
    return this.http.post<{ message: string }>(`${this.baseUrl}/user/reset-password`, body, { headers }).pipe(
      tap(response => {
        console.log('Password reset successfully:', response.message);
      }),
      catchError(error => {
        console.error('Password reset failed:', error);
        const errorMessage = error.error?.message || 'An unexpected error occurred';
        return throwError(() => new Error(errorMessage));
      })
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

    return this.http.post<any>(`${this.baseUrl}/user/change-password`, body, { headers }).pipe(
      tap(response => {
        console.log('Password changed successfully:', response);
      }),
      catchError(this.handleError) 
    );
  }
}

