import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { CheckoutFacade } from '@features/checkout/checkout.facade';
import { CheckoutFormGroup } from './checkout.model';
import { Router } from '@angular/router';
import { MaskDirective } from '@shared/directives';

@Component({
  selector: 'app-checkout-form',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    CurrencyPipe,
    MaskDirective
  ],
  providers: [CheckoutFacade],
  templateUrl: './checkout-form.component.html',
  styleUrl: './checkout-form.component.scss'
})
export class CheckoutFormComponent {
  private readonly facade = inject(CheckoutFacade);
  private readonly router = inject(Router);

  protected readonly checkoutForm: CheckoutFormGroup = this.facade.checkoutForm;
  protected readonly cartItems = this.facade.cartItems;
  protected readonly totalPrice = this.facade.totalPrice;

  protected readonly isSubmitting = this.facade.isSubmitting;
  protected readonly isOrderComplete = this.facade.isOrderComplete;

  protected onSubmit(): void {
    this.facade.submit();
  }

  protected goBackToCart(): void {
    this.router.navigate(['/cart']);
  }

  constructor() {

    this.checkoutForm.valueChanges.subscribe(console.log);
  }
}
