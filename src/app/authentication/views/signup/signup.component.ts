import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user/user';
import { SignupCredentials } from '../../models/signupCredentials';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  // FormGroup pour gérer le formulaire d'inscription
  signupForm!: FormGroup;

  // Injection des services FormBuilder, AuthService et Router
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  // Initialisation du formulaire avec les validations
  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  // Soumission du formulaire d'inscription
  onSubmit(): void {
    if (this.signupForm.valid) {
      const signupData: SignupCredentials = this.signupForm.value; // Récupère les données du formulaire
      this.authService.signup(signupData).subscribe({
        next: (response: User) => {
          this.router.navigate(['/dashboard']); // Redirige après succès
        },
        error: (err) => {
          console.error('Signup failed', err); // Gère les erreurs
        },
        complete: () => {
          console.log('Signup request completed'); // Log sur la fin de la requête
        }
      });
    }
  }
}
