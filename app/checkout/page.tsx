'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/store/useCartStore';
import { mockAddresses, mockUser } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';
import {
  MapPin, CreditCard, Gift, ShieldCheck, CheckCircle2,
  Lock, ArrowRight, Smartphone, Building, Plus, X, Check,
} from 'lucide-react';
import { Address } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getTotalDiscount, clearCart } = useCartStore();

  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState(mockAddresses[0].id);
  const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'UPI' | 'NET_BANKING' | 'DEBIT_CARD'>('CREDIT_CARD');
  const [useGiftPoints, setUseGiftPoints] = useState(false);
  const [redeemPoints] = useState(Math.min(50, mockUser.giftPoints));
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  // Add address form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '', phone: '', streetLine1: '', streetLine2: '',
    city: '', state: '', postalCode: '', country: 'United States',
  });
  const [formError, setFormError] = useState('');

  const subtotal = getSubtotal();
  const catalogueDiscount = getTotalDiscount();
  const pointsDollarDiscount = useGiftPoints ? Number((redeemPoints * 0.1).toFixed(2)) : 0;
  const finalPayable = Math.max(0, subtotal - catalogueDiscount - pointsDollarDiscount);

  const handleAddAddress = () => {
    if (!newAddress.fullName || !newAddress.streetLine1 || !newAddress.city || !newAddress.state || !newAddress.postalCode || !newAddress.phone) {
      setFormError('Please fill in all required fields.');
      return;
    }
    const created: Address = {
      id: `addr-${Date.now()}`,
      fullName: newAddress.fullName,
      phone: newAddress.phone,
      streetLine1: newAddress.streetLine1,
      streetLine2: newAddress.streetLine2 || undefined,
      city: newAddress.city,
      state: newAddress.state,
      postalCode: newAddress.postalCode,
      country: newAddress.country,
      isDefault: false,
    };
    setAddresses((prev) => [...prev, created]);
    setSelectedAddressId(created.id);
    setShowAddForm(false);
    setFormError('');
    setNewAddress({ fullName: '', phone: '', streetLine1: '', streetLine2: '', city: '', state: '', postalCode: '', country: 'United States' });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setIsProcessing(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ bookId: i.bookId, quantity: i.quantity })),
          addressId: selectedAddressId,
          pointsRedeemed: useGiftPoints ? redeemPoints : 0,
          paymentMethod,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) { clearCart(); setOrderSuccess(data.order); }
      else alert(data.error || 'Failed to complete order');
    } catch { alert('Error committing payment transaction.'); }
    finally { setIsProcessing(false); }
  };

  const inputCls = 'w-full text-xs p-3 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-lg text-slate-800 dark:text-[#c9d1d9] placeholder-slate-400 dark:placeholder-[#8b949e] focus:outline-none focus:ring-1 focus:ring-teal-500 dark:focus:ring-teal-500/50 transition';

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6 bg-white dark:bg-[#161b22] rounded-3xl border border-slate-200 dark:border-[#30363d] shadow-md dark:shadow-black/40">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border dark:border-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-[#e6edf3]">Purchase Completed!</h1>
          <p className="text-sm text-slate-500 dark:text-[#8b949e]">
            Order <strong className="text-teal-700 dark:text-teal-400 font-mono font-bold">{orderSuccess.orderNumber}</strong> has been successfully placed.
          </p>
        </div>
        <div className="p-5 bg-slate-50 dark:bg-[#0d1117] rounded-2xl border border-slate-100 dark:border-[#30363d] text-left space-y-3 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-[#8b949e]">Transaction Status</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">PAID & SETTLED</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-[#8b949e]">Payment Mode</span>
            <span className="font-semibold text-slate-800 dark:text-[#c9d1d9]">{orderSuccess.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-[#8b949e]">Total Paid</span>
            <span className="font-bold text-slate-900 dark:text-[#e6edf3] text-sm">${orderSuccess.totalAmount.toFixed(2)}</span>
          </div>
          {orderSuccess.pointsRedeemed > 0 && (
            <div className="flex justify-between text-amber-700 dark:text-amber-400">
              <span>Points Redeemed</span>
              <span className="font-bold">{orderSuccess.pointsRedeemed} pts (-${orderSuccess.pointsDiscount.toFixed(2)})</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-[#8b949e]">Delivery Address</span>
            <span className="font-medium text-slate-700 dark:text-[#c9d1d9] text-right">{orderSuccess.address.streetLine1}, {orderSuccess.address.city}</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button onClick={() => router.push('/orders')} className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white font-semibold rounded-xl text-xs transition">
            View in Order History
          </button>
          <button onClick={() => router.push('/catalogue')} className="w-full sm:w-auto px-6 py-3 bg-slate-100 dark:bg-[#1c2330] hover:bg-slate-200 dark:hover:bg-[#30363d] text-slate-800 dark:text-[#c9d1d9] font-semibold rounded-xl text-xs border border-slate-200 dark:border-[#30363d] transition">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-[#e6edf3]">Payment &amp; Purchase</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-[#8b949e] mt-1">Select delivery address, apply loyalty gift points, and complete payment.</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">

          {/* Step 1: Address */}
          <div className="bg-white dark:bg-[#161b22] p-6 rounded-2xl border border-slate-200 dark:border-[#30363d] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-[#e6edf3]">1. Select Delivery / Billing Address</h2>
              </div>
              <button
                type="button"
                onClick={() => { setShowAddForm((v) => !v); setFormError(''); }}
                className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition"
              >
                {showAddForm ? <><X className="w-3.5 h-3.5" /> Cancel</> : <><Plus className="w-3.5 h-3.5" /> Add New</>}
              </button>
            </div>

            {/* Existing addresses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {addresses.map((addr) => {
                const isSelected = selectedAddressId === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`relative p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-slate-200 dark:border-[#30363d] bg-white dark:bg-[#1c2330] border-l-4 border-l-teal-500 dark:border-l-teal-400 shadow-sm'
                        : 'border-slate-200 dark:border-[#30363d] hover:bg-slate-50 dark:hover:bg-[#1c2330]/60'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-teal-500 dark:bg-teal-400 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white dark:text-slate-900" />
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-1 pr-7">
                      <span className="font-bold text-sm text-slate-800 dark:text-[#e6edf3]">{addr.fullName}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] bg-slate-100 dark:bg-[#30363d] text-slate-500 dark:text-[#8b949e] px-1.5 py-0.5 rounded font-medium">Default</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-[#8b949e]">{addr.streetLine1}</p>
                    {addr.streetLine2 && <p className="text-xs text-slate-500 dark:text-[#8b949e]">{addr.streetLine2}</p>}
                    <p className="text-xs text-slate-500 dark:text-[#8b949e]">{addr.city}, {addr.state} {addr.postalCode}</p>
                    <p className="text-xs text-slate-400 dark:text-[#8b949e]/50 mt-1.5">{addr.phone}</p>
                  </div>
                );
              })}
            </div>

            {/* Add New Address Form */}
            {showAddForm && (
              <div className="mt-2 p-5 rounded-xl border border-dashed border-teal-400/40 dark:border-teal-500/30 bg-teal-50/30 dark:bg-teal-500/5 space-y-3">
                <h3 className="text-xs font-bold text-slate-800 dark:text-[#c9d1d9] uppercase tracking-wider">New Address</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    className={inputCls}
                    placeholder="Full Name *"
                    value={newAddress.fullName}
                    onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                  />
                  <input
                    className={inputCls}
                    placeholder="Phone Number *"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  />
                </div>
                <input
                  className={inputCls}
                  placeholder="Street Address, Building *"
                  value={newAddress.streetLine1}
                  onChange={(e) => setNewAddress({ ...newAddress, streetLine1: e.target.value })}
                />
                <input
                  className={inputCls}
                  placeholder="Apartment, Suite, Floor (optional)"
                  value={newAddress.streetLine2}
                  onChange={(e) => setNewAddress({ ...newAddress, streetLine2: e.target.value })}
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <input
                    className={`${inputCls} sm:col-span-2`}
                    placeholder="City *"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  />
                  <input
                    className={inputCls}
                    placeholder="State *"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  />
                  <input
                    className={inputCls}
                    placeholder="ZIP *"
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                  />
                </div>
                <input
                  className={inputCls}
                  placeholder="Country"
                  value={newAddress.country}
                  onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                />

                {formError && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{formError}</p>
                )}

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleAddAddress}
                    className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white text-xs font-bold rounded-lg transition"
                  >
                    Save &amp; Select Address
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowAddForm(false); setFormError(''); }}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-[#e6edf3] transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Gift Points */}
          <div className="bg-white dark:bg-[#161b22] p-6 rounded-2xl border border-slate-200 dark:border-[#30363d] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-[#e6edf3]">2. Redeem Loyalty Gift Points</h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 dark:bg-amber-400/10 text-amber-800 dark:text-amber-300 rounded-full border border-amber-200 dark:border-amber-400/20">
                Available: {mockUser.giftPoints} pts (${(mockUser.giftPoints * 0.1).toFixed(2)})
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox" id="points-toggle" checked={useGiftPoints}
                onChange={(e) => setUseGiftPoints(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 dark:bg-[#0d1117] dark:border-[#30363d]"
              />
              <label htmlFor="points-toggle" className="text-xs font-medium text-slate-700 dark:text-[#c9d1d9] cursor-pointer">
                Redeem available loyalty points on this purchase
              </label>
            </div>
            {useGiftPoints && (
              <div className="p-3 bg-amber-50/50 dark:bg-amber-400/5 rounded-xl border border-amber-100 dark:border-amber-400/15">
                <p className="text-xs text-amber-900 dark:text-amber-300">
                  Redeeming <strong>{redeemPoints} Points</strong> gives a discount of{' '}
                  <strong className="text-emerald-700 dark:text-emerald-400">-${(redeemPoints * 0.1).toFixed(2)}</strong>.
                </p>
              </div>
            )}
          </div>

          {/* Step 3: Payment */}
          <div className="bg-white dark:bg-[#161b22] p-6 rounded-2xl border border-slate-200 dark:border-[#30363d] shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-[#e6edf3]">3. Select Payment Option</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {([
                { key: 'CREDIT_CARD', label: 'Credit / Debit Card', Icon: CreditCard },
                { key: 'UPI',         label: 'UPI / Instant QR',    Icon: Smartphone },
                { key: 'NET_BANKING', label: 'Net Banking',          Icon: Building },
              ] as const).map(({ key, label, Icon }) => {
                const isActive = paymentMethod === key;
                return (
                  <button key={key} type="button" onClick={() => setPaymentMethod(key)}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-center transition ${
                      isActive
                        ? 'border-teal-500 dark:border-teal-500/60 bg-teal-50/50 dark:bg-teal-500/10 text-teal-900 dark:text-teal-300 font-bold ring-1 ring-teal-500 dark:ring-teal-500/30'
                        : 'border-slate-200 dark:border-[#30363d] text-slate-600 dark:text-[#8b949e] hover:border-slate-300 dark:hover:border-[#8b949e]/40 hover:bg-slate-50 dark:hover:bg-[#1c2330] font-medium'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{label}</span>
                  </button>
                );
              })}
            </div>
            {paymentMethod === 'CREDIT_CARD' && (
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-[#30363d]">
                <input type="text" placeholder="Card Number" defaultValue="4532 •••• •••• 8892"
                  className={`${inputCls} font-mono`} />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="MM/YY" defaultValue="12/28" className={inputCls} />
                  <input type="password" placeholder="CVV" defaultValue="•••" className={inputCls} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-[#161b22] p-6 rounded-2xl border border-slate-200 dark:border-[#30363d] shadow-sm space-y-5 sticky top-24">
            <h3 className="text-base font-bold text-slate-900 dark:text-[#e6edf3]">Purchase Overview</h3>
            <div className="space-y-2.5 text-xs text-slate-600 dark:text-[#8b949e]">
              <div className="flex justify-between">
                <span>Items ({items.reduce((acc, i) => acc + i.quantity, 0)})</span>
                <span className="font-semibold text-slate-800 dark:text-[#c9d1d9]">${subtotal.toFixed(2)}</span>
              </div>
              {catalogueDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Catalogue Savings</span><span>-${catalogueDiscount.toFixed(2)}</span>
                </div>
              )}
              {useGiftPoints && (
                <div className="flex justify-between text-amber-700 dark:text-amber-400 font-semibold">
                  <span>Points Discount</span><span>-${pointsDollarDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500 dark:text-[#8b949e]">
                <span>Instant Delivery</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">FREE</span>
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-[#30363d] flex justify-between text-base font-extrabold text-slate-900 dark:text-[#e6edf3]">
                <span>Final Payable</span>
                <span className="text-teal-700 dark:text-teal-400">${finalPayable.toFixed(2)}</span>
              </div>
            </div>
            <button type="submit" disabled={isProcessing || items.length === 0}
              className="w-full py-4 px-4 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 disabled:opacity-50 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20 dark:shadow-teal-500/20 transition cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>{isProcessing ? 'Authorizing Payment...' : `Commit Payment • $${finalPayable.toFixed(2)}`}</span>
            </button>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-[#8b949e]">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>TLS 1.3 256-bit Encrypted Transaction</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
