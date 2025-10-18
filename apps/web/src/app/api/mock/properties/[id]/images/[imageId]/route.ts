import { NextRequest, NextResponse } from 'next/server';
import propertyImagesData from '../../../../../../../../public/mock/property-images.json';

let mockPropertyImages = [...propertyImagesData];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { id, imageId } = await params;
    const image = mockPropertyImages.find(
      img => img.idPropertyImage === imageId && img.idProperty === id
    );

    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(image);
  } catch (error) {
    console.error('Error in GET /api/mock/properties/[id]/images/[imageId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { id, imageId } = await params;
    const body = await request.json();

    const imageIndex = mockPropertyImages.findIndex(
      img => img.idPropertyImage === imageId && img.idProperty === id
    );

    if (imageIndex === -1) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    const updatedImage = {
      ...mockPropertyImages[imageIndex],
      ...body,
      idPropertyImage: imageId,
      idProperty: id,
    };

    mockPropertyImages[imageIndex] = updatedImage;

    return NextResponse.json(updatedImage);
  } catch (error) {
    console.error('Error in PUT /api/mock/properties/[id]/images/[imageId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { id, imageId } = await params;

    const imageIndex = mockPropertyImages.findIndex(
      img => img.idPropertyImage === imageId && img.idProperty === id
    );

    if (imageIndex === -1) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    const deletedImage = mockPropertyImages[imageIndex];
    mockPropertyImages.splice(imageIndex, 1);

    return NextResponse.json({
      message: 'Image deleted successfully',
      image: deletedImage,
    });
  } catch (error) {
    console.error('Error in DELETE /api/mock/properties/[id]/images/[imageId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

