'use client';

import { useState, useMemo } from 'react';
import { mockBooks, mockCategories, mockBrands } from '@/lib/mock-data';
import BookCard from '@/components/BookCard';
import { Search, Filter, BookOpen } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function CataloguePage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'ALL';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [sortBy, setSortBy] = useState('featured');

  const filteredBooks = useMemo(() => {
    return mockBooks.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || book.categoryId === selectedCategory;
      const matchesBrand = selectedBrand === 'ALL' || book.brandId === selectedBrand;
      return matchesSearch && matchesCategory && matchesBrand;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [searchQuery, selectedCategory, selectedBrand, sortBy]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-[#161b22] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-[#30363d] shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-[#e6edf3]">Books Catalogue</h1>
        <p className="text-sm text-slate-500 dark:text-[#8b949e] mt-1">
          Select category, browse brands, and filter through technical &amp; engineering publications.
        </p>
        <div className="mt-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-[#8b949e]" />
          <input
            type="text"
            placeholder="Search by title, author, or keywords (e.g., Kubernetes, Microservices, AI)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-xl text-sm text-slate-900 dark:text-[#e6edf3] placeholder-slate-400 dark:placeholder-[#8b949e] focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-500/50 transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Filters */}
        <aside className="space-y-6 lg:sticky lg:top-24">
          {/* Categories */}
          <div className="bg-white dark:bg-[#161b22] p-5 rounded-2xl border border-slate-200 dark:border-[#30363d] shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#e6edf3] uppercase tracking-wider flex items-center gap-2">
              <Filter className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Categories
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === 'ALL'
                    ? 'bg-teal-50 dark:bg-teal-500/15 text-teal-700 dark:text-teal-400'
                    : 'text-slate-600 dark:text-[#8b949e] hover:bg-slate-50 dark:hover:bg-[#1c2330] hover:text-slate-900 dark:hover:text-[#e6edf3]'
                }`}
              >
                All Categories ({mockBooks.length})
              </button>
              {mockCategories.map((cat) => {
                const count = mockBooks.filter((b) => b.categoryId === cat.id).length;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-teal-50 dark:bg-teal-500/15 text-teal-700 dark:text-teal-400'
                        : 'text-slate-600 dark:text-[#8b949e] hover:bg-slate-50 dark:hover:bg-[#1c2330] hover:text-slate-900 dark:hover:text-[#e6edf3]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-slate-400 dark:text-[#8b949e]">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brands */}
          <div className="bg-white dark:bg-[#161b22] p-5 rounded-2xl border border-slate-200 dark:border-[#30363d] shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#e6edf3] uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Publishers
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedBrand('ALL')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  selectedBrand === 'ALL'
                    ? 'bg-teal-50 dark:bg-teal-500/15 text-teal-700 dark:text-teal-400'
                    : 'text-slate-600 dark:text-[#8b949e] hover:bg-slate-50 dark:hover:bg-[#1c2330] hover:text-slate-900 dark:hover:text-[#e6edf3]'
                }`}
              >
                All Publishers
              </button>
              {mockBrands.map((brand) => {
                const count = mockBooks.filter((b) => b.brandId === brand.id).length;
                const isSelected = selectedBrand === brand.id;
                return (
                  <button
                    key={brand.id}
                    onClick={() => setSelectedBrand(brand.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-teal-50 dark:bg-teal-500/15 text-teal-700 dark:text-teal-400'
                        : 'text-slate-600 dark:text-[#8b949e] hover:bg-slate-50 dark:hover:bg-[#1c2330] hover:text-slate-900 dark:hover:text-[#e6edf3]'
                    }`}
                  >
                    <span>{brand.name}</span>
                    <span className="text-[10px] text-slate-400 dark:text-[#8b949e]">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Grid */}
        <main className="lg:col-span-3 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#161b22] p-4 rounded-xl border border-slate-200 dark:border-[#30363d]">
            <span className="text-sm font-medium text-slate-600 dark:text-[#8b949e]">
              Showing <strong className="text-slate-900 dark:text-[#e6edf3]">{filteredBooks.length}</strong> books
            </span>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-xs font-medium text-slate-500 dark:text-[#8b949e]">Sort by:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-semibold bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-lg px-3 py-1.5 text-slate-700 dark:text-[#e6edf3] focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="featured">Featured First</option>
                <option value="rating">Highest Rating</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {filteredBooks.length === 0 ? (
            <div className="bg-white dark:bg-[#161b22] p-12 text-center rounded-2xl border border-slate-200 dark:border-[#30363d]">
              <p className="text-slate-500 dark:text-[#8b949e] font-medium">No books match your selected filters.</p>
              <button
                onClick={() => { setSelectedCategory('ALL'); setSelectedBrand('ALL'); setSearchQuery(''); }}
                className="mt-4 px-4 py-2 bg-teal-600 dark:bg-teal-500/15 dark:border dark:border-teal-500/30 dark:text-teal-400 text-white rounded-lg text-xs font-semibold hover:bg-teal-700 dark:hover:bg-teal-500/25"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
