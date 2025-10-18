import { NextRequest, NextResponse } from 'next/server';
import propertyTracesData from '../../../../../../../public/mock/property-traces.json';

let mockPropertyTraces = [...propertyTracesData];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy') || 'dateSale';
    const order = searchParams.get('order') || 'desc';

    let traces = mockPropertyTraces.filter(trace => trace.idProperty === id);

    traces.sort((a, b) => {
      const aValue = sortBy === 'dateSale' ? new Date(a.dateSale).getTime() : a.value;
      const bValue = sortBy === 'dateSale' ? new Date(b.dateSale).getTime() : b.value;
      
      return order === 'desc' ? bValue - aValue : aValue - bValue;
    });

    return NextResponse.json({
      traces,
      total: traces.length,
    });
  } catch (error) {
    console.error('Error in GET /api/mock/properties/[id]/traces:', error);
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

    if (!body.dateSale || !body.name || body.value === undefined || body.tax === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: dateSale, name, value, tax' },
        { status: 400 }
      );
    }

    const newTrace = {
      idPropertyTrace: `trace-${Date.now()}`,
      idProperty: id,
      dateSale: body.dateSale,
      name: body.name,
      value: body.value,
      tax: body.tax,
    };

    mockPropertyTraces.push(newTrace);

    return NextResponse.json(newTrace, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/mock/properties/[id]/traces:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

