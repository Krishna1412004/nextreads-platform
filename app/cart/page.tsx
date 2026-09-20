'use client';

import { useCartStore } from '@/lib/store/useCartStore';
import { mockBooks } from '@/lib/mock-data';
import Link from 'next/link';
import { Trash2, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import BookCard from '@/components/BookCard';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getSubtotal, getTotalDiscount, getFinalTotal } = useCartStore();

  const subtotal = getSubtotal();
  const discount = getTotalDiscount();
  const finalTotal = getFinalTotal();

  const historyRecommendations = mockBooks
    .filter((b) => !items.some((i) => i.bookId === b.id))
    .slice(0, 3);

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#30363d] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-[#e6edf3]">Your Shopping Basket</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#8b949e] mt-1">Review your selected e-books before proceeding to secure checkout.</p>
        </div>
        <Link href="/catalogue" className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hidden sm:inline">
          Continue Shopping
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-slate-200 dark:border-[#30363d] p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-slate-100 dark:bg-[#1c2330] rounded-full flex items-center justify-center mx-auto text-slate-400 dark:text-[#8b949e]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-[#e6edf3]">Your basket is empty</h3>
          <p className="text-xs text-slate-500 dark:text-[#8b949e] max-w-sm mx-auto">
            Explore our curated catalogue of engineering, cloud, and AI books to get started.
          </p>
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500/15 dark:hover:bg-teal-500/25 dark:border dark:border-teal-500/30 dark:text-teal-400 text-white font-semibold rounded-xl text-xs transition"
          >
            Explore Catalogue <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-4">
            {items.map(({ book, quantity }) => {
              const discountedPrice = (book.price * (1 - (book.discountPercent || 0) / 100));
              const itemTotal = (discountedPrice * quantity).toFixed(2);

              return (
                <div key={book.id} className="bg-white dark:bg-[#161b22] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-[#30363d] shadow-sm flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={book.coverImage} alt={book.title} className="w-16 h-22 object-cover rounded-lg border border-slate-100 dark:border-[#30363d]" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-[#e6edf3] text-sm truncate">{book.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-[#8b949e]">{book.author}</p>
                    <div className="text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase mt-1">{book.format}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-[#e6edf3]">${discountedPrice.toFixed(2)}</span>
                      {book.discountPercent > 0 && (
                        <span className="text-xs text-slate-400 dark:text-[#8b949e] line-through">${book.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center border border-slate-200 dark:border-[#30363d] rounded-lg bg-slate-50 dark:bg-[#0d1117] p-0.5">
                    <button onClick={() => updateQuantity(book.id, quantity - 1)} className="w-6 h-6 rounded bg-white dark:bg-[#1c2330] shadow-xs font-bold text-slate-700 dark:text-[#c9d1d9] hover:bg-slate-100 dark:hover:bg-[#30363d] text-xs transition">-</button>
                    <span className="w-8 text-center font-bold text-xs text-slate-800 dark:text-[#e6edf3]">{quantity}</span>
                    <button onClick={() => updateQuantity(book.id, quantity + 1)} className="w-6 h-6 rounded bg-white dark:bg-[#1c2330] shadow-xs font-bold text-slate-700 dark:text-[#c9d1d9] hover:bg-slate-100 dark:hover:bg-[#30363d] text-xs transition">+</button>
                  </div>

                  {/* Total & Remove */}
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-900 dark:text-[#e6edf3]">${itemTotal}</div>
                    <button onClick={() => removeFromCart(book.id)} className="mt-2 text-rose-500 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 p-1 transition" title="Remove item">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-[#161b22] p-6 rounded-2xl border border-slate-200 dark:border-[#30363d] shadow-sm space-y-5 sticky top-24">
              <h3 className="text-base font-bold text-slate-900 dark:text-[#e6edf3]">Order Summary</h3>
              <div className="space-y-3 text-xs text-slate-600 dark:text-[#8b949e]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800 dark:text-[#c9d1d9]">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Catalogue Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500 dark:text-[#8b949e]">
                  <span>Digital Delivery / Tax</span>
                  <span>FREE</span>
                </div>
                <div className="pt-3 border-t border-slate-200 dark:border-[#30363d] flex justify-between text-base font-extrabold text-slate-900 dark:text-[#e6edf3]">
                  <span>Estimated Total</span>
                  <span className="text-teal-700 dark:text-teal-400">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500/15 dark:hover:bg-teal-500/25 dark:border dark:border-teal-500/30 dark:text-teal-400 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20 dark:shadow-none transition"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-[#30363d]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500 dark:text-amber-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-[#e6edf3]">Recommended for you</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {historyRecommendations.map((book) => (
            <BookCard key={book.id} book={book} compact />
          ))}
        </div>
      </section>
    </div>
  );
}
