import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from '../../services/cart.service';



@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode:boolean = false; 
  thePageNumber:number=1;
  thePageSize:number=10;
  theTotalElements:number=0;
  previousKeyword:string;

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
                private cartService:CartService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode)
    {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }

   
  }

  handleSearchProducts() {
    const keyword:string = this.route.snapshot.paramMap.get('keyword');

    //Iff we have a different keyword then previous then
    //set the pageNumber to 1

    if(this.previousKeyword != keyword)
    {
      this.thePageNumber = 1;
    }

    this.previousKeyword = keyword;

    this.productService.searchProductsPaginate(this.thePageNumber - 1,
      this.thePageSize,
      keyword).
      subscribe( this.processResult())
  }

  handleListProducts(){

     // check if "id" parameter is available
   const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

   if (hasCategoryId) {
     // get the "id" param string. convert string to a number using the "+" symbol
     this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
   }
   else {
     // not category id available ... default to category id 1
     this.currentCategoryId = 1;
   }

   // check if we have a different category then previous.
   // Note:Angular will reuse the component if it is currently being used

   //if we have a different category id then previous
   //then set the pageNumber back to 1

   if(this.previousCategoryId != this.currentCategoryId) {
     this.thePageNumber = 1;
   }

   this.previousCategoryId = this.currentCategoryId; 

   console.log(this.currentCategoryId )
   // now get the products for the given category id
   this.productService.getProductListPaginate(this.thePageNumber - 1,
    this.thePageSize,
    this.currentCategoryId).
    subscribe( this.processResult())

  }

  processResult() {
   
    
      return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
      }
    
  }

  updatePageSize(pageSize:number){
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }


  addToCart(product:Product) {
    
    const theCartItem = new CartItem(product);
    this.cartService.addToCart(theCartItem);
  }

}
