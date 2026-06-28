import { NextRequest, NextResponse } from 'next/server';
import { getItemById, updateItem } from '@/lib/storage';

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { reservedBy } = body as { reservedBy?: string };

    const item = await getItemById(id);
    if (!item) {
      return NextResponse.json({ error: 'Element nie istnieje' }, { status: 404 });
    }
    if (item.reserved) {
      return NextResponse.json({ error: 'Element jest już zarezerwowany' }, { status: 409 });
    }

    const updated = await updateItem({
      ...item,
      reserved: true,
      reservedBy: reservedBy?.trim() || 'Anonim',
      reservedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ data: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Nie udało się zarezerwować' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const item = await getItemById(id);
    if (!item) {
      return NextResponse.json({ error: 'Element nie istnieje' }, { status: 404 });
    }

    const updated = await updateItem({
      ...item,
      reserved: false,
      reservedBy: undefined,
      reservedAt: undefined,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ data: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Nie udało się anulować rezerwacji' }, { status: 500 });
  }
}
