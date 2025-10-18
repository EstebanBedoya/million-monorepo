import { NextRequest, NextResponse } from 'next/server';
import propertyTracesData from '../../../../../../../../public/mock/property-traces.json';

let mockPropertyTraces = [...propertyTracesData];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; traceId: string }> }
) {
  try {
    const { id, traceId } = await params;
    const trace = mockPropertyTraces.find(
      t => t.idPropertyTrace === traceId && t.idProperty === id
    );

    if (!trace) {
      return NextResponse.json(
        { error: 'Trace not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(trace);
  } catch (error) {
    console.error('Error in GET /api/mock/properties/[id]/traces/[traceId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; traceId: string }> }
) {
  try {
    const { id, traceId } = await params;
    const body = await request.json();

    const traceIndex = mockPropertyTraces.findIndex(
      t => t.idPropertyTrace === traceId && t.idProperty === id
    );

    if (traceIndex === -1) {
      return NextResponse.json(
        { error: 'Trace not found' },
        { status: 404 }
      );
    }

    const updatedTrace = {
      ...mockPropertyTraces[traceIndex],
      ...body,
      idPropertyTrace: traceId,
      idProperty: id,
    };

    mockPropertyTraces[traceIndex] = updatedTrace;

    return NextResponse.json(updatedTrace);
  } catch (error) {
    console.error('Error in PUT /api/mock/properties/[id]/traces/[traceId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; traceId: string }> }
) {
  try {
    const { id, traceId } = await params;

    const traceIndex = mockPropertyTraces.findIndex(
      t => t.idPropertyTrace === traceId && t.idProperty === id
    );

    if (traceIndex === -1) {
      return NextResponse.json(
        { error: 'Trace not found' },
        { status: 404 }
      );
    }

    const deletedTrace = mockPropertyTraces[traceIndex];
    mockPropertyTraces.splice(traceIndex, 1);

    return NextResponse.json({
      message: 'Trace deleted successfully',
      trace: deletedTrace,
    });
  } catch (error) {
    console.error('Error in DELETE /api/mock/properties/[id]/traces/[traceId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

