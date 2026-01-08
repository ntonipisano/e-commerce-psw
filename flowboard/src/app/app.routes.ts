import { Routes } from '@angular/router';
import { CheckoutPage } from './features/checkout/checkout-page/checkout-page';
import { ProductDetail } from './features/products/product-detail/product-detail';
import { ProductPage } from './features/products/product-page/product-page';
import { NotFoundComponent } from './shared/not-found/not-found';
import { checkoutGuard } from './core/guard/checkout-guard-guard';
import { LoginComponent } from './features/login/login';
import { RegisterComponent } from './features/register/register';
import { CartComponent } from './features/cart/cart';

export const routes: Routes = [
    { path: '', redirectTo: 'products', pathMatch: 'full' },
    { path: 'products', component: ProductPage },
    { path: 'checkout', canActivate: [checkoutGuard], component: CheckoutPage},
    { path: 'products/:id', component: ProductDetail },
    { path: 'login', component: LoginComponent },
    { path: 'logout', redirectTo: 'products' },
    { path: 'register', component: RegisterComponent },
    { path: 'cart', canActivate: [checkoutGuard], component: CartComponent },
    //Questa route deve stare per ultima!!!
    { path: '**', component: NotFoundComponent },
];
