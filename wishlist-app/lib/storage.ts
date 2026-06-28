/**
 * Storage abstraction layer.
 * Uses Vercel KV in production, in-memory Map for local dev.
 */

import { WishItem } from './types';

const KV_KEY = 'wishlist:items';

// In-memory fallback for local development
const localStore = new Map<string, WishItem[]>();

function isKVAvailable(): boolean {
  return !!(
    process.env.KV_REST_API_URL &&
    process.env.KV_REST_API_TOKEN
  );
}

export async function getAllItems(): Promise<WishItem[]> {
  if (isKVAvailable()) {
    const { kv } = await import('@vercel/kv');
    const items = await kv.get<WishItem[]>(KV_KEY);
    return items ?? [];
  }
  return localStore.get(KV_KEY) ?? [];
}

export async function saveAllItems(items: WishItem[]): Promise<void> {
  if (isKVAvailable()) {
    const { kv } = await import('@vercel/kv');
    await kv.set(KV_KEY, items);
    return;
  }
  localStore.set(KV_KEY, items);
}

export async function getItemById(id: string): Promise<WishItem | null> {
  const items = await getAllItems();
  return items.find(item => item.id === id) ?? null;
}

export async function createItem(item: WishItem): Promise<WishItem> {
  const items = await getAllItems();
  items.push(item);
  await saveAllItems(items);
  return item;
}

export async function updateItem(updated: WishItem): Promise<WishItem | null> {
  const items = await getAllItems();
  const index = items.findIndex(item => item.id === updated.id);
  if (index === -1) return null;
  items[index] = updated;
  await saveAllItems(items);
  return updated;
}

export async function deleteItem(id: string): Promise<boolean> {
  const items = await getAllItems();
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return false;
  items.splice(index, 1);
  await saveAllItems(items);
  return true;
}
