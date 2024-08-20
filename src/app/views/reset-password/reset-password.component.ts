import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.newPassword === this.confirmPassword) {
      const token = this.getTokenFromUrl(); 
      console.log(token)
      console.log(this.newPassword)
      this.authService.resetPassword(this.newPassword, token).subscribe({
        next: () => {
          alert('Password successfully reset');
          this.router.navigate(['/login']);
        },
        error: (error) => console.error('Reset failed', error)
      });
    } else {
      alert('Passwords do not match');
    }
  }

  private getTokenFromUrl(): string {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('token') || '';
  }
}



