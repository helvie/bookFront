import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/authentication/services/error-handler.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  
  resetPasswordForm!: FormGroup;
  errorMessage: string | null = null;
  email: string | null = null;
  

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordsMatchValidator });
    this.email = this.getEmailFromUrl();
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      const token = this.getTokenFromUrl(); 
      const newPassword = this.resetPasswordForm.get('newPassword')?.value;

      this.authService.resetPassword(newPassword, token).subscribe({
        next: () => {
          alert('Mot de passe réinitialisé avec succès');
          this.errorMessage = null; // Efface le message d'erreur en cas de succès
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          console.error('La réinitialisation a échoué', error);
          // Ne définissez un message d'erreur que si la réponse n'est pas un succès
          this.errorMessage = this.errorHandler.getErrorMessage(error);
        }
      });
    } else {
      alert('Veuillez corriger les erreurs dans le formulaire');
    }
  }

  private getTokenFromUrl(): string {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('token') || '';
  }

  private getEmailFromUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('email');
  }
}
