import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/authentication/services/error-handler.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm!: FormGroup;
  errorMessage: string | null = null;
  localStorageData: { [key: string]: string | null } = {};

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordsMatch('newPassword', 'confirmPassword') });

      // Récupérer les données du localStorage
    this.localStorageData = {
      firstname: localStorage.getItem('firstname'),
      lastname: localStorage.getItem('lastname'),
      email: localStorage.getItem('email')
    };}



  passwordsMatch(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordInput = formGroup.controls[password];
      const confirmPasswordInput = formGroup.controls[confirmPassword];
      if (passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordInput.setErrors({ passwordsMismatch: true });
      } else {
        confirmPasswordInput.setErrors(null);
      }
    };
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      const { oldPassword, newPassword } = this.changePasswordForm.value;
      this.authService.changePassword(oldPassword, newPassword).subscribe({
        next: () => {
          alert('Mot de passe changé avec succès');
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Échec du changement', error);
          this.errorMessage = this.errorHandler.getErrorMessage(error);
        }
      });
    }
  }
}
