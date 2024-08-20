import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { Router } from '@angular/router';
import { LoginCredentials } from 'src/app/models/user/loginCredentials';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  user: LoginCredentials = { email: '', password: '' };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.authService.login(this.user).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (error) => console.error('Login failed', error)
    });
  }
}
