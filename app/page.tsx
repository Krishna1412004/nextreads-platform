import Link from 'next/link';
import { mockBooks, mockCategories } from '@/lib/mock-data';
import BookCard from '@/components/BookCard';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Award } from 'lucide-react';

export default function HomePage() {
  const featuredBooks = mockBooks.filter((b) => b.featured);
  const bestSellers = mockBooks.slice(0, 4);

  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 dark:from-[#0d2137] dark:via-[#0a3d2e] dark:to-[#0d1f35] text-white p-8 sm:p-12 shadow-xl dark:shadow-teal-900/40 dark:ring-1 dark:ring-teal-500/20">
        {/* Glow orb */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500/10 dark:bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 left-1/3 w-64 h-64 bg-teal-600/8 dark:bg-teal-300/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 border border-teal-500/30 rounded-full text-xs font-semibold text-teal-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Augmented E-Book Experience</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Elevate Your Technical Mastery with Curated Books.
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Discover premier engineering, AI, cybersecurity, and cloud architecture titles. Instant digital delivery, personalized recommendations, and loyalty rewards.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/catalogue"
              className="px-6 py-3 bg-teal-400 hover:bg-teal-300 dark:bg-teal-400 dark:hover:bg-teal-300 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-teal-500/30 flex items-center gap-2"
            >
              Browse Catalogue <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/orders"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 border border-white/20 dark:border-white/10 text-white font-medium rounded-xl text-sm transition backdrop-blur-sm"
            >
              View Order History
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-2xl shadow-sm flex items-start gap-4">
          <div className="p-3 bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-[#e6edf3] text-sm">Instant e-Book Access</h3>
            <p className="text-xs text-slate-500 dark:text-[#8b949e] mt-1">Download ePub &amp; PDF formats directly upon order completion.</p>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-2xl shadow-sm flex items-start gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-[#e6edf3] text-sm">Loyalty Gift Points</h3>
            <p className="text-xs text-slate-500 dark:text-[#8b949e] mt-1">Earn points on every buy and redeem instant discounts at checkout.</p>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-2xl shadow-sm flex items-start gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-[#e6edf3] text-sm">Enterprise Security</h3>
            <p className="text-xs text-slate-500 dark:text-[#8b949e] mt-1">End-to-end encrypted checkout and compliant identity protocols.</p>
          </div>
        </div>
      </section>

      {/* Categories Horizontal Quick Bar */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-[#e6edf3]">Explore by Category</h2>
          <Link href="/catalogue" className="text-sm font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {mockCategories.map((category) => (
            <Link
              key={category.id}
              href={`/catalogue?category=${category.id}`}
              className="p-4 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-xl hover:border-teal-500 dark:hover:border-teal-500/50 hover:bg-teal-50/30 dark:hover:bg-teal-500/5 hover:shadow-sm transition text-center group"
            >
              <h4 className="font-semibold text-slate-800 dark:text-[#c9d1d9] text-sm group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">
                {category.name}
              </h4>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-[#e6edf3]">Featured Releases</h2>
            <p className="text-sm text-slate-500 dark:text-[#8b949e]">Handpicked architectural and engineering masterclasses</p>
          </div>
          <Link href="/catalogue" className="text-sm font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-1">
            See all books <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-[#e6edf3]">Top Rated Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestSellers.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
    </div>
  );
}
