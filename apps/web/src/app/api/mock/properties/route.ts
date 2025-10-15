import { NextRequest, NextResponse } from 'next/server';
import { MockPropertyListSchema } from '../../../../domain/schemas/property.schema';
import propertiesData from '../../../../../public/mock/properties.json';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    // Filter properties based on search and price filters
    let filteredProperties = propertiesData;
    
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

    // Calculate pagination
    const total = filteredProperties.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

    // Validate response data with Zod
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
    console.error('Error in /api/mock/properties:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
