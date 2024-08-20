import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from 'src/app/models/user/user';
import { LoginCredentials } from 'src/app/models/user/loginCredentials';
import { SignupCredentials } from 'src/app/models/user/signupCredentials';
import { constant } from 'src/app/conf/constant';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = constant.apiUrl; 

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: LoginCredentials): Observable<User> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
  
    return this.http.post<User>(`${this.baseUrl}/user/login`, credentials, { headers }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          console.log('Token stored in localStorage:', response.token);
        } else {
          console.error('Token not found in the response');
        }
      }),
      catchError(this.handleError)
    );
  }

  requestResetPassword(email: string): Observable<any> {
    // Créer l'objet de la requête avec les données JSON
    const body = JSON.stringify({ email });

    // Définir les en-têtes HTTP
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // Consigner les données envoyées
    console.log('Sending password reset request:', body);

    return this.http.post(`${this.baseUrl}/auth/forgot-password`, body, {
        headers
    }).pipe(
        tap(response => {
            // Consigner la réponse reçue
            console.log('Received response:', response);
        }),
        catchError((error: HttpErrorResponse) => {
            // Gérer les erreurs et les consigner
            console.error('Request failed', error);
            return throwError(() => new Error('Password reset request failed'));
        })
    );
}

  signup(credentials: SignupCredentials): Observable<User> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    console.log('Sending signup data:', credentials);
  
    return this.http.post<User>(`${this.baseUrl}/user/signup`, credentials, { headers }).pipe(
      tap(response => {
        console.log('Received response:', response);
        if (response.token) {
          localStorage.setItem('token', response.token);
          console.log('Token stored in localStorage:', response.token);
        } else {
          console.error('Token not found in the response');
        }
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('HTTP error occurred:', error); // Log les détails de l'erreur
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string {
    const token = localStorage.getItem('token');
    if (token === null) {
      throw new Error('Token not found');
    }
    return token;
  }

  
  
  resetPassword(newPassword: string, token: string): Observable<any> {
    const body = JSON.stringify({ newPassword, token });

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.baseUrl}/auth/reset-password`, body, { headers }).pipe(
      tap(response => {
        console.log('Password reset successfully:', response);
      }),
      catchError(this.handleError)
    );
  }


  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const body = JSON.stringify({ oldPassword, newPassword });

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.post<any>(`${this.baseUrl}/user/change-password`, body, { headers }).pipe(
      tap(response => {
        console.log('Password changed successfully:', response);
      }),
      catchError(this.handleError)
    );
  }

}
