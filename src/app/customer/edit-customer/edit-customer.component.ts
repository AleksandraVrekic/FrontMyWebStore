
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Customer } from '../../models/customer';
import { CustomerService } from '../../services/customer.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-customer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatSnackBarModule ],
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.scss']
})
export class EditCustomerComponent implements OnInit {
  editProfileForm: FormGroup;
  customerId!: number;
  customer!: Customer;
  errorMessage: any;
  changePassword: boolean = false; // Flag for toggling password field visibility

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private snackBar: MatSnackBar,  // Inject MatSnackBar
    private customerService: CustomerService
  ) {
    this.editProfileForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        zip: ['', Validators.required]
      })
    });
  }

  ngOnInit(): void {
    this.customerId = Number(this.route.snapshot.paramMap.get('id')); // Convert string to number
    if (this.customerId) {
      this.loadCustomer();
    }
  }
  toggleChangePassword(): void {
    this.changePassword = !this.changePassword;
    if (!this.changePassword) {
      this.editProfileForm.get('password')?.reset();
    }
  }

  loadCustomer(): void {
    this.customerService.getCustomerById(this.customerId).subscribe(customer => {
      this.customer = customer;
      this.editProfileForm.patchValue({
        username: customer.account.userName,
        firstName: customer.account.firstName,
        lastName: customer.account.lastName,
        email: customer.account.email,
        phone: customer.phone,
        address: customer.address
      });
    });
  }

  onSubmit(): void {
    if (this.editProfileForm.valid) {
      const updatedCustomer: Customer = {
        ...this.customer,
        ...this.editProfileForm.value,
        account: {
          ...this.customer.account,
          userName: this.editProfileForm.value.username,
          firstName: this.editProfileForm.value.firstName,
          lastName: this.editProfileForm.value.lastName,
          email: this.editProfileForm.value.email,
          password: this.changePassword && this.editProfileForm.value.password ? this.editProfileForm.value.password : this.customer.account.password // Use existing password if not changed
        }
      };
      this.customerService.updateCustomer(this.customerId, updatedCustomer).subscribe(
        () => {
          this.router.navigate(['/profile', this.customerId.toString()]);
        },
        (error) => {
          console.error('Error updating customer:', error);
          this.errorMessage = error.error || 'An unexpected error occurred';
        }
      );
    }
  }
}
