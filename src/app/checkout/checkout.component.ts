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
import { PaymentInfo } from '../models/payment-info';
import { environment } from '../../environments/environment';

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

  // initialize Stripe API
  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";
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

    // setup Stripe payment form
    this.setupStripePaymentForm();


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
        /*
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), this.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
        */
      })
    });

    this.cartService.getCartItems().subscribe(items => {
      this.updateCartSummary(items);
    });

    /*
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
    );*/
  }

  setupStripePaymentForm() {

    // get a handle to stripe elements
    var elements = this.stripe.elements();

    // Create a card element ... and hide the zip-code field
    this.cardElement = elements.create('card', { hidePostalCode: true });

    // Add an instance of card UI component into the 'card-element' div
    this.cardElement.mount('#card-element');

    // Add event binding for the 'change' event on the card element
    this.cardElement.on('change', (event: any) => {

      // get a handle to card-errors element
      this.displayError = document.getElementById('card-errors');

      if (event.complete) {
        this.displayError.textContent = "";
      } else if (event.error) {
        // show validation error to customer
        this.displayError.textContent = event.error.message;
      }

    });

  }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }

  onSubmit() {


    // compute payment info
    this.paymentInfo.amount = this.totalPrice * 100;
    this.paymentInfo.currency = "USD";

    // if valid form then
    // - create payment intent
    // - confirm card payment
    // - place order


    if (this.checkoutFormGroup.valid && this.displayError.textContent === "") {
      // Step 1: Create the payment intent
      this.orderService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          // Step 2: Confirm the card payment
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method: {
                card: this.cardElement
              }
            }, { handleActions: false })
          .then((result: any) => {
            if (result.error) {
              // Step 3: Inform the customer if there was an error
              alert(`There was an error: ${result.error.message}`);
            } else {
              // Step 4: Place the order if the payment was successful
              const orderData = this.prepareOrderData();
              this.orderService.createOrder(orderData).subscribe({
                next: (order) => {
                  alert(`Your order has been received.\nOrder tracking number: ${order.orderTrackingNumber}`);
                  this.snackBar.open('Order successfully created!', 'Close', {
                    duration: 3000
                  });
                  this.cartService.clearCart();
                  console.log('Cart items after clearing:', this.cartService.getCartItemsValue());
                  // Additional logs for verification
                  this.cartService.getCartItems().subscribe(items => {
                    console.log('Cart items after clearing (observable):', items);
                  });
                },
                error: (error) => {
                  alert(`There was an error: ${error.message}`);
                  console.error('Error creating order:', error);
                  this.snackBar.open('Error creating order. Please try again.', 'Close', {
                    duration: 3000
                  });
                }
              });
            }
          });
        },
        error => {
          console.error('Error creating payment intent:', error);
          this.snackBar.open('Error processing payment. Please try again.', 'Close', {
            duration: 3000
          });
        }
      );
    } else {
      this.checkoutFormGroup.markAllAsTouched();
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

  /*
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
  */

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


