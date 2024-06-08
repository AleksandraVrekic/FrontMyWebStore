import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { Customer } from '../../models/customer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css']
})
export class CustomerProfileComponent implements OnInit {
  customer: Customer | null = null;

  constructor(
    private customerService: CustomerService,
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    const username = this.authService.getUsername();
    if (username) {
      this.customerService.getUserProfileByUsername(username).subscribe(customer => {
        this.customer = customer;
      });
    }
  }

  editProfile(): void {
    if (this.customer) {
      this.router.navigate([`/customers/edit/${this.customer.id}`]);
    }
  }

  deleteProfile(): void {
    if (this.customer && confirm('Are you sure you want to delete your account?')) {
      this.customerService.deleteCustomer(this.customer.id).subscribe(() => {
        this.authService.logout();
        this.router.navigate(['/']); // Redirect to home or login page
      });
    }
  }
}
