import { Component, inject } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { Product } from '../../../core/models/product';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, filter, map, startWith } from 'rxjs';
import { ProductService } from '../../../core/services/product';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { PageEvent, MatPaginator } from '@angular/material/paginator';

type Sort = 'priceAsc' | 'priceDesc' | 'dateAsc' | 'dateDesc';
const cmp = (s:Sort)=>(a:Product,b:Product)=>
s==='priceAsc'? a.price-b.price :
s==='priceDesc'? b.price-a.price :
s==='dateAsc'? a.createdAt.localeCompare(b.createdAt) :
b.createdAt.localeCompare(a.createdAt); //default dateDesc


@Component({
  selector: 'app-product-page',
  imports: [ProductCard, FormsModule, MatFormFieldModule, MatInput, MatLabel, AsyncPipe, MatSelectModule, MatOptionModule, MatPaginator],
  templateUrl: './product-page.html',
  styleUrls: ['./product-page.scss'],
})
export class ProductPage {
  private service = inject(ProductService);

  protected readonly products$ = this.service.list().pipe(
  map(products => products.map(p => ({
    ...p,
    createdAt: (p as any).created_at // mappa snake_case -> camelCase
  })))
);


  private filters$ = new BehaviorSubject({
    title: '',
    minPrice: null as number | null,
    maxPrice: null as number | null,
    sort: 'dateDesc' as Sort
  })

  title$ = this.filters$.pipe(
    map(f => f.title),
    debounceTime(250),
    distinctUntilChanged(),
    startWith(this.filters$.value.title)
  );

  filteredProducts$ = combineLatest([
    this.products$,
    this.filters$,
    this.title$
  ]).pipe(
    map(([products, filters, title]) => products.filter(product => {
      const matchesTitle = !title || 
      product.title.toLowerCase().includes(filters.title.toLowerCase());
      const matchesMin = filters.minPrice === null ||
      product.price >= filters.minPrice;
      const matchesMax = filters.maxPrice === null ||
      product.price <= filters.maxPrice;

      return matchesTitle && matchesMin && matchesMax;
    }).toSorted(cmp(filters.sort))) //viene prima filtrato e poi ordinato
  );

  page$= new BehaviorSubject(1);
  pageSize=6;
  paged$ = combineLatest([this.filteredProducts$, this.page$]).pipe(
    map(([items,page]) =>
    {
      const start = (page-1)*this.pageSize;
      return items.slice(start, start+this.pageSize);
    })
  );

  onPage(e: PageEvent) {this.page$.next(e.pageIndex+1); }
  
  updateTitle(title: string) {
    console.log('Filtri applicati:');
    this.filters$.next({
      ...this.filters$.value,
      title: title
    });

  }

  updateSort(sort: Sort) {
    console.log('Ordinamento applicato:', sort);
    this.filters$.next({
      ...this.filters$.value,
      sort: sort
    });
  }

  onAddToCart(product: Product) {
    console.log('Aggiunto al carrello:', product);
  }

  updateMinPrice(value: string) {
  const min = value ? parseFloat(value) : null;
  this.filters$.next({
    ...this.filters$.value,
    minPrice: min
  });
  console.log('Min Price:', min);
}

updateMaxPrice(value: string) {
  const max = value ? parseFloat(value) : null;
  this.filters$.next({
    ...this.filters$.value,
    maxPrice: max
  });
  console.log('Max Price:', max);
}

}

