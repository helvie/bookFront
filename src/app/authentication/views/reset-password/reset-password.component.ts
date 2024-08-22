import { Component } from '@angular/core';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  
  // Propriétés pour stocker les nouveaux mots de passe
  newPassword: string = '';
  confirmPassword: string = '';

  // Injection des services AuthService et Router
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Soumission du formulaire de réinitialisation du mot de passe
  onSubmit(): void {
    if (this.newPassword === this.confirmPassword) {
      const token = this.getTokenFromUrl(); // Récupère le token de l'URL
      console.log(token);
      console.log(this.newPassword);
      
      // Appelle le service pour réinitialiser le mot de passe
      this.authService.resetPassword(this.newPassword, token).subscribe({
        next: () => {
          alert('Password successfully reset'); // Alerte succès
          this.router.navigate(['/login']); // Redirige vers la page de connexion
        },
        error: (error) => console.error('Reset failed', error) // Gère les erreurs
      });
    } else {
      alert('Passwords do not match'); // Alerte si les mots de passe ne correspondent pas
    }
  }

  // Récupère le token de l'URL
  private getTokenFromUrl(): string {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('token') || ''; // Renvoie le token ou une chaîne vide
  }
}

