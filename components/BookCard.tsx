'use client';

import Link from 'next/link';
import { Book } from '@/types';
import { Star, ShoppingCart, Check } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { useState } from 'react';

interface BookCardProps {
  book: Book;
  compact?: boolean;
}

export default function BookCard({ book, compact = false }: BookCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discountedPrice = (book.price * (1 - (book.discountPercent || 0) / 100)).toFixed(2);

  return (
    <div className="group bg-white dark:bg-[#161b22] rounded-xl border border-slate-200 dark:border-[#30363d] overflow-hidden shadow-sm hover:shadow-md dark:hover:shadow-black/40 hover:border-slate-300 dark:hover:border-[#8b949e]/40 transition-all flex flex-col h-full">
      <Link href={`/books/${book.id}`} className="relative aspect-[4/3] bg-slate-100 dark:bg-[#0d1117] overflow-hidden block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        {book.discountPercent > 0 && (
          <span className="absolute top-2 right-2 bg-rose-500 dark:bg-rose-500/90 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
            {book.discountPercent}% OFF
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1 text-amber-500 text-xs font-medium mb-1">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{book.rating}</span>
          <span className="text-slate-400 dark:text-[#8b949e]">({book.reviewCount})</span>
        </div>

        <Link href={`/books/${book.id}`}>
          <h3 className="font-semibold text-slate-900 dark:text-[#e6edf3] line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition text-sm sm:text-base">
            {book.title}
          </h3>
        </Link>
        <p className="text-xs text-slate-500 dark:text-[#8b949e] mb-2">{book.author}</p>

        {!compact && (
          <p className="text-xs text-slate-600 dark:text-[#8b949e] line-clamp-2 mb-4 flex-1">
            {book.description}
          </p>
        )}

        <div className="mt-auto pt-3 border-t border-slate-100 dark:border-[#30363d] flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-slate-900 dark:text-[#e6edf3]">${discountedPrice}</span>
              {book.discountPercent > 0 && (
                <span className="text-xs text-slate-400 dark:text-[#8b949e] line-through">${book.price.toFixed(2)}</span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 dark:text-[#8b949e] uppercase tracking-wider">{book.format}</span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`p-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              added
                ? 'bg-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border dark:border-emerald-500/30 text-white'
                : 'bg-teal-600 hover:bg-teal-700 dark:bg-teal-500/15 dark:hover:bg-teal-500/25 dark:text-teal-400 dark:border dark:border-teal-500/20 text-white'
            }`}
            title="Add to basket"
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            <span className="hidden sm:inline">{added ? 'Added' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
