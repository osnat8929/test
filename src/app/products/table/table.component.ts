import { OnInit, Output, EventEmitter } from '@angular/core';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProductsService } from '../products.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Input() productsList!: any;
  productProperties: string[] = [];
  productForm: FormGroup;
  rowsPerPage: number = 10;
  currentPage: number = 1;
  currentPageData: any[];
  @Input() countByCategory: { [category: string]: number };
  @Input() category!: string;
  prevCategory: string;
  productsListByCategory: any;
  startIndex: number;
  endIndex: number;

  constructor(private productsService: ProductsService, private formBuilder: FormBuilder) { }
  ngOnInit() {
    this.productForm = new FormGroup({
      id: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(25)]),
      name: new FormControl("", [Validators.required, Validators.minLength(2)]),
      description: new FormControl(""),
      features: new FormControl(""),
      price: new FormControl("", [Validators.required, Validators.pattern('^[0-9.]*$')]),//,[this.minValueValidator(0)]
      keywords: new FormControl(""),
      url: new FormControl(""),
      category: new FormControl(""),
      subcategory: new FormControl("")
    })
  }
  ngOnChanges(changes: SimpleChanges) {
    this.updateCurrentPageData();
    if (changes.productsList && changes.productsList.currentValue) {
      if (this.productsList.length > 0) {
        this.productProperties = Object.keys(this.productsList[0]);
        this.productProperties = this.productProperties.filter(key => key !== 'url' && key != 'keywords');
        this.updateCurrentPageData();
      }
    }
  }
  updateCurrentPageData() {
    // Calculate the start and end index of the rows to display
    this.startIndex = (this.currentPage - 1) * this.rowsPerPage;
    this.endIndex = this.startIndex + this.rowsPerPage;
    if (this.category != this.prevCategory) {
      this.productsListByCategory = this.productsList.filter(item => item.category === this.category);
      this.currentPage = 1;
      this.startIndex = (this.currentPage - 1) * this.rowsPerPage;
      this.endIndex = this.startIndex + this.rowsPerPage;
      this.prevCategory = this.category;
    }
    else if (this.category == undefined)
      this.productsListByCategory = this.productsList;
    // Get the data to display for the current page
    this.currentPageData = this.productsListByCategory.slice(this.startIndex, this.endIndex);
  }

  goToPage(pageNumber: number) {
    // Update the current page
    this.currentPage = pageNumber;
    this.updateCurrentPageData();
  }

  nextPage() {
    // Go to the next page if available
    if (this.currentPage < this.totalPages().length) {
      this.currentPage++;
      this.updateCurrentPageData();
    }
  }

  previousPage() {
    // Go to the previous page if available
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateCurrentPageData();
    }
  }
  totalPages(): number[] {
    const totalPages = Math.ceil(this.productsListByCategory.length / this.rowsPerPage);
    return Array(totalPages).fill(0).map((_, index) => index + 1);
  }
  editProduct(product: any) {
    this.productForm.patchValue(product);
    this.open();
  }
  deleteProduct(product: any) {
    const index = this.productsList.findIndex(obj => obj.id === product.id);
    if (index > -1) {
      this.productsList.splice(index, 1);
      this.countByCategory[product.category]--;
      this.productsListByCategory = this.productsList;
      this.updateCurrentPageData();
      alert('Product deleted successfully.')
    }
  }
  addProduct() {
    this.productForm.reset();
    this.open();
  }
  open() {
    // פתיחת הפופאפ
    document.getElementById('myModal').style.display = 'block'
  }
  close() {
    // סגירת הפופאפ
    document.getElementById('myModal').style.display = 'none'
  }
  onSubmit() {
    if (this.productForm.valid) {
      // עדכון
      const index = this.productsList.findIndex(obj => obj.id === this.productForm.value.id);
      if (index > -1) {
        this.productsList = this.productsList.map((obj) => {
          if (obj.id === this.productForm.value.id)
            return this.productForm.value
          return obj;
        })
        this.productsListByCategory = this.productsList;
        this.updateCurrentPageData();
        this.close()
        alert('Product edited successfully.')
      }
      // הוספה
      else {
        this.productsList.push(this.productForm.value);
        this.productsListByCategory = this.productsList;
        this.updateCurrentPageData();
        this.addCount(this.productForm.value.category)
        this.close()
        alert('Product added successfully.')
      }
    }
  }
  addCount(category: string) {
    if (this.countByCategory.hasOwnProperty(category)) {
      this.countByCategory[category]++;
    } else {
      this.countByCategory[category] = 1;
    }
  }
  sortByPrice() {
    this.productsListByCategory = this.productsListByCategory.sort((a, b) => a.price - b.price);
    this.currentPageData = this.productsListByCategory.slice(this.startIndex, this.endIndex);
  }
}