'use client';

import { useState, useEffect, useCallback } from 'react';
import ItemCard from '@/components/ItemCard';
import ItemFormModal from '@/components/ItemFormModal';
import ReserveModal from '@/components/ReserveModal';
import PinModal from '@/components/PinModal';
import { WishItem, Category, CreateItemInput } from '@/lib/types';

const CATEGORIES: (Category | 'Wszystkie')[] = [
  'Wszystkie', 'Ubranka', 'Pielęgnacja', 'Karmienie', 'Sen',
  'Zabawki', 'Wózek & Nosidło', 'Bezpieczeństwo', 'Inne'
];

export default function Home() {
  const [items, setItems] = useState<WishItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<WishItem | null>(null);
  const [reservingItem, setReservingItem] = useState<{ id: string; name: string } | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | 'Wszystkie'>('Wszystkie');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadItems = useCallback(async () => {
    try {
      const res = await fetch('/api/items');
      const json = await res.json();
      setItems(json.data ?? []);
    } catch {
      showToast('Nie udało się załadować listy', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
    // Restore owner session
    const saved = sessionStorage.getItem('owner_pin');
    if (saved) setIsOwner(true);
  }, [loadItems]);

  const getPin = () => sessionStorage.getItem('owner_pin') ?? '';

  // ─── Owner actions ────────────────────────────────────────────
  const handleSaveItem = async (data: CreateItemInput) => {
    const pin = getPin();
    if (editingItem) {
      const res = await fetch(`/api/items/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, pin }),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error);
      }
    } else {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, pin }),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error);
      }
    }
    showToast(editingItem ? 'Zaktualizowano ✓' : 'Dodano do listy ✓');
    setEditingItem(null);
    await loadItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Usunąć tę pozycję?')) return;
    const res = await fetch(`/api/items/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: getPin() }),
    });
    if (res.ok) {
      showToast('Usunięto pozycję');
      await loadItems();
    } else {
      showToast('Błąd usuwania', 'error');
    }
  };

  // ─── Guest actions ────────────────────────────────────────────
  const handleReserve = async (name: string) => {
    if (!reservingItem) return;
    const res = await fetch(`/api/items/${reservingItem.id}/reserve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reservedBy: name }),
    });
    if (!res.ok) {
      const j = await res.json();
      throw new Error(j.error);
    }
    showToast('Zarezerwowano! Dziękujemy 🎁');
    setReservingItem(null);
    await loadItems();
  };

  const handleCancelReserve = async (id: string) => {
    const res = await fetch(`/api/items/${id}/reserve`, { method: 'DELETE' });
    if (res.ok) {
      showToast('Rezerwacja anulowana');
      await loadItems();
    } else {
      showToast('Błąd anulowania', 'error');
    }
  };

  // ─── Filter ───────────────────────────────────────────────────
  const filtered = activeCategory === 'Wszystkie'
    ? items
    : items.filter(i => i.category === activeCategory);

  const available = filtered.filter(i => !i.reserved).length;
  const reserved = filtered.filter(i => i.reserved).length;

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      {/* ── HERO ── */}
      <header className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #F5EFE4 0%, #EDE3D3 50%, #E0D0BC 100%)' }}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, #C8B49A 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, #A0856C 0%, transparent 50%)`
        }} />
        <div className="relative max-w-4xl mx-auto px-5 py-14 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 text-[#A0856C] text-sm tracking-widest uppercase mb-4 font-medium">
            <span>✦</span>
            <span>Lista wyprawkowa</span>
            <span>✦</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#3A2E26] mb-4 leading-tight">
            Nasza wyprawa
            <br />
            <em className="font-normal" style={{ fontStyle: 'italic' }}>na powitanie</em>
          </h1>
          <p className="text-[#7A6A5A] text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
            Mamy się tu niedługo spotkamy z nowym członkiem rodziny.
            Jeśli chcesz nas obdarować, wybierz coś z listy i zarezerwuj — unikniesz dubletów.
          </p>

          {/* Stats */}
          {!loading && (
            <div className="mt-8 inline-flex items-center gap-6 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/80">
              <div className="text-center">
                <div className="text-2xl font-semibold text-[#3A2E26]">{items.length}</div>
                <div className="text-xs text-[#A0856C] tracking-wide">na liście</div>
              </div>
              <div className="w-px h-8 bg-[#EDE3D3]" />
              <div className="text-center">
                <div className="text-2xl font-semibold text-[#5C4033]">{available}</div>
                <div className="text-xs text-[#A0856C] tracking-wide">dostępne</div>
              </div>
              <div className="w-px h-8 bg-[#EDE3D3]" />
              <div className="text-center">
                <div className="text-2xl font-semibold text-[#A0856C]">{reserved}</div>
                <div className="text-xs text-[#A0856C] tracking-wide">zarezerwowane</div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── CONTROLS ── */}
      <div className="sticky top-0 z-20 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EDE3D3]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Category filter – scrollable */}
          <div className="flex gap-2 overflow-x-auto flex-1 scrollbar-hide pb-0.5" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as typeof activeCategory)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-[#5C4033] text-white'
                    : 'bg-white text-[#7A6A5A] border border-[#EDE3D3] hover:border-[#C8B49A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Owner toggle */}
          {!isOwner ? (
            <button
              onClick={() => setShowPinModal(true)}
              className="shrink-0 p-2 rounded-xl text-[#B0A090] hover:text-[#5C4033] hover:bg-[#EDE3D3] transition-colors"
              title="Panel właścicielki"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </button>
          ) : (
            <div className="shrink-0 flex items-center gap-2">
              <button
                onClick={() => { setEditingItem(null); setShowItemForm(true); }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5C4033] text-white text-xs font-medium hover:bg-[#3A2E26] transition-colors"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Dodaj
              </button>
              <button
                onClick={() => { sessionStorage.removeItem('owner_pin'); setIsOwner(false); }}
                className="p-2 rounded-xl text-[#B0A090] hover:text-[#5C4033] hover:bg-[#EDE3D3] transition-colors"
                title="Wyloguj"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-52 rounded-2xl bg-[#EDE3D3] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🌸</div>
            <p className="text-[#A0856C] text-lg">
              {items.length === 0
                ? 'Lista jest jeszcze pusta.'
                : 'Brak pozycji w tej kategorii.'}
            </p>
            {isOwner && items.length === 0 && (
              <button
                onClick={() => { setEditingItem(null); setShowItemForm(true); }}
                className="mt-6 px-6 py-3 rounded-xl bg-[#5C4033] text-white text-sm font-medium hover:bg-[#3A2E26] transition-colors"
              >
                Dodaj pierwszą pozycję
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                isOwner={isOwner}
                onEdit={i => { setEditingItem(i); setShowItemForm(true); }}
                onDelete={handleDelete}
                onReserve={(id, name) => setReservingItem({ id, name })}
                onCancelReserve={handleCancelReserve}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#EDE3D3] mt-12 py-8 text-center">
        <p className="text-[#B0A090] text-xs">Stworzone z ♡ na powitanie nowego życia</p>
      </footer>

      {/* ── MODALS ── */}
      {showPinModal && (
        <PinModal
          onSuccess={() => { setIsOwner(true); setShowPinModal(false); }}
          onClose={() => setShowPinModal(false)}
        />
      )}
      {showItemForm && (
        <ItemFormModal
          item={editingItem}
          onSave={handleSaveItem}
          onClose={() => { setShowItemForm(false); setEditingItem(null); }}
        />
      )}
      {reservingItem && (
        <ReserveModal
          itemName={reservingItem.name}
          onConfirm={handleReserve}
          onClose={() => setReservingItem(null)}
        />
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-medium shadow-lg transition-all ${
          toast.type === 'success'
            ? 'bg-[#3A2E26] text-white'
            : 'bg-red-600 text-white'
        }`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
