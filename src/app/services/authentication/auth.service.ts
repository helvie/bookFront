import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from 'src/app/models/user/user';
import { AuthResponse } from 'src/app/models/authResponse/auth-response';
import { constant } from 'src/app/conf/constant';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = constant.apiUrl; 
  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: User): Observable<AuthResponse> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    console.log('Sending credentials:', credentials); 
    return this.http.post<AuthResponse>(`${this.baseUrl}/user/login`, credentials, { headers }).pipe(
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
}
