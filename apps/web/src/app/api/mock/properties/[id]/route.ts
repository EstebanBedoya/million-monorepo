import { NextRequest, NextResponse } from 'next/server';
import { MockPropertySchema } from '../../../../../domain/schemas/property.schema';
import propertiesData from '../../../../../../public/mock/properties.json';

let mockProperties = [...propertiesData];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = mockProperties.find(p => p.id === id);

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    const validatedProperty = MockPropertySchema.parse(property);

    return NextResponse.json(validatedProperty);
  } catch (error) {
    console.error('Error in GET /api/mock/properties/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const propertyIndex = mockProperties.findIndex(p => p.id === id);

    if (propertyIndex === -1) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    const updatedProperty = {
      ...mockProperties[propertyIndex],
      ...body,
      id,
    };

    mockProperties[propertyIndex] = updatedProperty;

    return NextResponse.json(updatedProperty);
  } catch (error) {
    console.error('Error in PUT /api/mock/properties/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const propertyIndex = mockProperties.findIndex(p => p.id === id);

    if (propertyIndex === -1) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    const deletedProperty = mockProperties[propertyIndex];
    mockProperties.splice(propertyIndex, 1);

    return NextResponse.json({
      message: 'Property deleted successfully',
      property: deletedProperty,
    });
  } catch (error) {
    console.error('Error in DELETE /api/mock/properties/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
