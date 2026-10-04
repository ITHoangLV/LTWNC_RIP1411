import { lazy, Suspense, useState, useEffect } from 'react';
import { ProductListBefore } from './features/products/ProductListBefore';
import { ProductListAfter } from './features/products/ProductListAfter';
import { useAppSelector } from './app/hooks';
import { selectCartTotalItems } from './features/cart/cartSelectors';

// ✅ Kỹ thuật: Code Splitting với React.lazy
// DashboardPage chỉ được tải khi người dùng click tab "Dashboard"
// → tạo JS chunk riêng, giảm initial bundle size
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

type Tab = 'before' | 'after' | 'dashboard';

// Đọc tab mặc định từ URL param ?v=before|after|dashboard
function getInitialTab(): Tab {
  const v = new URLSearchParams(window.location.search).get('v');
  if (v === 'after' || v === 'dashboard') return v;
  return 'before';
}

function DashboardSkeleton() {
  return (
    <div className="dashboard-loading">
      <div className="skeleton skeleton--title" style={{ width: 300, height: 32, marginBottom: 16 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 120, borderRadius: 16 }} />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>(getInitialTab);
  const cartCount = useAppSelector(selectCartTotalItems);

  // Sync URL param khi đổi tab (để Lighthouse có thể đo từng tab riêng)
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    const url = tab === 'before' ? '/' : `/?v=${tab}`;
    window.history.pushState({}, '', url);
  };

  // Lắng nghe nút Back/Forward của browser
  useEffect(() => {
    const onPop = () => setActiveTab(getInitialTab());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return (
    <div className="app">
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header className="navbar">
        <div className="navbar__brand">
          <span className="navbar__logo">⚡</span>
          <span className="navbar__name">TechStore</span>
          <span className="navbar__badge">Week 5 · React Performance</span>
        </div>
        <div className="navbar__actions">
          <span className="navbar__cart-icon">🛒</span>
          {cartCount > 0 && <span className="navbar__cart-count">{cartCount}</span>}
        </div>
      </header>

      {/* ── Tab Bar ────────────────────────────────────────────────────────── */}
      <nav className="tab-bar" role="tablist">
        <button
          id="tab-before"
          role="tab"
          aria-selected={activeTab === 'before'}
          className={`tab ${activeTab === 'before' ? 'tab--active tab--before' : ''}`}
          onClick={() => handleTabChange('before')}
        >
          <span className="tab__icon">⚠️</span>
          <span>Trước tối ưu</span>
        </button>
        <button
          id="tab-after"
          role="tab"
          aria-selected={activeTab === 'after'}
          className={`tab ${activeTab === 'after' ? 'tab--active tab--after' : ''}`}
          onClick={() => handleTabChange('after')}
        >
          <span className="tab__icon">✅</span>
          <span>Sau tối ưu</span>
        </button>
        <button
          id="tab-dashboard"
          role="tab"
          aria-selected={activeTab === 'dashboard'}
          className={`tab ${activeTab === 'dashboard' ? 'tab--active tab--dashboard' : ''}`}
          onClick={() => handleTabChange('dashboard')}
        >
          <span className="tab__icon">📊</span>
          <span>Dashboard</span>
          <span className="tab__lazy-badge">lazy</span>
        </button>
      </nav>

      {/* ── Lighthouse đo URL guide ─────────────────────────────────────────── */}
      <div className="url-guide">
        <span>🔗 Lighthouse URL:</span>
        <code>
          {activeTab === 'before' && 'http://localhost:4173/  (tab Trước)'}
          {activeTab === 'after' && 'http://localhost:4173/?v=after  (tab Sau)'}
          {activeTab === 'dashboard' && 'http://localhost:4173/?v=dashboard  (tab Dashboard)'}
        </code>
      </div>

      {/* ── Main Content ────────────────────────────────────────────────────── */}
      <main className="main-content">
        {activeTab === 'before' && <ProductListBefore />}
        {activeTab === 'after' && <ProductListAfter />}
        {activeTab === 'dashboard' && (
          // ✅ Suspense bao ngoài lazy component — hiện skeleton khi đang load
          <Suspense fallback={<DashboardSkeleton />}>
            <DashboardPage />
          </Suspense>
        )}
      </main>
    </div>
  );
}
