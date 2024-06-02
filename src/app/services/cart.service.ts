import { Injectable } from '@angular/core';
import { Product } from '../models/product-model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: Product[] = this.loadCartItems();
  private cartItemsSubject = new BehaviorSubject<Product[]>(this.cartItems);

  getCartItems() {
    return this.cartItemsSubject.asObservable();
  }

    // Nova metoda za dobijanje trenutne vrednosti korpe
 getCartItemsValue(): Product[] {
   return this.cartItemsSubject.value;
 }

  addToCart(product: Product) {
    const existingProduct = this.cartItems.find(item => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      product.quantity = 1;
      this.cartItems.push(product);
    }
    this.cartItemsSubject.next(this.cartItems);
    this.saveCartItems();
  }

  removeFromCart(product: Product) {
    const existingProduct = this.cartItems.find(item => item.id === product.id);
    if (existingProduct && existingProduct.quantity > 1) {
      existingProduct.quantity--;
    } else {
      this.cartItems = this.cartItems.filter(item => item !== product);
    }
    this.cartItemsSubject.next(this.cartItems);
    this.saveCartItems();
  }

  clearCart() {
    this.cartItems = [];
    this.cartItemsSubject.next(this.cartItems);
    this.saveCartItems();
  }

  private saveCartItems() {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  private loadCartItems(): Product[] {
    const cartItemsJson = localStorage.getItem('cartItems');
    return cartItemsJson ? JSON.parse(cartItemsJson) : [];
  }
}
