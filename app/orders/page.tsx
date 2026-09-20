'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store/useCartStore';
import { Package, RotateCw, Check, Calendar, CreditCard, ArrowRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Order } from '@/types';

export default function OrdersPage() {
  const addToCart = useCartStore((state) => state.addToCart);
  const [reorderedBookId, setReorderedBookId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' });
      const data = await res.json();
      setOrders(data);
    } catch {
      // silently fail — orders stay empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleBuyAgain = (book: any) => {
    addToCart(book, 1);
    setReorderedBookId(book.id);
    setTimeout(() => setReorderedBookId(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-[#e6edf3]">Order History</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#8b949e] mt-1">
            Review previous purchases, download eBooks, and use the{' '}
            <strong className="text-teal-700 dark:text-teal-400">Buy It Again</strong> feature.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#8b949e] hover:text-teal-600 dark:hover:text-teal-400 transition"
          title="Refresh orders"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-[#161b22] rounded-2xl border border-slate-200 dark:border-[#30363d] p-6 animate-pulse">
              <div className="h-4 bg-slate-200 dark:bg-[#30363d] rounded w-1/3 mb-4" />
              <div className="h-16 bg-slate-100 dark:bg-[#1c2330] rounded-xl" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-slate-200 dark:border-[#30363d] p-12 text-center space-y-3">
          <Package className="w-10 h-10 text-slate-300 dark:text-[#30363d] mx-auto" />
          <p className="text-slate-500 dark:text-[#8b949e] font-medium">No orders yet.</p>
          <Link href="/catalogue" className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline">
            Browse Catalogue <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-[#161b22] rounded-2xl border border-slate-200 dark:border-[#30363d] overflow-hidden shadow-sm hover:border-teal-500/30 dark:hover:border-teal-500/20 transition-colors">
              {/* Order Header */}
              <Link href={`/orders/${order.id}`} className="block bg-slate-50/80 dark:bg-[#1c2330] px-6 py-4 border-b border-slate-200 dark:border-[#30363d] hover:bg-slate-100 dark:hover:bg-[#243040] transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-slate-400 dark:text-[#8b949e] block font-medium">ORDER PLACED</span>
                    <span className="font-semibold text-slate-800 dark:text-[#c9d1d9] flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-[#8b949e]" />
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-[#8b949e] block font-medium">TOTAL PAID</span>
                    <span className="font-bold text-slate-900 dark:text-[#e6edf3] text-sm mt-0.5">${order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-[#8b949e] block font-medium">PAYMENT</span>
                    <span className="font-semibold text-slate-800 dark:text-[#c9d1d9] flex items-center gap-1 mt-0.5">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400 dark:text-[#8b949e]" />
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-[#8b949e] block font-medium">ORDER #</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-[#e6edf3]">{order.orderNumber}</span>
                </div>
              </div>
              </Link>

              {/* Order Items */}
              <div className="p-6 divide-y divide-slate-100 dark:divide-[#30363d]">
                {order.items.map((item) => {
                  const isReordered = reorderedBookId === item.book.id;
                  return (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.book.coverImage}
                          alt={item.book.title}
                          className="w-14 h-14 object-cover rounded-lg border border-slate-100 dark:border-[#30363d]"
                        />
                        <div className="space-y-1">
                          <Link href={`/books/${item.book.id}`} className="font-bold text-slate-900 dark:text-[#e6edf3] text-sm hover:text-teal-600 dark:hover:text-teal-400 transition">
                            {item.book.title}
                          </Link>
                          <p className="text-xs text-slate-500 dark:text-[#8b949e]">Author: {item.book.author}</p>
                          <div className="text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase">{item.book.format}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => handleBuyAgain(item.book)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                            isReordered
                              ? 'bg-emerald-600 dark:bg-emerald-500/20 dark:border dark:border-emerald-500/30 dark:text-emerald-400 text-white'
                              : 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-500/20 border border-teal-200 dark:border-teal-500/20'
                          }`}
                        >
                          {isReordered ? <Check className="w-3.5 h-3.5" /> : <RotateCw className="w-3.5 h-3.5" />}
                          <span>{isReordered ? 'Added to Cart' : 'Buy It Again'}</span>
                        </button>

                        <Link href={`/books/${item.book.id}`} className="p-2 text-slate-400 dark:text-[#8b949e] hover:text-slate-600 dark:hover:text-[#e6edf3] transition" title="View Details">
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
