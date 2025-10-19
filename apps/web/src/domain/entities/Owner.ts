export class Owner {
  constructor(
    public readonly idOwner: string,
    public readonly name: string,
    public readonly address: string,
    public readonly photo: string,
    public readonly birthday: string
  ) {}

  static create(data: {
    idOwner: string;
    name: string;
    address: string;
    photo: string;
    birthday: string;
  }): Owner {
    return new Owner(
      data.idOwner,
      data.name,
      data.address,
      data.photo,
      data.birthday
    );
  }

  public getFormattedBirthday(): string {
    return new Date(this.birthday).toLocaleDateString();
  }
}

export interface CreateOwnerDto {
  name: string;
  address: string;
  photo?: string;
  birthday: string;
}

export interface UpdateOwnerDto {
  name?: string;
  address?: string;
  photo?: string;
  birthday?: string;
}

export interface OwnerDto {
  idOwner: string;
  name: string;
  address: string;
  photo: string;
  birthday: string;
}

