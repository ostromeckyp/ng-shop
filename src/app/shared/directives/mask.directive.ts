import { booleanAttribute, Directive, ElementRef, HostListener, inject, input, Renderer2, } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * TODO - host binding migration
 * https://ngxtension.netlify.app/utilities/migrations/host-binding-migration/
 */
@Directive({
  selector: '[appMask]',
  standalone: true,
})
export class MaskDirective {
  private readonly ngControl = inject(NgControl, {self: true});
  private readonly elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);

  readonly appMask = input.required<string>();
  readonly dropSpecialCharacters = input(false, {transform: booleanAttribute});

  private specialChars: string[] = [];

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    const {maskedValue, rawValue} = this.format(value);
    this.updateControl(maskedValue, rawValue);
  }

  @HostListener('keydown.backspace', ['$event.target.value'])
  onBackspace(value: string): void {
    if (value) {
      const lastChar = value.slice(-1);
      if (this.isSpecialChar(lastChar) && this.isPreviousCharSpecial(value.length - 1)) {
        const unmaskedValue = this.getRawValue(value.slice(0, -1));
        const {maskedValue, rawValue} = this.format(unmaskedValue);
        this.updateControl(maskedValue, rawValue);
      }
    }
  }

  private format(value: string): { maskedValue: string; rawValue: string } {
    const mask = this.appMask();

    this.specialChars = this.getSpecialChars(mask);
    const rawValue = this.getRawValue(value);
    let maskedValue = '';
    let rawIndex = 0;

    for (let i = 0; i < mask.length && rawIndex < rawValue.length; i++) {
      const maskChar = mask[i];
      const dataChar = rawValue[rawIndex];

      if (this.isSpecialChar(maskChar)) {
        maskedValue += maskChar;
      } else if (this.isValidChar(dataChar, maskChar)) {
        maskedValue += this.transformChar(dataChar, maskChar);
        rawIndex++;
      } else {
        break;
      }
    }

    return {maskedValue, rawValue: this.getRawValue(maskedValue)};
  }

  private updateControl(maskedValue: string, rawValue: string): void {
    const dropSpecial = this.dropSpecialCharacters();
    if (dropSpecial) {
      this.renderer.setProperty(this.elementRef.nativeElement, 'value', maskedValue);
      this.ngControl.control?.setValue(rawValue, {emitModelToViewChange: !dropSpecial});
      return;
    }
    this.ngControl.control?.setValue(maskedValue);
  }

  private getRawValue(value: string): string {
    return value.split('').filter(char => !this.isSpecialChar(char)).join('');
  }

  private getSpecialChars(mask: string): string[] {
    if (this.specialChars.length) {
      return this.specialChars;
    }
    return mask.split('').filter(char => this.isSpecialChar(char));
  }

  private isSpecialChar(char: string): boolean {
    return !/^[A-Za-z0-9]$/.test(char);
  }

  private isPreviousCharSpecial(currentIndex: number): boolean {
    const mask = this.appMask();
    return currentIndex > 0 && this.isSpecialChar(mask[currentIndex - 1]);
  }

  private isValidChar(char: string, maskChar: string): boolean {
    switch (maskChar) {
      case '0':
        return /^\d$/.test(char);
      case 'A':
        return /^[A-Z]$/.test(char);
      case 'a':
        return /^[a-z]$/.test(char);
      case 'S':
        return /^[A-Za-z]$/.test(char);
      case '*':
        return /^[A-Za-z0-9]$/.test(char);
      default:
        return false;
    }
  }

  private transformChar(char: string, maskChar: string): string {
    switch (maskChar) {
      case 'A':
        return char.toUpperCase();
      case 'a':
        return char.toLowerCase();
      default:
        return char;
    }
  }
}
