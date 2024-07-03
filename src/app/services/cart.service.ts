import { Injectable } from '@angular/core';
import { Product } from '../models/product-model';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item';

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

  addToCart(product: Product): boolean {
    const existingProduct = this.cartItems.find(item => item.id === product.id);
    if (existingProduct) {
      if (existingProduct.quantity < product.quantity) {
        existingProduct.quantity++;
        this.cartItemsSubject.next(this.cartItems);
        this.saveCartItems();
        return true;
      } else {
        return false;
      }
    } else {
      this.cartItems.push({ ...product, quantity: 1 });
      this.cartItemsSubject.next(this.cartItems);
      this.saveCartItems();
      return true;
    }
  }

  decreaseQuantity(product: Product): boolean {
    const existingProduct = this.cartItems.find(item => item.id === product.id);
    if (existingProduct) {
      if (existingProduct.quantity > 1) {
        existingProduct.quantity--;
      } else {
        this.removeFromCart(product);
      }
      this.cartItemsSubject.next(this.cartItems);
      this.saveCartItems();
      return true;
    }
    return false;
  }

  removeFromCart(product: Product) {
    this.cartItems = this.cartItems.filter(item => item.id !== product.id);
    this.cartItemsSubject.next(this.cartItems);
    this.saveCartItems();
  }

  clearCart() {
    this.cartItems = [];
    this.cartItemsSubject.next(this.cartItems); // Emituje praznu korpu
    this.saveCartItems(); // Sprema praznu korpu u local storage
    console.log('Cart cleared. Current items:', this.cartItems);
  }

  private saveCartItems() {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  private loadCartItems(): Product[] {
    const cartItemsJson = localStorage.getItem('cartItems');
    return cartItemsJson ? JSON.parse(cartItemsJson) : [];
  }
}
