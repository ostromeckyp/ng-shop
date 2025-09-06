import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type ControlsOf<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Record<any, any> ?
    T[K] extends Array<infer U> ?
      U extends Record<any, any> ?
        FormArray<FormGroup<ControlsOf<U>>>
        : FormArray<FormControl<U>>
      : FormGroup<ControlsOf<T[K]>>
    : FormControl<T[K]>;
};
