import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addToCart } from '../cart/cartSlice';
import { selectIsInCart } from '../cart/cartSelectors';
import { useFavorites } from './useFavorites';
import type { Product } from '../products/product.type';

interface FavoritesSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/*
 * ┌──────────────────────────────────────────────────────────┐
 * │  NHẬN XÉT: Zustand vs Redux Toolkit (5–7 dòng)          │
 * ├──────────────────────────────────────────────────────────┤
 * │  ƯU — Zustand:                                           │
 * │  • Không cần Provider, slice, action creator —           │
 * │    chỉ cần create() là có store dùng ngay.               │
 * │  • Boilerplate ít hơn ~70%, dễ đọc, dễ onboard.         │
 * │  • Phù hợp cho state cục bộ hoặc feature nhỏ riêng lẻ.  │
 * │  NHƯỢC — Zustand:                                        │
 * │  • Không có DevTools mạnh như Redux (time-travel, diff). │
 * │  • Thiếu middleware pipeline chuẩn (saga, thunk typed).  │
 * │  • Khó enforce pattern nhất quán trong team lớn.         │
 * │  → Kết luận: Zustand tốt cho state đơn giản/cô lập;     │
 * │    Redux Toolkit vẫn chiếm ưu thế cho app phức tạp,     │
 * │    cần audit trail và collaboration tốt hơn.             │
 * └──────────────────────────────────────────────────────────┘
 */

function FavoriteItem({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const { toggleFavorite } = useFavorites();
  const isInCart = useAppSelector(selectIsInCart(product.id));

  return (
    <li className="fav-item">
      <img
        src={product.image}
        alt={product.name}
        className="fav-item__image"
      />
      <div className="fav-item__info">
        <p className="fav-item__name">{product.name}</p>
        <p className="fav-item__category">{product.category}</p>
        <p className="fav-item__price">
          {product.price.toLocaleString('vi-VN')} ₫
        </p>
        <button
          id={`fav-add-cart-${product.id}`}
          className={`fav-item__cart-btn ${isInCart ? 'fav-item__cart-btn--in-cart' : ''}`}
          onClick={() =>
            dispatch(
              addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
              })
            )
          }
        >
          {isInCart ? '✓ Đã có trong giỏ' : '🛒 Thêm vào giỏ'}
        </button>
      </div>
      <button
        className="fav-item__remove-btn"
        onClick={() => toggleFavorite(product.id)}
        aria-label={`Bỏ yêu thích ${product.name}`}
        title="Bỏ yêu thích"
      >
        ✕
      </button>
    </li>
  );
}

export function FavoritesSidebar({ isOpen, onClose }: FavoritesSidebarProps) {
  const { favoriteProducts, count, clearFavorites } = useFavorites();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fav-overlay ${isOpen ? 'fav-overlay--visible' : ''}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={`fav-sidebar ${isOpen ? 'fav-sidebar--open' : ''}`}>
        {/* Header */}
        <div className="fav-header">
          <div className="fav-header__title">
            <span className="fav-header__icon">❤️</span>
            <h2>Yêu thích</h2>
            {count > 0 && (
              <span className="fav-badge">{count}</span>
            )}
          </div>
          <button
            className="fav-close-btn"
            onClick={onClose}
            aria-label="Đóng danh sách yêu thích"
          >
            ✕
          </button>
        </div>

        {/* Zustand tag */}
        <div className="fav-tech-tag">
          <span className="fav-tech-tag__dot" />
          Powered by <strong>Zustand</strong> store
        </div>

        {/* Body */}
        <div className="fav-body">
          {favoriteProducts.length === 0 ? (
            <div className="fav-empty">
              <span className="fav-empty__icon">🤍</span>
              <p>Chưa có sản phẩm yêu thích</p>
              <small>Nhấn ❤ trên sản phẩm để thêm vào đây</small>
            </div>
          ) : (
            <ul className="fav-list">
              {favoriteProducts.map((product) => (
                <FavoriteItem key={product.id} product={product} />
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {favoriteProducts.length > 0 && (
          <div className="fav-footer">
            <p className="fav-footer__count">
              <strong>{count}</strong> sản phẩm yêu thích
            </p>
            <button
              className="fav-clear-btn"
              onClick={clearFavorites}
            >
              Xóa tất cả
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
