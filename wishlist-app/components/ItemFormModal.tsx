'use client';

import { useState, useEffect } from 'react';
import { WishItem, Category, CreateItemInput } from '@/lib/types';

const CATEGORIES: Category[] = [
  'Ubranka', 'Pielęgnacja', 'Karmienie', 'Sen',
  'Zabawki', 'Wózek & Nosidło', 'Bezpieczeństwo', 'Inne'
];

interface Props {
  item?: WishItem | null;
  onSave: (data: CreateItemInput) => Promise<void>;
  onClose: () => void;
}

export default function ItemFormModal({ item, onSave, onClose }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description ?? '');
      setLink(item.link ?? '');
      setImage(item.image ?? '');
      setCategory(item.category ?? '');
    }
  }, [item]);

  const handleSubmit = async () => {
    if (!name.trim()) { setError('Nazwa jest wymagana'); return; }
    setLoading(true);
    setError('');
    try {
      await onSave({
        name: name.trim(),
        description: description.trim() || undefined,
        link: link.trim() || undefined,
        image: image.trim() || undefined,
        category: category || undefined,
      });
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Coś poszło nie tak');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[#3A2E26]/30 backdrop-blur-sm" />
      <div
        className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-y-auto max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle bar for mobile */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-[#EDE3D3]" />
        </div>

        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-[#3A2E26] mb-6">
            {item ? 'Edytuj pozycję' : 'Dodaj nową pozycję'}
          </h2>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#5C4033] mb-1.5">
                Nazwa <span className="text-[#C8B49A]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="np. Śpioch polarowy 62 cm"
                className="w-full px-4 py-3 rounded-xl border border-[#EDE3D3] bg-[#FAF7F2] text-[#3A2E26] placeholder-[#B0A090] focus:outline-none focus:border-[#A0856C] focus:ring-2 focus:ring-[#C8B49A]/30 transition text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#5C4033] mb-1.5">Opis</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Rozmiar, kolor, preferencje..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-[#EDE3D3] bg-[#FAF7F2] text-[#3A2E26] placeholder-[#B0A090] focus:outline-none focus:border-[#A0856C] focus:ring-2 focus:ring-[#C8B49A]/30 transition text-sm resize-none"
              />
            </div>

            {/* Link */}
            <div>
              <label className="block text-sm font-medium text-[#5C4033] mb-1.5">Link do produktu</label>
              <input
                type="url"
                value={link}
                onChange={e => setLink(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl border border-[#EDE3D3] bg-[#FAF7F2] text-[#3A2E26] placeholder-[#B0A090] focus:outline-none focus:border-[#A0856C] focus:ring-2 focus:ring-[#C8B49A]/30 transition text-sm"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-[#5C4033] mb-1.5">URL zdjęcia (opcjonalne)</label>
              <input
                type="url"
                value={image}
                onChange={e => setImage(e.target.value)}
                placeholder="https://... (link do zdjęcia produktu)"
                className="w-full px-4 py-3 rounded-xl border border-[#EDE3D3] bg-[#FAF7F2] text-[#3A2E26] placeholder-[#B0A090] focus:outline-none focus:border-[#A0856C] focus:ring-2 focus:ring-[#C8B49A]/30 transition text-sm"
              />
              {image && (
                <div className="mt-2 w-full h-28 rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#EDE3D3]">
                  <img src={image} alt="Podgląd" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-[#5C4033] mb-1.5">Kategoria</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Category | '')}
                className="w-full px-4 py-3 rounded-xl border border-[#EDE3D3] bg-[#FAF7F2] text-[#3A2E26] focus:outline-none focus:border-[#A0856C] focus:ring-2 focus:ring-[#C8B49A]/30 transition text-sm appearance-none cursor-pointer"
              >
                <option value="">— Brak kategorii —</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-5 py-3 rounded-xl border border-[#EDE3D3] text-[#7A6A5A] text-sm font-medium hover:bg-[#FAF7F2] transition-colors"
            >
              Anuluj
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-5 py-3 rounded-xl bg-[#5C4033] text-white text-sm font-medium hover:bg-[#3A2E26] transition-colors disabled:opacity-60 active:scale-95"
            >
              {loading ? 'Zapisuję…' : item ? 'Zapisz zmiany' : 'Dodaj do listy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
