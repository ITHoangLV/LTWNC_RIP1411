/**
 * ProductListBefore.tsx
 * =====================
 * ⚠️  PHIÊN BẢN CHƯA TỐI ƯU — dùng để đo Lighthouse TRƯỚC khi tối ưu
 *
 * Các vấn đề hiệu năng CỐ Ý để lại:
 * 1. ❌ Render TẤT CẢ 10.000 <ProductCard> vào DOM cùng lúc (không virtualization)
 * 2. ❌ KHÔNG dùng React.memo → mọi state thay đổi đều re-render toàn bộ
 * 3. ❌ Selector KHÔNG memoize → tạo array mới mỗi lần render
 * 4. ❌ KHÔNG debounce search → filter 10k items mỗi keystroke
 * 5. ❌ Images loading="eager" → tải tất cả ảnh ngay lập tức
 * 6. ❌ Category selector inline → recompute Set mỗi render
 */

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchProducts,
  setSelectedCategory,
  setSearchQuery,
} from './productsSlice';
import { addToCart } from '../cart/cartSlice';
import type { RootState } from '../../app/store';
import type { Product } from './product.type';

// ── ❌ KHÔNG dùng React.memo ────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= Math.round(rating) ? 'star--filled' : ''}`}
        >
          ★
        </span>
      ))}
      <span className="rating-value">{rating}</span>
    </div>
  );
}

// ── ❌ KHÔNG dùng React.memo → re-render khi bất kỳ state nào thay đổi ──────
function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();

  // ❌ Inline selector → mỗi ProductCard subscribe vào TOÀN BỘ cart state
  // Khi cart thay đổi → TẤT CẢ 10.000 ProductCard re-render
  const isInCart = useAppSelector(
    (state: RootState) => state.cart.items.some((item) => item.id === product.id)
  );

  return (
    <article className="product-card">
      <div className="product-card__image-wrap">
        {/* ❌ loading="eager" — tải tất cả ảnh ngay, không lazy load */}
        <img
          src={product.image}
          alt={product.name}
          className="product-card__image"
          loading="eager"
        />
        <span className="product-card__category">{product.category}</span>
        {product.stock < 10 && (
          <span className="product-card__stock-badge">Còn {product.stock}</span>
        )}
      </div>
      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__desc">{product.description}</p>
        {/* ❌ StarRating không memo → re-render cùng với ProductCard */}
        <StarRating rating={product.rating} />
        <div className="product-card__footer">
          <span className="product-card__price">
            {product.price.toLocaleString('vi-VN')} ₫
          </span>
          <button
            id={`add-cart-before-${product.id}`}
            className={`btn-cart ${isInCart ? 'btn-cart--active' : ''}`}
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
            {isInCart ? '✓ Đã thêm' : '+ Thêm giỏ'}
          </button>
        </div>
      </div>
    </article>
  );
}

// ── ProductList chưa tối ưu ─────────────────────────────────────────────────
export function ProductListBefore() {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((s) => s.products);

  // ❌ Selector KHÔNG memoize → tạo array mới mỗi render, gây re-render thừa
  const filteredProducts = useAppSelector((state: RootState) => {
    const { items, selectedCategory, searchQuery } = state.products;
    return items.filter((p) => {
      const matchCat = selectedCategory === 'Tất cả' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  });

  // ❌ Category selector inline → recompute Set(10k) mỗi render
  const categories = useAppSelector((state: RootState) => {
    const cats = state.products.items.map((p) => p.category);
    return ['Tất cả', ...Array.from(new Set(cats))];
  });

  const selectedCategory = useAppSelector((s) => s.products.selectedCategory);
  const searchQuery = useAppSelector((s) => s.products.searchQuery);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts());
  }, [status, dispatch]);

  return (
    <section className="product-list">
      {/* Banner cảnh báo */}
      <div className="perf-banner perf-banner--before">
        <span className="perf-banner__icon">⚠️</span>
        <div>
          <strong>Phiên bản CHƯA tối ưu</strong>
          <p>Render trực tiếp <strong>{filteredProducts.length.toLocaleString()}</strong> sản phẩm vào DOM · Không memo · Không virtualization · Không debounce</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="filter-bar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          {/* ❌ dispatch trực tiếp mỗi keystroke — KHÔNG debounce */}
          <input
            id="search-before"
            type="text"
            className="search-input"
            placeholder="Tìm kiếm sản phẩm... (không có debounce)"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />
        </div>
        <div className="category-chips">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`chip ${selectedCategory === cat ? 'chip--active' : ''}`}
              onClick={() => dispatch(setSelectedCategory(cat))}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading skeleton */}
      {status === 'loading' && (
        <div className="skeleton-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton skeleton--img" />
              <div className="skeleton skeleton--title" />
              <div className="skeleton skeleton--text" />
              <div className="skeleton skeleton--btn" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>⚠️ {error}</p>
          <button onClick={() => dispatch(fetchProducts())}>Thử lại</button>
        </div>
      )}

      {status === 'succeeded' && filteredProducts.length === 0 && (
        <div className="empty-state">🔎 Không tìm thấy sản phẩm phù hợp</div>
      )}

      {/* ❌ Render TẤT CẢ vào DOM — không virtualization */}
      {status === 'succeeded' && filteredProducts.length > 0 && (
        <>
          <p className="result-count">
            Đang render <strong>{filteredProducts.length.toLocaleString()}</strong> sản phẩm
            <span className="result-count__warn"> (tất cả vào DOM)</span>
          </p>
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
