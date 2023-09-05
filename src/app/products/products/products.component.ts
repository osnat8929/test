import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  productsList: any[] = [];
  categories: string[] = [];
  countByCategory: { [category: string]: number } = {};
  category: string;

  constructor(private productsService: ProductsService) { }

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.productsService.getProductsFromServer().subscribe(products => {
      if (products) {
        this.productsList = products['products'].data['items'];
        this.findCategories();
        this.countProductsByCategory();
      }
    }, err => {
      alert("error");
    })
  }
  findCategories(): void {
    this.categories = [...new Set(this.productsList.map(product => product.category))];
  }
  countProductsByCategory(): void {
    this.productsList.forEach(product => {
      if (this.countByCategory[product.category]) {
        this.countByCategory[product.category]++;
      } else {
        this.countByCategory[product.category] = 1;
      }
    });
  }
  get categoryCounts(): { category: string, quantity: number }[] {
    return Object.entries(this.countByCategory).map(([category, quantity]) => ({ category, quantity }));
  }
  theCategory(category: any) {
    this.category = category
  }
}