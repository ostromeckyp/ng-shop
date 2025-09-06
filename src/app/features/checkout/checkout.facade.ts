import { inject, Injectable, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '@features/cart';
import { Router } from '@angular/router';
import { CheckoutFormControls, CheckoutFormGroup } from '@features/checkout/checkout.model';

@Injectable()
export class CheckoutFacade {
  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  readonly cartItems = this.cartService.items;
  readonly totalPrice = this.cartService.totalPrice;
  readonly isEmpty = this.cartService.isEmpty;

  readonly isSubmitting = signal(false);
  readonly isOrderComplete = signal(false);

  readonly checkoutForm: CheckoutFormGroup = this.fb.group<CheckoutFormControls>({
    customerInfo: this.fb.nonNullable.group({
      firstName: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
      lastName: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
      email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
      phone: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)])
    }),
    shippingAddress: this.fb.nonNullable.group({
      street: this.fb.nonNullable.control('', [Validators.required]),
      city: this.fb.nonNullable.control('', [Validators.required]),
      state: this.fb.nonNullable.control('', [Validators.required]),
      zipCode: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]),
      country: this.fb.nonNullable.control('', [Validators.required])
    }),
    paymentInfo: this.fb.nonNullable.group({
      cardNumber: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(/^\d{16}$/)]),
      expiryDate: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]),
      cvv: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(/^\d{3,4}$/)]),
      cardholderName: this.fb.nonNullable.control('', [Validators.required])
    })
  });

  public submit(): void {
    if (!this.validate() && !this.isEmpty()) {
      return;
    }
    this.isSubmitting.set(true);
    // Simulate API call
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.isOrderComplete.set(true);
      this.cartService.clearCart();

      // Redirect to success page after 2 seconds
      setTimeout(() => {
        this.router.navigate(['/products']);
      }, 2000);
    }, 2000);
  }


  private validate(): boolean {
    Object.keys(this.checkoutForm.controls).forEach(key => {
      const control = this.checkoutForm.get(key);
      if (control) {
        control.markAsTouched();
        if (control instanceof FormGroup) {
          Object.keys(control.controls).forEach(nestedKey => {
            control.get(nestedKey)?.markAsTouched();
          });
        }
      }
    });

    return this.checkoutForm.valid;
  }
}
