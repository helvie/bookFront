import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user/user';
import { SignupCredentials } from '../../models/signupCredentials';
import { ErrorHandlerService } from 'src/app/authentication/services/error-handler.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.maxLength(50), Validators.pattern("^[A-Za-zà-ÿÀ-Ÿ'\\-\\s]+$")]],
      lastname: ['', [Validators.required, Validators.maxLength(50), Validators.pattern("^[A-Za-zà-ÿÀ-Ÿ'\\-\\s]+$")]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern("^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const signupData: SignupCredentials = {
      ...this.signupForm.value, 
      role:"USER"
    };
      this.authService.signup(signupData).subscribe({
        next: (response: User) => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Signup failed', err);
          this.errorMessage = this.errorHandler.getErrorMessage(err);
        },
        complete: () => {
          console.log('Signup request completed');
        }
      });
    }
  }
}
