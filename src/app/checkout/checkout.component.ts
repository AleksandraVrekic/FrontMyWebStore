import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormService } from '../services/form.service';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Product } from '../models/product-model';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order';
import { OrderItem } from '../models/order-item';
import { Account } from '../models/account';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatSnackBarModule]
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [0];
  creditCardMonths: number[] = [0];

  constructor(
    private formBuilder: FormBuilder,
    private formService: FormService,
    private cartService: CartService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private orderService: OrderService,
  ) {}

  showSuccessMessage(): void {
    this.snackBar.open('Order successfully created!', 'Close', {
      duration: 3000 // zatvara se nakon 3000 milisekundi
    });
  }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [localStorage.getItem('firstName') || ''],
        lastName: [localStorage.getItem('lastName') || ''],
        email: [localStorage.getItem('email') || '']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), this.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    this.cartService.getCartItems().subscribe(items => {
      this.updateCartSummary(items);
    });

    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    this.formService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );
  }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }

  onSubmit() {
    if (this.checkoutFormGroup.valid) {
      const orderData = this.prepareOrderData();
      this.orderService.createOrder(orderData).subscribe({
        next: (order) => {
          console.log('Order successfully created:', order);
          this.snackBar.open('Order successfully created!', 'Close', {
            duration: 3000
          });
          this.cartService.clearCart();
          console.log('Cart items after clearing:', this.cartService.getCartItemsValue());
          // Dodatni logovi za proveru
          this.cartService.getCartItems().subscribe(items => {
            console.log('Cart items after clearing (observable):', items);
          });
        },
        error: (error) => {
          console.error('Error creating order:', error);
          this.snackBar.open('Error creating order. Please try again.', 'Close', {
            duration: 3000
          });
        }
      });
    } else {
      console.error('Form is not valid');
      this.markAllAsTouched(this.checkoutFormGroup);
      this.snackBar.open('Please fill all required fields correctly!', 'Close', {
        duration: 3000
      });
    }
  }

    // Metod koji priprema podatke za narudžbinu
    prepareOrderData(): Order {
      const formValues = this.checkoutFormGroup.value;
      const items = this.cartService.getCartItemsValue();

      const orderItems: OrderItem[] = items.map(item => {
        const product = new Product(item.id, item.name, item.description, item.price, item.quantity, item.image, item.category);
        return new OrderItem(item.quantity, product);
      });

      const account = new Account(
        Number(localStorage.getItem('userId')),
        '',  // username is not available in local storage based on provided info
        '',  // password is not available in local storage based on provided info
        localStorage.getItem('firstName') || '',
        localStorage.getItem('lastName') || '',
        localStorage.getItem('email') || '',
        localStorage.getItem('userRole') || ''
      );

      const orderDate = new Date(); // Kreiranje novog Date objekta za trenutni datum

      const order = new Order(
        orderDate,
        'processing',
        this.totalPrice,
        0,
        account,
        orderItems
      );

      console.log('Prepared order data:', order);
      return order;
    }

  markAllAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup) {
        this.markAllAsTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    if (!creditCardFormGroup) {
      console.error("Credit card form group is not available.");
      return;
    }

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      },
      error => {
        console.error("Failed to retrieve credit card months:", error);
      }
    );
  }

  updateCartSummary(items: Product[]): void {
    this.totalPrice = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    this.totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  }

  notOnlyWhitespace(control: FormControl): { [key: string]: boolean } | null {
    if ((control.value || '').trim().length === 0) {
      return { 'notOnlyWhitespace': true };
    }
    return null;
  }
}


