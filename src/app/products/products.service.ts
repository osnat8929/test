import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private _http: HttpClient) { }

  getProductsFromServer(): Observable<[]> {
    return this._http.get<[]>('https://raw.githubusercontent.com/GoogleChromeLabs/sample-pie-shop/master/src/data/products.json')////
  }
}
