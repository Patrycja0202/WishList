'use client';

import { useState } from 'react';
import { WishItem, Category } from '@/lib/types';

interface Props {
  item: WishItem;
  isOwner: boolean;
  onEdit?: (item: WishItem) => void;
  onDelete?: (id: string) => void;
  onReserve?: (id: string, name: string) => void;
  onCancelReserve?: (id: string) => void;
}

const CATEGORY_COLORS: Record<Category, string> = {
  'Ubranka': 'bg-pink-50 text-pink-700 border-pink-200',
  'Pielęgnacja': 'bg-blue-50 text-blue-700 border-blue-200',
  'Karmienie': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Sen': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Zabawki': 'bg-orange-50 text-orange-700 border-orange-200',
  'Wózek & Nosidło': 'bg-teal-50 text-teal-700 border-teal-200',
  'Bezpieczeństwo': 'bg-red-50 text-red-700 border-red-200',
  'Inne': 'bg-gray-50 text-gray-600 border-gray-200',
};

export default function ItemCard({ item, isOwner, onEdit, onDelete, onReserve, onCancelReserve }: Props) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [imgError, setImgError] = useState(false);

  const categoryClass = item.category ? CATEGORY_COLORS[item.category] : '';

  return (
    <div
      className={`relative rounded-2xl border transition-all duration-300 overflow-hidden ${
        item.reserved
          ? 'bg-[#F5EFE4] border-[#C8B49A] opacity-80'
          : 'bg-white border-[#EDE3D3] hover:shadow-lg hover:-translate-y-0.5'
      }`}
      style={{ boxShadow: item.reserved ? 'none' : '0 2px 12px rgba(92,64,51,0.07)' }}
    >
      {/* Reserved overlay ribbon */}
      {item.reserved && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wide bg-[#A0856C] text-white">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M5 0L6.12 3.44H9.76L6.83 5.57L7.94 9L5 6.88L2.06 9L3.17 5.57L0.24 3.44H3.88L5 0Z"/>
            </svg>
            Zarezerwowane
          </span>
        </div>
      )}

      {/* Image */}
      {item.image && !imgError && (
        <div className="relative w-full h-48 bg-[#FAF7F2] overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
          {item.reserved && (
            <div className="absolute inset-0 bg-[#EDE3D3]/40" />
          )}
        </div>
      )}

      <div className="p-5">
        {/* Category */}
        {item.category && (
          <div className="mb-2">
            <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full border font-medium ${categoryClass}`}>
              {item.category}
            </span>
          </div>
        )}

        {/* Name */}
        <h3 className={`text-lg font-semibold leading-snug mb-1 ${item.reserved ? 'text-[#7A6A5A] line-through decoration-[#A0856C]/50' : 'text-[#3A2E26]'}`}>
          {item.name}
        </h3>

        {/* Description */}
        {item.description && (
          <p className="text-sm text-[#7A6A5A] leading-relaxed mb-3">
            {item.description}
          </p>
        )}

        {/* Reserved by info */}
        {item.reserved && item.reservedBy && (
          <p className="text-xs text-[#A0856C] italic mb-3">
            Zarezerwowane przez: {item.reservedBy}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-[#EDE3D3]">
          {/* Link button */}
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#A0856C] hover:text-[#5C4033] transition-colors"
            >
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              Zobacz produkt
            </a>
          )}

          <div className="flex-1" />

          {/* Guest actions */}
          {!isOwner && (
            <>
              {!item.reserved && (
                <button
                  onClick={() => onReserve?.(item.id, item.name)}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-[#5C4033] text-white hover:bg-[#3A2E26] transition-colors active:scale-95"
                >
                  Rezerwuję 🎁
                </button>
              )}
              {item.reserved && !showCancelConfirm && (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#A0856C] border border-[#C8B49A] hover:border-[#A0856C] transition-colors"
                >
                  Anuluj moją rezerwację
                </button>
              )}
              {item.reserved && showCancelConfirm && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#7A6A5A]">Na pewno?</span>
                  <button
                    onClick={() => { onCancelReserve?.(item.id); setShowCancelConfirm(false); }}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#C8B49A] text-[#3A2E26] hover:bg-[#A0856C] hover:text-white transition-colors"
                  >
                    Tak, anuluj
                  </button>
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#7A6A5A] hover:text-[#3A2E26] transition-colors"
                  >
                    Nie
                  </button>
                </div>
              )}
            </>
          )}

          {/* Owner actions */}
          {isOwner && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onEdit?.(item)}
                className="p-2 rounded-lg text-[#A0856C] hover:text-[#5C4033] hover:bg-[#FAF7F2] transition-colors"
                title="Edytuj"
              >
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button
                onClick={() => onDelete?.(item.id)}
                className="p-2 rounded-lg text-[#C8B49A] hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Usuń"
              >
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
