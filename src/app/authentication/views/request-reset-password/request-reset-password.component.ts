import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/authentication/services/error-handler.service';

@Component({
  selector: 'app-request-reset-password',
  templateUrl: './request-reset-password.component.html',
  styleUrls: ['./request-reset-password.component.scss']
})
export class RequestResetPasswordComponent implements OnInit {

  resetPasswordForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      const email = this.resetPasswordForm.get('email')?.value;
      this.errorMessage = null; 
  
      this.authService.requestResetPassword(email).subscribe({
        next: () => {
          alert('Consultez votre boite mail afin de réinitialiser votre mot de passe');
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          console.error('Request failed', err);
          this.errorMessage = this.errorHandler.getErrorMessage(err);
        }
      });
    } else {
      this.errorMessage = 'Veuillez vérifier les champs du formulaire.'; 
    }
  }
}

