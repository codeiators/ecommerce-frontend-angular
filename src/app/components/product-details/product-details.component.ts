import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product: Product = new Product();

  constructor(private productService:ProductService,
    private route: ActivatedRoute,
    private cartService:CartService) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe( () => {
      this.handleProductDetails()
    })
  }
  handleProductDetails() {
   const theProductId:number = +this.route.snapshot.paramMap.get('id');

   this.productService.getProduct(theProductId).subscribe( (data) => {
       this.product = data; 
   })
  }

  addToCart() {
    let cartItem = new CartItem(this.product);
    this.cartService.addToCart(cartItem);

  }
}
