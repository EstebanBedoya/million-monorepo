// Domain Entity - Core business logic
export class Property {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly price: number,
    public readonly currency: string,
    public readonly location: Location,
    public readonly propertyType: PropertyType,
    public readonly area: number,
    public readonly areaUnit: AreaUnit,
    public readonly features: string[],
    public readonly images: string[],
    public readonly status: PropertyStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly bedrooms?: number,
    public readonly bathrooms?: number
  ) {}

  // Business rules
  public isAvailable(): boolean {
    return this.status === PropertyStatus.AVAILABLE;
  }

  public isExpensive(): boolean {
    return this.price > 1000000; // Example business rule
  }

  public hasMinimumFeatures(): boolean {
    return this.features.length >= 3; // Example business rule
  }

  public getFormattedPrice(): string {
    return `${this.currency} ${this.price.toLocaleString()}`;
  }
}

export enum PropertyType {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  COMMERCIAL = 'commercial',
  LAND = 'land'
}

export enum PropertyStatus {
  AVAILABLE = 'available',
  SOLD = 'sold',
  RENTED = 'rented'
}

export enum AreaUnit {
  M2 = 'm2',
  SQFT = 'sqft'
}

export class Location {
  constructor(
    public readonly address: string,
    public readonly city: string,
    public readonly state: string,
    public readonly country: string,
    public readonly coordinates?: Coordinates
  ) {}

  public getFullAddress(): string {
    return `${this.address}, ${this.city}, ${this.state}, ${this.country}`;
  }
}

export class Coordinates {
  constructor(
    public readonly lat: number,
    public readonly lng: number
  ) {}
}
