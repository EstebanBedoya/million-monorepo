import { NextRequest, NextResponse } from 'next/server';
import { MockPropertyListSchema } from '../../../../domain/schemas/property.schema';
import propertiesData from '../../../../../public/mock/properties.json';

let mockProperties = [...propertiesData];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    let filteredProperties = mockProperties;
    
    if (search) {
      filteredProperties = filteredProperties.filter(property =>
        property.name.toLowerCase().includes(search.toLowerCase()) ||
        property.address.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (minPrice) {
      const min = parseInt(minPrice);
      filteredProperties = filteredProperties.filter(property => property.price >= min);
    }

    if (maxPrice) {
      const max = parseInt(maxPrice);
      filteredProperties = filteredProperties.filter(property => property.price <= max);
    }

    const total = filteredProperties.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

    const validatedProperties = MockPropertyListSchema.parse(paginatedProperties);

    return NextResponse.json({
      properties: validatedProperties,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/mock/properties:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.address || !body.price || !body.idOwner) {
      return NextResponse.json(
        { error: 'Missing required fields: name, address, price, idOwner' },
        { status: 400 }
      );
    }

    const newProperty = {
      id: `prop-${Date.now()}`,
      idOwner: body.idOwner,
      name: body.name,
      address: body.address,
      city: body.city || 'Unknown',
      price: body.price,
      image: body.image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      bedrooms: body.bedrooms,
      bathrooms: body.bathrooms,
      area: body.area,
      areaUnit: body.areaUnit || 'm²',
      propertyType: body.propertyType || 'House',
    };

    mockProperties.push(newProperty);

    return NextResponse.json(newProperty, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/mock/properties:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
