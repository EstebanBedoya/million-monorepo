// Domain Entity - Core business logic
export class Property {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly currency: string,
    public readonly location: string,
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

  static create(data: {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    location: string;
    propertyType: string;
    area: number;
    areaUnit: string;
    features: string[];
    images: string[];
    status: string;
    createdAt: string;
    updatedAt: string;
    bedrooms?: number;
    bathrooms?: number;
  }): Property {
    return new Property(
      data.id,
      data.name,
      data.description,
      data.price,
      data.currency,
      data.location,
      data.propertyType as PropertyType,
      data.area,
      data.areaUnit as AreaUnit,
      data.features,
      data.images,
      data.status as PropertyStatus,
      new Date(data.createdAt),
      new Date(data.updatedAt),
      data.bedrooms,
      data.bathrooms
    );
  }

  public isAvailable(): boolean {
    return this.status === PropertyStatus.AVAILABLE;
  }

  public isExpensive(): boolean {
    return this.price > 1000000;
  }

  public hasMinimumFeatures(): boolean {
    return this.features.length >= 3;
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

