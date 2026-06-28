'use client';

import { useState } from 'react';

interface Props {
  onSuccess: () => void;
  onClose: () => void;
}

export default function PinModal({ onSuccess, onClose }: Props) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!pin.trim()) { setError('Wpisz PIN'); return; }
    setLoading(true);
    setError('');
    try {
      // Verify PIN by trying a protected endpoint
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, name: '__ping__' }),
      });
      if (res.status === 401) {
        setError('Nieprawidłowy PIN');
        setLoading(false);
        return;
      }
      // Delete the test item if accidentally created (it won't be with invalid name check)
      // PIN is correct – store in sessionStorage
      sessionStorage.setItem('owner_pin', pin);
      onSuccess();
    } catch {
      setError('Błąd połączenia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[#3A2E26]/30 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="text-3xl mb-4 text-center">🔑</div>
          <h2 className="text-xl font-semibold text-[#3A2E26] text-center mb-2">Panel właścicielki</h2>
          <p className="text-sm text-[#7A6A5A] text-center mb-6">Wpisz PIN, aby zarządzać listą</p>

          <input
            type="password"
            value={pin}
            onChange={e => setPin(e.target.value)}
            placeholder="••••"
            autoFocus
            className="w-full px-4 py-3 rounded-xl border border-[#EDE3D3] bg-[#FAF7F2] text-[#3A2E26] text-center text-xl tracking-widest placeholder-[#B0A090] focus:outline-none focus:border-[#A0856C] focus:ring-2 focus:ring-[#C8B49A]/30 transition mb-3"
            onKeyDown={e => e.key === 'Enter' && handleVerify()}
          />

          {error && (
            <p className="mb-3 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-xl text-center">{error}</p>
          )}

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-[#EDE3D3] text-[#7A6A5A] text-sm font-medium hover:bg-[#FAF7F2] transition-colors">
              Anuluj
            </button>
            <button onClick={handleVerify} disabled={loading} className="flex-1 px-4 py-3 rounded-xl bg-[#5C4033] text-white text-sm font-medium hover:bg-[#3A2E26] transition-colors disabled:opacity-60">
              {loading ? '…' : 'Wejdź'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
