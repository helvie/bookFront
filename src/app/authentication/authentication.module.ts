import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { LoginComponent } from './views/login/login.component';
import { SignupComponent } from './views/signup/signup.component';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';
import { RequestResetPasswordComponent } from './views/request-reset-password/request-reset-password.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { AuthenticationRoutingModule } from './authentication-routing.module';  
import { SharedModule } from '../shared-module/shared-module.module';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    ResetPasswordComponent,
    RequestResetPasswordComponent,
    ChangePasswordComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    AuthenticationRoutingModule,
    SharedModule
  ],
  exports: [
    LoginComponent,
    SignupComponent,
    ResetPasswordComponent,
    RequestResetPasswordComponent,
    ChangePasswordComponent  ]
})
export class AuthenticationModule { }
