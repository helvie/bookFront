import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-reset-password',
  templateUrl: './request-reset-password.component.html',
  styleUrls: ['./request-reset-password.component.scss']
})
export class RequestResetPasswordComponent {
  email: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.authService.requestResetPassword(this.email).subscribe({
      next: () => {    
        alert('Password reset request sent');
        this.router.navigate(['/login']);
      },
      error: (error) => console.error('Request failed', error)
    });
  }
}
