'use client';

import { mockBooks } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import BookCard from '@/components/BookCard';
import { Star, ShieldCheck, ShoppingCart, ArrowLeft, BookOpen, Layers, Check } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/useCartStore';
import { useState } from 'react';

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const book = mockBooks.find((b) => b.id === params.id || b.slug === params.id);
  const addToCart = useCartStore((state) => state.addToCart);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!book) {
    notFound();
  }

  const relatedBooks = mockBooks
    .filter((b) => b.id !== book.id && (b.categoryId === book.categoryId || b.brandId === book.brandId))
    .slice(0, 4);

  const discountedPrice = (book.price * (1 - (book.discountPercent || 0) / 100)).toFixed(2);

  const handleAddToCart = () => {
    addToCart(book, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-12">
      {/* Back button */}
      <Link
        href="/catalogue"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#8b949e] hover:text-teal-600 dark:hover:text-teal-400 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Catalogue
      </Link>

      {/* Product Detail Card */}
      <div className="bg-white dark:bg-[#161b22] rounded-3xl border border-slate-200 dark:border-[#30363d] p-6 sm:p-10 shadow-sm dark:shadow-black/30 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Cover Image */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-lg dark:shadow-black/50 border border-slate-100 dark:border-[#30363d]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 dark:text-[#8b949e]">
            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Official digital edition • DRM Protected</span>
          </div>
        </div>

        {/* Details & Purchase */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-500 text-sm font-medium">
              <Star className="w-4 h-4 fill-current" />
              <span>{book.rating}</span>
              <span className="text-slate-400 dark:text-[#8b949e]">({book.reviewCount} customer reviews)</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#e6edf3] tracking-tight">
              {book.title}
            </h1>
            <p className="text-sm font-medium text-slate-600 dark:text-[#8b949e]">
              By <span className="text-teal-700 dark:text-teal-400 font-semibold">{book.author}</span>
            </p>

            <div className="py-3 border-y border-slate-100 dark:border-[#30363d] flex items-center gap-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-[#e6edf3]">${discountedPrice}</span>
                  {book.discountPercent > 0 && (
                    <span className="text-sm text-slate-400 dark:text-[#8b949e] line-through">${book.price.toFixed(2)}</span>
                  )}
                </div>
                {book.discountPercent > 0 && (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Save {book.discountPercent}% today
                  </span>
                )}
              </div>

              <div className="h-8 w-px bg-slate-200 dark:bg-[#30363d]" />

              <div className="text-xs text-slate-500 dark:text-[#8b949e] space-y-0.5">
                <div>Format: <strong className="text-slate-800 dark:text-[#c9d1d9]">{book.format}</strong></div>
                <div>Language: <strong className="text-slate-800 dark:text-[#c9d1d9]">{book.language}</strong></div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-[#e6edf3] uppercase tracking-wider">Overview</h4>
              <p className="text-sm text-slate-600 dark:text-[#8b949e] leading-relaxed">{book.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-50 dark:bg-[#0d1117] rounded-xl border border-slate-100 dark:border-[#30363d] flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="text-xs text-slate-700 dark:text-[#8b949e]">ISBN: <span className="font-mono font-semibold dark:text-[#c9d1d9]">{book.isbn}</span></span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-[#0d1117] rounded-xl border border-slate-100 dark:border-[#30363d] flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="text-xs text-slate-700 dark:text-[#8b949e]">Pages: <span className="font-semibold dark:text-[#c9d1d9]">{book.pages || 450}</span></span>
              </div>
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="pt-6 border-t border-slate-100 dark:border-[#30363d] flex flex-wrap items-center gap-4">
            <div className="flex items-center border border-slate-200 dark:border-[#30363d] rounded-xl bg-slate-50 dark:bg-[#0d1117] p-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-white dark:bg-[#1c2330] shadow-xs font-bold text-slate-700 dark:text-[#c9d1d9] hover:bg-slate-100 dark:hover:bg-[#30363d] transition"
              >
                -
              </button>
              <span className="w-10 text-center font-bold text-sm text-slate-800 dark:text-[#e6edf3]">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-lg bg-white dark:bg-[#1c2330] shadow-xs font-bold text-slate-700 dark:text-[#c9d1d9] hover:bg-slate-100 dark:hover:bg-[#30363d] transition"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
                added
                  ? 'bg-emerald-600 dark:bg-emerald-500/20 dark:border dark:border-emerald-500/30 dark:text-emerald-400 text-white shadow-lg shadow-emerald-600/20 dark:shadow-none'
                  : 'bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white shadow-lg shadow-teal-600/25 dark:shadow-teal-500/20'
              }`}
            >
              {added ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
              <span>{added ? 'Added to Cart!' : `Add to Basket • $${(Number(discountedPrice) * quantity).toFixed(2)}`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedBooks.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-[#e6edf3]">Related Recommendations</h2>
            <p className="text-xs text-slate-500 dark:text-[#8b949e]">Readers who explored this title also purchased</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedBooks.map((relBook) => (
              <BookCard key={relBook.id} book={relBook} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
