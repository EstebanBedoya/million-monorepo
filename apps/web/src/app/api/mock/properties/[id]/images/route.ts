import { NextRequest, NextResponse } from 'next/server';
import propertyImagesData from '../../../../../../../public/mock/property-images.json';

let mockPropertyImages = [...propertyImagesData];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const enabledOnly = searchParams.get('enabledOnly') === 'true';

    let images = mockPropertyImages.filter(img => img.idProperty === id);

    if (enabledOnly) {
      images = images.filter(img => img.enabled);
    }

    return NextResponse.json({
      images,
      total: images.length,
    });
  } catch (error) {
    console.error('Error in GET /api/mock/properties/[id]/images:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.file) {
      return NextResponse.json(
        { error: 'Missing required field: file' },
        { status: 400 }
      );
    }

    const newImage = {
      idPropertyImage: `img-${Date.now()}`,
      idProperty: id,
      file: body.file,
      enabled: body.enabled !== undefined ? body.enabled : true,
    };

    mockPropertyImages.push(newImage);

    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/mock/properties/[id]/images:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

