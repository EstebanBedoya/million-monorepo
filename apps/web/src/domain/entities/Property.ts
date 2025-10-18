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
    public readonly images: PropertyImage[] | string[],
    public readonly status: PropertyStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly bedrooms?: number,
    public readonly bathrooms?: number,
    public readonly year?: number,
    public readonly owner?: PropertyOwner,
    public readonly traces?: PropertyTrace[]
  ) {}

  public getEnabledImages(): PropertyImage[] {
    if (this.images.length === 0) return [];
    
    if (typeof this.images[0] === 'string') {
      return this.images.map((img, index) => ({
        idPropertyImage: `img-${index}`,
        idProperty: this.id,
        file: img as string,
        enabled: true
      }));
    }
    
    return (this.images as PropertyImage[]).filter(img => img.enabled);
  }

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
    images: PropertyImage[] | string[];
    status: string;
    createdAt: string;
    updatedAt: string;
    bedrooms?: number;
    bathrooms?: number;
    year?: number;
    owner?: PropertyOwner;
    traces?: PropertyTrace[];
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
      data.bathrooms,
      data.year,
      data.owner,
      data.traces
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

export interface PropertyImage {
  idPropertyImage: string;
  idProperty: string;
  file: string;
  enabled: boolean;
}

export interface PropertyOwner {
  idOwner: string;
  name: string;
  address: string;
  birthday: string;
  photo: string;
}

export interface PropertyTrace {
  idPropertyTrace: string;
  dateSale: string;
  idProperty: string;
  name: string;
  tax: number;
  value: number;
}

