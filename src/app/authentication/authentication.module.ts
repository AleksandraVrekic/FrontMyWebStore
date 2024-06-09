import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    ReactiveFormsModule,
    LoginComponent,
    RegisterComponent,
    MatSnackBarModule
  ]
})
export class AuthenticationModule { }
