import { Routes } from '@angular/router';
import { CheckoutPage } from './features/checkout/checkout-page/checkout-page';
import { ProductDetail } from './features/products/product-detail/product-detail';
import { ProductPage } from './features/products/product-page/product-page';

export const routes: Routes = [
    { path: '', redirectTo: 'products', pathMatch: 'full' },
    { path: 'products', component: ProductPage },
    { path: 'checkout', component: CheckoutPage},
    { path: 'products/:id', component: ProductDetail },

    //Questa route deve stare per ultima!!!
    { path: '**', loadComponent: 
    () => import('./shared/not-found/not-found').then(m => m.NotFoundComponent) },
];
