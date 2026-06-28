import { WishItem } from './types';

const KV_KEY = 'wishlist:items';
const localStore = new Map<string, WishItem[]>();

function isRedisAvailable(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function getRedis() {
  const { Redis } = await import('@upstash/redis');
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

export async function getAllItems(): Promise<WishItem[]> {
  if (isRedisAvailable()) {
    const redis = await getRedis();
    return (await redis.get<WishItem[]>(KV_KEY)) ?? [];
  }
  return localStore.get(KV_KEY) ?? [];
}

export async function saveAllItems(items: WishItem[]): Promise<void> {
  if (isRedisAvailable()) {
    const redis = await getRedis();
    await redis.set(KV_KEY, items);
    return;
  }
  localStore.set(KV_KEY, items);
}

export async function getItemById(id: string): Promise<WishItem | null> {
  return (await getAllItems()).find(i => i.id === id) ?? null;
}

export async function createItem(item: WishItem): Promise<WishItem> {
  const items = await getAllItems();
  items.push(item);
  await saveAllItems(items);
  return item;
}

export async function updateItem(updated: WishItem): Promise<WishItem | null> {
  const items = await getAllItems();
  const idx = items.findIndex(i => i.id === updated.id);
  if (idx === -1) return null;
  items[idx] = updated;
  await saveAllItems(items);
  return updated;
}

export async function deleteItem(id: string): Promise<boolean> {
  const items = await getAllItems();
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return false;
  items.splice(idx, 1);
  await saveAllItems(items);
  return true;
}
