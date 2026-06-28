import { NextRequest, NextResponse } from 'next/server';
import { getItemById, updateItem, deleteItem } from '@/lib/storage';
import { verifyOwnerPin } from '@/lib/auth';
import { UpdateItemInput } from '@/lib/types';

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { pin, ...input } = body as UpdateItemInput & { pin: string };

    if (!verifyOwnerPin(pin)) {
      return NextResponse.json({ error: 'Nieprawidłowy PIN' }, { status: 401 });
    }

    const existing = await getItemById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Element nie istnieje' }, { status: 404 });
    }

    if (!input.name?.trim()) {
      return NextResponse.json({ error: 'Nazwa jest wymagana' }, { status: 400 });
    }

    const updated = await updateItem({
      ...existing,
      name: input.name.trim(),
      description: input.description?.trim() || undefined,
      link: input.link?.trim() || undefined,
      image: input.image?.trim() || undefined,
      category: input.category || undefined,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ data: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Nie udało się zaktualizować' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { pin } = body as { pin: string };

    if (!verifyOwnerPin(pin)) {
      return NextResponse.json({ error: 'Nieprawidłowy PIN' }, { status: 401 });
    }

    const success = await deleteItem(id);
    if (!success) {
      return NextResponse.json({ error: 'Element nie istnieje' }, { status: 404 });
    }

    return NextResponse.json({ data: { deleted: true } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Nie udało się usunąć' }, { status: 500 });
  }
}
