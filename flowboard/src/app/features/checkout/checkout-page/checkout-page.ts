import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatOption } from "@angular/material/select";
import { MatAnchor } from "@angular/material/button";
import { CartService } from '../../../core/services/cart';
import { OrderService } from '../../../core/services/order';
import { CartItem } from '../../../core/models/cartitems';
import { map, take, startWith } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { Order } from '../../../core/models/order';

@Component({
  selector: 'app-checkout-page',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelect,
    MatOption,
    MatAnchor,
    CurrencyPipe,
    AsyncPipe
],
  templateUrl: './checkout-page.html',
  styleUrls: ['./checkout-page.scss'],
})
export class CheckoutPage {
  private fb = inject(FormBuilder);

  readonly form = this.fb.group({
    customer: this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName:['', [Validators.required, Validators.minLength(2)]],
      email:['', [Validators.required, Validators.email]]
    }),
    address: this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      zip:['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
    }),
    shippingMethod: ['standard', Validators.required],
    privacy: [false, Validators.requiredTrue],  
  });

  getControl(path: string) {
return this.form.get(path);
}

hasError(path: string, errorCode: string): boolean {
const control = this.getControl(path);
return !!control && control.hasError(errorCode) && control.touched;
}

private cart = inject(CartService);
private orderService = inject(OrderService);
readonly items$ = this.cart.cart$.pipe(
  map(cart => cart?.cart_items ?? [])
);
readonly total$ = this.items$.pipe(
  map((items: CartItem[]) => items.reduce(
    (sum: number, item: CartItem) => sum + item.unit_price * item.quantity, 0))
);

// Observable per la scelta della spedizione e relativi costi
readonly shipping$ = this.form.get('shippingMethod')!.valueChanges.pipe(
  startWith(this.form.get('shippingMethod')!.value)
);

readonly shippingCost$ = this.shipping$.pipe(
  map((method: string | null) => method === 'express' ? 15 : 5)
);

readonly totalWithShipping$ = combineLatest([this.total$, this.shippingCost$]).pipe(
  map(([total, ship]) => total + ship)
);

showSummary=false;
loading = false;
orderSuccess = false;
orderError = false;

onSubmit(): void {
if (this.form.invalid) {
this.form.markAllAsTouched();
this.showSummary = true;
this.focusFirstInvalid();
return;
}
this.loading = true;
this.orderSuccess = false;
this.orderError = false;
const value = this.form.getRawValue();
this.items$.pipe(take(1)).subscribe((items: CartItem[]) => {
const order: Order = {
customer: value.customer!,
address: value.address!,
items,
total: items.reduce(
(sum: number, it: CartItem) => sum + it.unit_price * it.quantity, 0),
createdAt: new Date().toISOString()
};
this.orderService.create(order).subscribe({
next: () => {
this.loading = false;
this.orderSuccess = true;
this.form.reset();
},
error: () => {
this.loading = false;
this.orderError = true;
}
});
});
}

private focusFirstInvalid(): void {
  const firstInvalid = document.querySelector (
    'form .ng-invalid[formControlName]'
  ) as HTMLElement | null;
  firstInvalid?.focus();
  }

}
