import { useState } from 'react';
import { ProductList } from './features/products/ProductList';
import { CartSidebar } from './features/cart/CartSidebar';
import { useAppSelector } from './app/hooks';
import { selectCartTotalItems } from './features/cart/cartSelectors';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalItems = useAppSelector(selectCartTotalItems);

  return (
    <div className="app">
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar__brand">
          <span className="navbar__logo">⚡</span>
          <span className="navbar__name">TechStore</span>
          <span className="navbar__tagline">Redux Toolkit Demo</span>
        </div>
        <button
          id="open-cart-btn"
          className="navbar__cart-btn"
          onClick={() => setIsCartOpen(true)}
          aria-label="Mở giỏ hàng"
        >
          🛒 Giỏ hàng
          {totalItems > 0 && (
            <span className="navbar__cart-count">{totalItems}</span>
          )}
        </button>
      </header>

      {/* Hero */}
      <div className="hero">
        <h1 className="hero__title">
          Công nghệ <span className="hero__highlight">đỉnh cao</span>
        </h1>
        <p className="hero__subtitle">
          Khám phá bộ sưu tập sản phẩm công nghệ mới nhất
        </p>
      </div>

      {/* Main content */}
      <main className="main-content">
        <ProductList />
      </main>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

export default App;
