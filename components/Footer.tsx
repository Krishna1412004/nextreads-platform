import Link from 'next/link';
import { BookOpen, Mail, Github, Twitter, Linkedin, ShieldCheck, Zap, Award } from 'lucide-react';

const footerLinks = {
  explore: [
    { name: 'Discover',       href: '/' },
    { name: 'Books Catalogue',href: '/catalogue' },
    { name: 'Order History',  href: '/orders' },
    { name: 'Shopping Cart',  href: '/cart' },
  ],
  categories: [
    { name: 'Computer Science & AI',  href: '/catalogue?category=cat-1' },
    { name: 'Software Architecture',  href: '/catalogue?category=cat-2' },
    { name: 'Cloud & DevOps',         href: '/catalogue?category=cat-3' },
    { name: 'Data Engineering',       href: '/catalogue?category=cat-4' },
    { name: 'Cybersecurity',          href: '/catalogue?category=cat-5' },
    { name: 'Programming Languages',  href: '/catalogue?category=cat-6' },
  ],
  developers: [
    { name: 'OpenAPI Docs',     href: '/api-docs' },
    { name: 'REST API — Books', href: '/api/books' },
    { name: 'REST API — Orders',href: '/api/orders' },
    { name: 'Prisma Schema',    href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#161b22] border-t border-slate-200 dark:border-[#30363d] mt-auto">

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-slate-900 dark:text-[#e6edf3]">
              <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <span>Next<span className="text-teal-500">Reads</span></span>
            </Link>

            <p className="text-sm text-slate-500 dark:text-[#8b949e] leading-relaxed max-w-xs">
              An AI-augmented enterprise e-bookstore platform. Curated technical titles, instant digital delivery, and loyalty rewards for engineers &amp; architects.
            </p>

            {/* Trust badges */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#8b949e]">
                <ShieldCheck className="w-4 h-4 text-teal-500 dark:text-teal-400 flex-shrink-0" />
                <span>TLS 1.3 Encrypted Checkout</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#8b949e]">
                <Zap className="w-4 h-4 text-teal-500 dark:text-teal-400 flex-shrink-0" />
                <span>Instant ePub &amp; PDF Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#8b949e]">
                <Award className="w-4 h-4 text-teal-500 dark:text-teal-400 flex-shrink-0" />
                <span>Loyalty Points on Every Purchase</span>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3 pt-1">
              {[
                { Icon: Github,   href: '#', label: 'GitHub'   },
                { Icon: Twitter,  href: '#', label: 'Twitter'  },
                { Icon: Linkedin, href: '#', label: 'LinkedIn' },
                { Icon: Mail,     href: '#', label: 'Email'    },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 dark:text-[#8b949e] hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-500/10 border border-slate-200 dark:border-[#30363d] transition"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-[#e6edf3] uppercase tracking-widest">Explore</h4>
            <ul className="space-y-2.5">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-500 dark:text-[#8b949e] hover:text-teal-600 dark:hover:text-teal-400 transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-[#e6edf3] uppercase tracking-widest">Categories</h4>
            <ul className="space-y-2.5">
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-500 dark:text-[#8b949e] hover:text-teal-600 dark:hover:text-teal-400 transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Developers */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-[#e6edf3] uppercase tracking-widest">Developers</h4>
            <ul className="space-y-2.5">
              {footerLinks.developers.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-slate-500 dark:text-[#8b949e] hover:text-teal-600 dark:hover:text-teal-400 transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Newsletter strip */}
            <div className="pt-4 space-y-2">
              <p className="text-xs font-semibold text-slate-700 dark:text-[#c9d1d9]">Stay updated</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 min-w-0 text-xs px-3 py-2 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-lg text-slate-800 dark:text-[#c9d1d9] placeholder-slate-400 dark:placeholder-[#8b949e] focus:outline-none focus:ring-1 focus:ring-teal-500 dark:focus:ring-teal-500/50"
                />
                <button className="px-3 py-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white text-xs font-bold rounded-lg transition flex-shrink-0">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200 dark:border-[#30363d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 dark:text-[#8b949e]">
          <span>
            &copy; {new Date().getFullYear()} <span className="font-semibold text-slate-600 dark:text-[#c9d1d9]">NextReads Platform</span> — Built with Next.js, Prisma &amp; PostgreSQL.
          </span>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-slate-700 dark:hover:text-[#e6edf3] transition">Privacy Policy</a>
            <a href="#" className="hover:text-slate-700 dark:hover:text-[#e6edf3] transition">Terms of Service</a>
            <a href="#" className="hover:text-slate-700 dark:hover:text-[#e6edf3] transition">Cookie Policy</a>
          </div>
        </div>
      </div>

    </footer>
  );
}
