import { NextRequest, NextResponse } from 'next/server';
import ownersData from '../../../../../public/mock/owners.json';

let mockOwners = [...ownersData];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    let filteredOwners = mockOwners;
    
    if (search) {
      filteredOwners = filteredOwners.filter(owner =>
        owner.name.toLowerCase().includes(search.toLowerCase()) ||
        owner.address.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = filteredOwners.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOwners = filteredOwners.slice(startIndex, endIndex);

    return NextResponse.json({
      owners: paginatedOwners,
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
    console.error('Error in GET /api/mock/owners:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.address || !body.birthday) {
      return NextResponse.json(
        { error: 'Missing required fields: name, address, birthday' },
        { status: 400 }
      );
    }

    const newOwner = {
      idOwner: `owner-${Date.now()}`,
      name: body.name,
      address: body.address,
      photo: body.photo || 'https://i.pravatar.cc/150?img=1',
      birthday: body.birthday,
    };

    mockOwners.push(newOwner);

    return NextResponse.json(newOwner, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/mock/owners:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

