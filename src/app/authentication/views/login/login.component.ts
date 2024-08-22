import { Component } from '@angular/core';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { Router } from '@angular/router';
import { LoginCredentials } from '../../models/loginCredentials';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  // Modèle pour stocker les informations de connexion
  user: LoginCredentials = { email: '', password: '' };

  // Injection des services AuthService et Router
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Méthode appelée lors de la soumission du formulaire
  onSubmit(): void {
    this.authService.login(this.user).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (error) => console.error('Login failed', error)
    });
  }
}