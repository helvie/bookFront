import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { Router } from '@angular/router';
import { SignupCredentials } from 'src/app/models/user/signupCredentials';
import { User } from 'src/app/models/user/user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const signupData: SignupCredentials = this.signupForm.value;
      this.authService.signup(signupData).subscribe({
        next: (response: User) => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Signup failed', err);
          // Ajouter ici un message d'erreur pour l'utilisateur ou une autre gestion d'erreur
        },
        complete: () => {
          console.log('Signup request completed');
        }
      });
    }
  }
}

