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
import { CartComponent } from './app/cart/cart.component';
import { TransactionComponent } from './app/transactions/transaction/transaction.component';
import { StaffComponent } from './app/admin/staff/staff.component';
import { EditCustomerComponent } from './app/customer/edit-customer/edit-customer.component';
import { CustomerProfileComponent } from './app/customer/customer-profile/customer-profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule
import { OrderListComponent } from './app/order/order-list/order-list.component';
import { CustomerOrdersComponent } from './app/order/customer-order/customer-order.component';
import { AuthGuard } from './app/guards/auth.guard';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      HttpClientModule,
      MatDialogModule,
      BrowserAnimationsModule // Add BrowserAnimationsModule here
    ),
    provideRouter([
      { path: '', redirectTo: '/products', pathMatch: 'full' },
      { path: 'products', component: ProductsListComponent },
      { path: 'edit-product/:id', component: EditProductComponent },
      { path: 'products/:id', component: ProductDetailsComponent },
      { path: 'auth', loadChildren: () => import('./app/authentication/authentication.module').then(m => m.AuthenticationModule) },
      { path: 'auth/login', loadComponent: () => import('./app/authentication/login/login.component').then(m => m.LoginComponent) },
      { path: 'auth/register', loadComponent: () => import('./app/authentication/register/register.component').then(m => m.RegisterComponent) },
      { path: 'admin', component: TransactionComponent },
      { path: 'admin/staff', component: StaffComponent },
      { path: 'customers/edit/:id', component: EditCustomerComponent },
      { path: 'profile/:id', component: CustomerProfileComponent },
      { path: 'cart', component: CartComponent },
      { path: 'orders', component: OrderListComponent }, // Dodavanje rute za porudžbine
      { path: 'orders', component: OrderListComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
      { path: 'customer/orders', component: CustomerOrdersComponent, canActivate: [AuthGuard], data: { roles: ['CUSTOMER'] } },
    ])
  ]
})
  .catch(err => console.error(err));
