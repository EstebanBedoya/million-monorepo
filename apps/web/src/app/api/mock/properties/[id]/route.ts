import { NextRequest, NextResponse } from 'next/server';
import { MockPropertySchema } from '../../../../../domain/schemas/property.schema';
import propertiesData from '../../../../../../public/mock/properties.json';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = propertiesData.find(p => p.id === id);

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Validate response data with Zod
    const validatedProperty = MockPropertySchema.parse(property);

    return NextResponse.json(validatedProperty);
  } catch (error) {
    console.error('Error in /api/mock/properties/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
