import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getAllItems, createItem } from '@/lib/storage';
import { verifyOwnerPin } from '@/lib/auth';
import { CreateItemInput, WishItem } from '@/lib/types';

export async function GET() {
  try {
    const items = await getAllItems();
    // Sort: available first, then by creation date desc
    items.sort((a, b) => {
      if (a.reserved !== b.reserved) return a.reserved ? 1 : -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return NextResponse.json({ data: items });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Nie udało się pobrać listy' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pin, ...input } = body as CreateItemInput & { pin: string };

    if (!verifyOwnerPin(pin)) {
      return NextResponse.json({ error: 'Nieprawidłowy PIN' }, { status: 401 });
    }

    if (!input.name?.trim()) {
      return NextResponse.json({ error: 'Nazwa jest wymagana' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const newItem: WishItem = {
      id: uuidv4(),
      name: input.name.trim(),
      description: input.description?.trim() || undefined,
      link: input.link?.trim() || undefined,
      image: input.image?.trim() || undefined,
      category: input.category || undefined,
      reserved: false,
      createdAt: now,
      updatedAt: now,
    };

    const item = await createItem(newItem);
    return NextResponse.json({ data: item }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Nie udało się dodać elementu' }, { status: 500 });
  }
}
