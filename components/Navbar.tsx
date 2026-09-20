'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, BookOpen, Gift, FileCode, Sun, Moon, Menu, X } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { mockUser } from '@/lib/mock-data';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const navLinks = [
    { name: 'Discover', href: '/' },
    { name: 'Catalogue', href: '/catalogue' },
    { name: 'Order History', href: '/orders' },
    { name: 'API Docs', href: '/api-docs', icon: FileCode },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#161b22]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#30363d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-slate-900 dark:text-[#e6edf3] tracking-tight">
              <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <span>Next<span className="text-teal-500">Reads</span></span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 font-semibold'
                        : 'text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-[#e6edf3] hover:bg-slate-100 dark:hover:bg-[#1c2330]'
                    }`}
                  >
                    {link.icon && <link.icon className="w-4 h-4" />}
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Gift Points — desktop only */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/20 rounded-full text-xs font-semibold text-amber-800 dark:text-amber-300">
                <Gift className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <span>{mockUser.giftPoints} pts</span>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
                className="p-2 rounded-lg text-slate-500 dark:text-[#8b949e] hover:text-slate-800 dark:hover:text-[#e6edf3] hover:bg-slate-100 dark:hover:bg-[#1c2330] transition"
              >
                {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                aria-label="Shopping Cart"
                className="relative p-2 rounded-lg text-slate-600 dark:text-[#8b949e] hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-[#1c2330] transition"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-teal-500 text-white text-[10px] font-bold min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center shadow-sm px-0.5">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Hamburger — mobile only */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle menu"
                className="md:hidden p-2 rounded-lg text-slate-600 dark:text-[#8b949e] hover:bg-slate-100 dark:hover:bg-[#1c2330] transition"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Slide-out Drawer */}
      <div className={`fixed top-0 right-0 z-50 h-full w-72 bg-white dark:bg-[#161b22] border-l border-slate-200 dark:border-[#30363d] shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
        mobileOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-[#30363d]">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-[#e6edf3]" onClick={() => setMobileOpen(false)}>
            <div className="w-7 h-7 rounded-md bg-teal-600 flex items-center justify-center text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <span>Next<span className="text-teal-500">Reads</span></span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-slate-500 dark:text-[#8b949e] hover:bg-slate-100 dark:hover:bg-[#1c2330] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gift Points strip */}
        <div className="mx-5 mt-4 flex items-center gap-2 px-3 py-2.5 bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/20 rounded-xl">
          <Gift className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">{mockUser.giftPoints} Loyalty Points Available</span>
        </div>

        {/* Nav Links */}
        <nav className="mt-4 px-3 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 font-semibold'
                    : 'text-slate-700 dark:text-[#c9d1d9] hover:bg-slate-100 dark:hover:bg-[#1c2330]'
                }`}
              >
                {link.icon
                  ? <link.icon className="w-4 h-4 opacity-70" />
                  : <span className="w-4 h-4 rounded-full border-2 border-current opacity-30 flex-shrink-0" />
                }
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Cart Link */}
        <div className="mt-2 px-3">
          <Link
            href="/cart"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-[#c9d1d9] hover:bg-slate-100 dark:hover:bg-[#1c2330] transition"
          >
            <ShoppingBag className="w-4 h-4 opacity-70" />
            <span>Shopping Cart</span>
            {totalItems > 0 && (
              <span className="ml-auto bg-teal-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Dark Mode Toggle */}
        <div className="absolute bottom-8 left-0 right-0 px-5">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-[#c9d1d9] hover:bg-slate-100 dark:hover:bg-[#1c2330] border border-slate-200 dark:border-[#30363d] transition"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>{darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
          </button>
        </div>
      </div>
    </>
  );
}
