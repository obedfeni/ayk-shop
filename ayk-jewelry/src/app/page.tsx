'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BackgroundEffects } from '@/components/layout/BackgroundEffects';
import { Header } from '@/components/layout/Header';
import { ProductGrid } from '@/components/product/ProductGrid';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { COLORS, BUSINESS } from '@/lib/constants';
import { useProducts } from '@/hooks/useProducts';
import type { Product } from '@/types';

export default function ShopPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const { data, isLoading, error, refetch } = useProducts();
  const allProducts = data?.data ?? [];

  const filtered = useMemo(() => {
    return allProducts.filter((p) => {
      const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allProducts, searchQuery, activeCategory]);

  const handleOrder = (product: Product) => {
    setSelectedProduct(product);
    setCartOpen(true);
  };

  return (
    <div className="relative min-h-screen" style={{ background: COLORS.bg }}>
      <BackgroundEffects />

      <div className="relative z-10">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-3" style={{ color: COLORS.text }}>
              Crafted with{' '}
              <span style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Love
              </span>
            </h2>
            <p className="text-lg max-w-md mx-auto" style={{ color: COLORS.textSoft }}>
              Exquisite handcrafted jewelry delivered across Ghana
            </p>
          </motion.div>

          {/* Product count */}
          {!isLoading && (
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm" style={{ color: COLORS.textMuted }}>
                {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'} found
                {activeCategory !== 'All' && ` in ${activeCategory}`}
                {searchQuery && ` for "${searchQuery}"`}
              </p>
              {(searchQuery || activeCategory !== 'All') && (
                <button onClick={() => { setSearchQuery(''); setActiveCategory('All'); }} className="text-sm font-medium" style={{ color: COLORS.primary }}>
                  Clear filters ×
                </button>
              )}
            </div>
          )}

          {/* Loading skeleton */}
          {isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-[20px] overflow-hidden bg-white border border-ayk-border animate-pulse">
                  <div className="aspect-square bg-gray-100" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                    <div className="h-10 bg-gray-100 rounded-xl mt-4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {error && !isLoading && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.text }}>Failed to load products</h3>
              <p className="text-sm mb-4" style={{ color: COLORS.textMuted }}>Check your connection and try again</p>
              <button onClick={() => refetch()} className="text-sm font-medium px-4 py-2 rounded-xl border" style={{ color: COLORS.primary, borderColor: COLORS.primary }}>
                Try Again
              </button>
            </div>
          )}

          {/* Products */}
          {!isLoading && !error && <ProductGrid products={filtered} onOrder={handleOrder} />}
        </main>

        {/* Footer */}
        <footer className="mt-16 border-t py-8 text-center" style={{ borderColor: COLORS.border }}>
          <p className="text-sm" style={{ color: COLORS.textMuted }}>
            © {new Date().getFullYear()} {BUSINESS.name} · Crafted with ❤️ in Ghana ·{' '}
            <a href={`tel:${BUSINESS.phone}`} className="font-medium hover:underline" style={{ color: COLORS.primary }}>{BUSINESS.phone}</a>
          </p>
        </footer>
      </div>

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        selectedProduct={selectedProduct}
        onClearSelection={() => setSelectedProduct(null)}
      />
    </div>
  );
}
