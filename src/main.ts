import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { ProductsListComponent } from './app/products/products-list/products-list.component';
import { ProductDetailsComponent } from './app/products/product-details/product-details.component';
import { RegisterComponent } from './app/authentication/register/register.component';
import { EditProductComponent } from './app/products/edit-product/edit-product.component';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule, MatDialogModule),
    provideRouter([
      { path: '', redirectTo: '/products', pathMatch: 'full' },
      { path: 'products', component: ProductsListComponent },
      { path: 'edit-product/:id', component: EditProductComponent },
      { path: 'products/:id', component: ProductDetailsComponent },
      { path: 'auth', loadChildren: () => import('./app/authentication/authentication.module').then(m => m.AuthenticationModule) },
      { path: 'auth/login', loadComponent: () => import('./app/authentication/login/login.component').then(m => m.LoginComponent) },
      { path: 'auth/register', loadComponent: () => import('./app/authentication/register/register.component').then(m => RegisterComponent) }
    ])
  ]
})
  .catch(err => console.error(err));
