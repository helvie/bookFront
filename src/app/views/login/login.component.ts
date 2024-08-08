import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  user: User = { email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.user).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: err => {
        console.error('Login failed', err);
      }
    });
  }
  }
