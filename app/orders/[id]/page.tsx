'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, CheckCircle2, Clock, Package, Truck,
  CreditCard, MapPin, Gift, Download, RotateCw, Check,
} from 'lucide-react';
import { Order } from '@/types';
import { useCartStore } from '@/lib/store/useCartStore';

const STATUS_STEPS = ['PENDING', 'PROCESSING', 'PAID', 'SHIPPED', 'DELIVERED'] as const;

const STATUS_META: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PENDING:    { label: 'Pending',    color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 border-amber-200 dark:border-amber-400/20',    icon: Clock },
  PROCESSING: { label: 'Processing', color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-400/10 border-blue-200 dark:border-blue-400/20',          icon: Package },
  PAID:       { label: 'Paid',       color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-400/10 border-teal-200 dark:border-teal-400/20',           icon: CheckCircle2 },
  SHIPPED:    { label: 'Shipped',    color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-400/10 border-purple-200 dark:border-purple-400/20', icon: Truck },
  DELIVERED:  { label: 'Delivered',  color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 border-emerald-200 dark:border-emerald-400/20', icon: CheckCircle2 },
  CANCELLED:  { label: 'Cancelled',  color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-400/10 border-rose-200 dark:border-rose-400/20',           icon: Clock },
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const addToCart = useCartStore((s) => s.addToCart);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [reorderedId, setReorderedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch('/api/orders', { cache: 'no-store' });
        const orders: Order[] = await res.json();
        const found = orders.find((o) => o.id === id || o.orderNumber === id);
        if (found) setOrder(found);
        else setNotFound(true);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleBuyAgain = (book: any) => {
    addToCart(book, 1);
    setReorderedId(book.id);
    setTimeout(() => setReorderedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-4 w-32 bg-slate-200 dark:bg-[#30363d] rounded" />
        <div className="h-40 bg-white dark:bg-[#161b22] rounded-2xl border border-slate-200 dark:border-[#30363d]" />
        <div className="h-64 bg-white dark:bg-[#161b22] rounded-2xl border border-slate-200 dark:border-[#30363d]" />
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="text-center py-24 space-y-4">
        <Package className="w-12 h-12 text-slate-300 dark:text-[#30363d] mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-[#e6edf3]">Order not found</h2>
        <p className="text-sm text-slate-500 dark:text-[#8b949e]">This order doesn&apos;t exist or may have been removed.</p>
        <Link href="/orders" className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 dark:text-teal-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Order History
        </Link>
      </div>
    );
  }

  const meta = STATUS_META[order.status] ?? STATUS_META['PAID'];
  const StatusIcon = meta.icon;
  const currentStep = STATUS_STEPS.indexOf(order.status as any);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Back */}
      <Link href="/orders" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#8b949e] hover:text-teal-600 dark:hover:text-teal-400 transition">
        <ArrowLeft className="w-4 h-4" /> Back to Order History
      </Link>

      {/* Header Card */}
      <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-slate-200 dark:border-[#30363d] p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs text-slate-400 dark:text-[#8b949e] font-medium uppercase tracking-wider mb-1">Order</p>
            <h1 className="text-2xl font-extrabold font-mono text-slate-900 dark:text-[#e6edf3]">{order.orderNumber}</h1>
            <p className="text-xs text-slate-500 dark:text-[#8b949e] mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${meta.color}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {meta.label}
          </span>
        </div>

        {/* Progress Bar — only for non-cancelled */}
        {order.status !== 'CANCELLED' && (
          <div className="mt-6">
            <div className="flex items-center">
              {STATUS_STEPS.map((step, i) => {
                const done = i <= currentStep;
                const isLast = i === STATUS_STEPS.length - 1;
                return (
                  <div key={step} className="flex items-center flex-1 last:flex-none">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0 transition-all ${
                      done
                        ? 'bg-teal-500 dark:bg-teal-400 border-teal-500 dark:border-teal-400 text-white dark:text-slate-900'
                        : 'bg-white dark:bg-[#0d1117] border-slate-200 dark:border-[#30363d] text-slate-400 dark:text-[#8b949e]'
                    }`}>
                      {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                    {!isLast && (
                      <div className={`flex-1 h-0.5 mx-1 transition-all ${
                        i < currentStep ? 'bg-teal-500 dark:bg-teal-400' : 'bg-slate-200 dark:bg-[#30363d]'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2">
              {STATUS_STEPS.map((step) => (
                <span key={step} className="text-[9px] font-medium text-slate-400 dark:text-[#8b949e] capitalize flex-1 text-center first:text-left last:text-right">
                  {step.charAt(0) + step.slice(1).toLowerCase()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-[#e6edf3]">
            Items ({order.items.length})
          </h2>
          <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-slate-200 dark:border-[#30363d] shadow-sm divide-y divide-slate-100 dark:divide-[#30363d]">
            {order.items.map((item) => {
              const isReordered = reorderedId === item.book.id;
              return (
                <div key={item.id} className="p-5 flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.book.coverImage}
                    alt={item.book.title}
                    className="w-16 h-16 object-cover rounded-xl border border-slate-100 dark:border-[#30363d] flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <Link href={`/books/${item.book.id}`} className="font-semibold text-slate-900 dark:text-[#e6edf3] text-sm hover:text-teal-600 dark:hover:text-teal-400 transition line-clamp-1">
                      {item.book.title}
                    </Link>
                    <p className="text-xs text-slate-500 dark:text-[#8b949e] mt-0.5">{item.book.author}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase">{item.book.format}</span>
                      <span className="text-[10px] text-slate-400 dark:text-[#8b949e]">Qty: {item.quantity}</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-[#c9d1d9]">${item.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleBuyAgain(item.book)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition ${
                        isReordered
                          ? 'bg-emerald-500/10 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30'
                          : 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/20 hover:bg-teal-100 dark:hover:bg-teal-500/20'
                      }`}
                    >
                      {isReordered ? <Check className="w-3 h-3" /> : <RotateCw className="w-3 h-3" />}
                      {isReordered ? 'Added' : 'Buy Again'}
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-slate-500 dark:text-[#8b949e] border border-slate-200 dark:border-[#30363d] hover:bg-slate-50 dark:hover:bg-[#1c2330] transition">
                      <Download className="w-3 h-3" />
                      Download
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-4">
          {/* Payment Summary */}
          <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-slate-200 dark:border-[#30363d] p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#e6edf3] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Payment Summary
            </h3>
            <div className="space-y-2 text-xs text-slate-600 dark:text-[#8b949e]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800 dark:text-[#c9d1d9]">${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Catalogue Discount</span>
                  <span className="font-semibold">-${order.discount.toFixed(2)}</span>
                </div>
              )}
              {order.pointsRedeemed > 0 && (
                <div className="flex justify-between text-amber-600 dark:text-amber-400">
                  <span>Points Redeemed ({order.pointsRedeemed} pts)</span>
                  <span className="font-semibold">-${order.pointsDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Digital Delivery</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">FREE</span>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-[#30363d] flex justify-between text-sm font-extrabold text-slate-900 dark:text-[#e6edf3]">
                <span>Total Paid</span>
                <span className="text-teal-700 dark:text-teal-400">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-[#30363d] flex items-center gap-2 text-xs text-slate-500 dark:text-[#8b949e]">
              <CreditCard className="w-3.5 h-3.5" />
              <span>{order.paymentMethod.replace('_', ' ')}</span>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-slate-200 dark:border-[#30363d] p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#e6edf3] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Delivery Address
            </h3>
            <div className="text-xs text-slate-600 dark:text-[#8b949e] space-y-0.5">
              <p className="font-semibold text-slate-800 dark:text-[#c9d1d9]">{order.address.fullName}</p>
              <p>{order.address.streetLine1}</p>
              {order.address.streetLine2 && <p>{order.address.streetLine2}</p>}
              <p>{order.address.city}, {order.address.state} {order.address.postalCode}</p>
              <p className="text-slate-400 dark:text-[#8b949e]/60 pt-1">{order.address.phone}</p>
            </div>
          </div>

          {/* Points earned note */}
          {order.pointsRedeemed === 0 && (
            <div className="bg-amber-50 dark:bg-amber-400/5 rounded-xl border border-amber-100 dark:border-amber-400/15 p-4 flex items-start gap-2.5">
              <Gift className="w-4 h-4 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 dark:text-amber-300">
                You earned <strong>{Math.floor(order.totalAmount)}</strong> loyalty points on this order!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
