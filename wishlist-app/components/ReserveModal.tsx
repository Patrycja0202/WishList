'use client';

import { useState } from 'react';

interface Props {
  itemName: string;
  onConfirm: (name: string) => Promise<void>;
  onClose: () => void;
}

export default function ReserveModal({ itemName, onConfirm, onClose }: Props) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      await onConfirm(name.trim() || 'Anonim');
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
        className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-[#EDE3D3]" />
        </div>

        <div className="p-6 sm:p-8">
          <div className="text-4xl mb-4 text-center">🎁</div>
          <h2 className="text-xl font-semibold text-[#3A2E26] text-center mb-2">
            Rezerwujesz:
          </h2>
          <p className="text-[#5C4033] text-center font-medium mb-6 text-lg leading-snug">
            {itemName}
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#5C4033] mb-1.5">
              Twoje imię (opcjonalne)
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="np. Ciocia Ania"
              autoFocus
              className="w-full px-4 py-3 rounded-xl border border-[#EDE3D3] bg-[#FAF7F2] text-[#3A2E26] placeholder-[#B0A090] focus:outline-none focus:border-[#A0856C] focus:ring-2 focus:ring-[#C8B49A]/30 transition text-sm"
              onKeyDown={e => e.key === 'Enter' && handleConfirm()}
            />
            <p className="mt-1.5 text-xs text-[#B0A090]">Imię pojawi się jako informacja dla właścicielki listy.</p>
          </div>

          {error && (
            <p className="mb-4 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-5 py-3 rounded-xl border border-[#EDE3D3] text-[#7A6A5A] text-sm font-medium hover:bg-[#FAF7F2] transition-colors"
            >
              Anuluj
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 px-5 py-3 rounded-xl bg-[#5C4033] text-white text-sm font-medium hover:bg-[#3A2E26] transition-colors disabled:opacity-60 active:scale-95"
            >
              {loading ? 'Rezerwuję…' : 'Potwierdzam'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
