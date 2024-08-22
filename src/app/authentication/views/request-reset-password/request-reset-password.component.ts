import { Component } from '@angular/core';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-reset-password',
  templateUrl: './request-reset-password.component.html',
  styleUrls: ['./request-reset-password.component.scss']
})
export class RequestResetPasswordComponent {
  // Propriété pour stocker l'email de l'utilisateur
  email: string = '';

  // Injection des services AuthService et Router
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Méthode appelée lors de la soumission du formulaire
  onSubmit(): void {
    this.authService.requestResetPassword(this.email).subscribe({
      next: () => {    
        alert('Password reset request sent'); 
        this.router.navigate(['/login']); // Redirige vers la page de connexion
      },
      error: (error) => console.error('Request failed', error) 
    });
  }
}