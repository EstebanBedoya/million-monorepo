// Value Object - immutable and contains business logic
export class Price {
  constructor(
    private readonly amount: number,
    private readonly currency: string
  ) {
    if (amount < 0) {
      throw new Error('Price cannot be negative');
    }
    if (!currency || currency.length !== 3) {
      throw new Error('Currency must be a 3-letter code');
    }
  }

  public getAmount(): number {
    return this.amount;
  }

  public getCurrency(): string {
    return this.currency;
  }

  public getFormattedPrice(): string {
    return `${this.currency} ${this.amount.toLocaleString()}`;
  }

  public isExpensive(): boolean {
    return this.amount > 1000000;
  }

  public equals(other: Price): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }
}
