/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export class Money {
  private readonly amountInMillions: number;
  private readonly currency: string;

  constructor(amountInMillions: number, currency = 'USD') {
    this.amountInMillions = amountInMillions;
    this.currency = currency;
  }

  get value(): number {
    return this.amountInMillions;
  }

  get symbol(): string {
    return this.currency === 'EUR' ? '€' : '$';
  }

  formatShort(): string {
    return `${this.symbol}${this.amountInMillions.toFixed(1).replace(/\.0$/, '')}M`;
  }

  formatFull(): string {
    const total = this.amountInMillions * 1_000_000;
    return `${this.symbol}${total.toLocaleString('es-ES')}`;
  }

  subtract(other: Money): Money {
    return new Money(this.amountInMillions - other.amountInMillions, this.currency);
  }

  add(other: Money): Money {
    return new Money(this.amountInMillions + other.amountInMillions, this.currency);
  }
}
