import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  

  cartItems: CartItem[] = [];

  totalPrice:Subject<number> = new Subject<number>();

  totalQuantity:Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem:CartItem) {
    let alreadyExistInCart:boolean = false;
    let existingCartItem:CartItem = undefined;

    if (this.cartItems.length > 0) {

     existingCartItem = this.cartItems.find(cartItem => cartItem.id === theCartItem.id);
     alreadyExistInCart = (existingCartItem != undefined)
    }

    

     if (alreadyExistInCart){
       existingCartItem.quantity++;
     } else {
       this.cartItems.push(theCartItem);
     }
      console.log("calling cart totals");
     this.computeCartTotals() ;

    
  }
  computeCartTotals() {
    
    let totalPriceValue:number = 0;
    let totalItemQuantity:number = 0;
    for ( let tempCartItem of this.cartItems) {
      totalPriceValue += tempCartItem.quantity * tempCartItem.unitPrice;
      totalItemQuantity += tempCartItem.quantity;
      
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalItemQuantity);
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if(theCartItem.quantity === 0)
    {
      this.remove(theCartItem);
    }
    else {
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(cartItem => theCartItem.id === cartItem.id);
    if(itemIndex > -1){
      this.cartItems.splice(itemIndex, 1);
    }
  }
}
