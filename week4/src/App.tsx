import { useState } from 'react';
import { ProductList } from './features/products/ProductList';
import { CartSidebar } from './features/cart/CartSidebar';
import { FavoritesSidebar } from './features/favorites/FavoritesSidebar';
import { useAppSelector } from './app/hooks';
import { selectCartTotalItems } from './features/cart/cartSelectors';
import { useFavorites } from './features/favorites/useFavorites';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavOpen, setIsFavOpen] = useState(false);

  // Redux: cart count
  const cartCount = useAppSelector(selectCartTotalItems);

  // Zustand: favorites count — không cần useSelector, gọi thẳng hook
  const { count: favCount } = useFavorites();

  return (
    <div className="app">
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar__brand">
          <span className="navbar__logo">⚡</span>
          <span className="navbar__name">TechStore</span>
          <span className="navbar__tagline">Week 4 · Zustand</span>
        </div>

        <div className="navbar__actions">
          {/* Favorites button */}
          <button
            id="open-favorites-btn"
            className={`navbar__fav-btn ${favCount > 0 ? 'navbar__fav-btn--has-items' : ''}`}
            onClick={() => setIsFavOpen(true)}
            aria-label="Mở danh sách yêu thích"
          >
            {favCount > 0 ? '❤️' : '🤍'} Yêu thích
            {favCount > 0 && (
              <span className="navbar__fav-count">{favCount}</span>
            )}
          </button>

          {/* Cart button */}
          <button
            id="open-cart-btn"
            className="navbar__cart-btn"
            onClick={() => setIsCartOpen(true)}
            aria-label="Mở giỏ hàng"
          >
            🛒 Giỏ hàng
            {cartCount > 0 && (
              <span className="navbar__cart-count">{cartCount}</span>
            )}
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="hero">
        <h1 className="hero__title">
          Công nghệ <span className="hero__highlight">đỉnh cao</span>
        </h1>
        <p className="hero__subtitle">
          Khám phá & lưu sản phẩm yêu thích với{' '}
          <span className="hero__zustand-badge">Zustand</span>
        </p>
      </div>

      {/* Main content */}
      <main className="main-content">
        <ProductList />
      </main>

      {/* Sidebars */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <FavoritesSidebar isOpen={isFavOpen} onClose={() => setIsFavOpen(false)} />
    </div>
  );
}

export default App;
