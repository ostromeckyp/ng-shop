import { ControlsOf } from '@shared/models/controls-of.model';
import { FormGroup } from '@angular/forms';

export type CheckoutFormValue = {
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentInfo: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
  };
}
export type CheckoutFormControls = ControlsOf<CheckoutFormValue>;
export type CheckoutFormGroup = FormGroup<CheckoutFormControls>;
