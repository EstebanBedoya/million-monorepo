import { NextRequest, NextResponse } from 'next/server';
import ownersData from '../../../../../../public/mock/owners.json';
import propertiesData from '../../../../../../public/mock/properties.json';

let mockOwners = [...ownersData];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const owner = mockOwners.find(o => o.idOwner === id);

    if (!owner) {
      return NextResponse.json(
        { error: 'Owner not found' },
        { status: 404 }
      );
    }

    const ownerProperties = propertiesData.filter(p => p.idOwner === id);

    return NextResponse.json({
      ...owner,
      properties: ownerProperties,
    });
  } catch (error) {
    console.error('Error in GET /api/mock/owners/[id]:', error);
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

    const ownerIndex = mockOwners.findIndex(o => o.idOwner === id);

    if (ownerIndex === -1) {
      return NextResponse.json(
        { error: 'Owner not found' },
        { status: 404 }
      );
    }

    const updatedOwner = {
      ...mockOwners[ownerIndex],
      ...body,
      idOwner: id,
    };

    mockOwners[ownerIndex] = updatedOwner;

    return NextResponse.json(updatedOwner);
  } catch (error) {
    console.error('Error in PUT /api/mock/owners/[id]:', error);
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

    const ownerIndex = mockOwners.findIndex(o => o.idOwner === id);

    if (ownerIndex === -1) {
      return NextResponse.json(
        { error: 'Owner not found' },
        { status: 404 }
      );
    }

    const ownerProperties = propertiesData.filter(p => p.idOwner === id);
    
    if (ownerProperties.length > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete owner with associated properties',
          propertiesCount: ownerProperties.length 
        },
        { status: 409 }
      );
    }

    const deletedOwner = mockOwners[ownerIndex];
    mockOwners.splice(ownerIndex, 1);

    return NextResponse.json({
      message: 'Owner deleted successfully',
      owner: deletedOwner,
    });
  } catch (error) {
    console.error('Error in DELETE /api/mock/owners/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

