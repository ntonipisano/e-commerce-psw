import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Product } from "../models/product";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly baseUrl = 'http://localhost:3000';
  private http = inject(HttpClient);
  
    list(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.baseUrl}/products`);
}
  //id prodotto come stringa
    getProductById(id: string): Observable<Product> {
  return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
}
}