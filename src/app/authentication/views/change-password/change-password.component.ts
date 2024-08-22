import { Component } from '@angular/core';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {

  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Méthode appelée lors de la soumission du formulaire
  onSubmit(): void {

    // Vérifie si le nouveau mot de passe correspond à la confirmation
    if (this.newPassword === this.confirmPassword) {
      this.authService.changePassword(this.oldPassword, this.newPassword).subscribe({
        next: () => {
          alert('Password successfully changed'); 
          this.router.navigate(['/']); // Redirige vers une page d'accueil
        },
        error: (error) => console.error('Change failed', error)
      });
    } else {
      alert('Passwords do not match'); 
    }
  }
}
