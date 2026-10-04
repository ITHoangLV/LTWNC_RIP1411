/**
 * ProductListAfter.tsx
 * ====================
 * ✅ PHIÊN BẢN ĐÃ TỐI ƯU — dùng để đo Lighthouse SAU khi tối ưu
 *
 * Các kỹ thuật tối ưu đã áp dụng:
 * 1. ✅ Virtualization (react-window FixedSizeGrid) → chỉ render ~20 DOM nodes thay vì 10.000
 * 2. ✅ Memoization (React.memo + createSelector) → tránh re-render thừa
 * 3. ✅ Debounce Search (300ms) → giảm số lần filter 10k items
 * 4. ✅ Images loading="lazy" → chỉ tải ảnh khi vào viewport
 */

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FixedSizeGrid, type GridChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { createSelector } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchProducts,
  setSelectedCategory,
  setSearchQuery,
} from './productsSlice';
import { addToCart } from '../cart/cartSlice';
import type { RootState } from '../../app/store';
import type { Product } from './product.type';

// ─── Kỹ thuật 2: Memoized Selectors với createSelector ─────────────────────
// createSelector chỉ recompute khi input thay đổi, tránh tạo array mới mỗi render

const selectFilteredProducts = createSelector(
  [
    (state: RootState) => state.products.items,
    (state: RootState) => state.products.selectedCategory,
    (state: RootState) => state.products.searchQuery,
  ],
  (items, selectedCategory, searchQuery) => {
    const q = searchQuery.toLowerCase();
    return items.filter((p) => {
      const matchCat = selectedCategory === 'Tất cả' || p.category === selectedCategory;
      const matchSearch = q === '' || p.name.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }
);

// Memoized selector lấy danh sách categories — chỉ tính lại khi items thay đổi
const selectCategories = createSelector(
  [(state: RootState) => state.products.items],
  (items) => {
    const cats = items.map((p) => p.category);
    return ['Tất cả', ...Array.from(new Set(cats))];
  }
);

// ─── Kỹ thuật 3: useDebounce Hook ──────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ─── Kỹ thuật 2: React.memo trên StarRating ────────────────────────────────
// Sẽ không re-render trừ khi rating thay đổi
const StarRating = memo(function StarRating({ rating }: { rating: number }) {
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
});

// ─── Kỹ thuật 2: React.memo trên ProductCard ───────────────────────────────
// Custom comparator: chỉ re-render khi id hoặc stock thay đổi
const ProductCard = memo(
  function ProductCard({ product }: { product: Product }) {
    const dispatch = useAppDispatch();

    // Boolean selector → React.memo ngăn re-render nếu product không đổi
    const isInCart = useAppSelector(
      (state: RootState) => state.cart.items.some((item) => item.id === product.id)
    );

    const handleAddToCart = useCallback(() => {
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        })
      );
    }, [dispatch, product.id, product.name, product.price, product.image]);

    return (
      <article className="product-card">
        <div className="product-card__image-wrap">
          {/* ✅ loading="lazy" — chỉ tải ảnh khi vào viewport */}
          <img
            src={product.image}
            alt={product.name}
            className="product-card__image"
            loading="lazy"
          />
          <span className="product-card__category">{product.category}</span>
          {product.stock < 10 && (
            <span className="product-card__stock-badge">Còn {product.stock}</span>
          )}
        </div>
        <div className="product-card__body">
          <h3 className="product-card__name">{product.name}</h3>
          <p className="product-card__desc">{product.description}</p>
          <StarRating rating={product.rating} />
          <div className="product-card__footer">
            <span className="product-card__price">
              {product.price.toLocaleString('vi-VN')} ₫
            </span>
            <button
              id={`add-cart-after-${product.id}`}
              className={`btn-cart ${isInCart ? 'btn-cart--active' : ''}`}
              onClick={handleAddToCart}
            >
              {isInCart ? '✓ Đã thêm' : '+ Thêm giỏ'}
            </button>
          </div>
        </div>
      </article>
    );
  },
  // Custom comparator — tránh re-render nếu sản phẩm không thay đổi
  (prev, next) =>
    prev.product.id === next.product.id &&
    prev.product.stock === next.product.stock
);

// ─── Kỹ thuật 1: Cell Renderer cho react-window ──────────────────────────
interface CellData {
  products: Product[];
  columnCount: number;
  columnWidth: number;
  gap: number;
}

const GridCell = memo(
  function GridCell({ columnIndex, rowIndex, style, data }: GridChildComponentProps<CellData>) {
    const { products, columnCount, columnWidth, gap } = data;
    const index = rowIndex * columnCount + columnIndex;
    if (index >= products.length) return null;

    // Áp dụng gap giữa các card
    const adjustedStyle = {
      ...style,
      left: Number(style.left) + columnIndex * gap,
      top: Number(style.top) + rowIndex * gap,
      width: columnWidth - gap,
      height: Number(style.height) - gap,
      padding: '4px',
    };

    return (
      <div style={adjustedStyle}>
        <ProductCard product={products[index]} />
      </div>
    );
  }
);

// ─── ProductList đã tối ưu ──────────────────────────────────────────────────
const CARD_HEIGHT = 360;
const GAP = 16;

export function ProductListAfter() {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((s) => s.products);

  // ✅ createSelector — chỉ recompute khi data thực sự thay đổi
  const filteredProducts = useAppSelector(selectFilteredProducts);
  const categories = useAppSelector(selectCategories);
  const selectedCategory = useAppSelector((s) => s.products.selectedCategory);

  // ✅ Kỹ thuật 3: Debounce — search chỉ dispatch sau 300ms
  const [localSearch, setLocalSearch] = useState('');
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts());
  }, [status, dispatch]);

  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ Memoize itemData để tránh GridCell re-render khi parent render
  const makeItemData = useCallback(
    (colCount: number, colWidth: number): CellData => ({
      products: filteredProducts,
      columnCount: colCount,
      columnWidth: colWidth,
      gap: GAP,
    }),
    [filteredProducts]
  );

  return (
    <section className="product-list">
      {/* Banner thông tin tối ưu */}
      <div className="perf-banner perf-banner--after">
        <span className="perf-banner__icon">✅</span>
        <div>
          <strong>Phiên bản ĐÃ tối ưu</strong>
          <p>
            Virtualization (react-window) · React.memo · createSelector · Debounce 300ms · Lazy Images
            <br />
            DOM nodes hiển thị: <strong>~20</strong> | Tổng data: <strong>10.000</strong> sản phẩm
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="filter-bar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          {/* ✅ Chỉ cập nhật local state, dispatch qua useDebounce */}
          <input
            id="search-after"
            type="text"
            className="search-input"
            placeholder="Tìm kiếm sản phẩm... (debounce 300ms)"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
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

      {/* ✅ Kỹ thuật 1: Virtualized Grid — chỉ render phần tử visible */}
      {status === 'succeeded' && filteredProducts.length > 0 && (
        <>
          <p className="result-count">
            <strong>{filteredProducts.length.toLocaleString()}</strong> sản phẩm
            <span className="result-count__ok"> (chỉ ~20 nodes trong DOM)</span>
          </p>
          {/* ✅ AutoSizer tự động lấy width/height của container */}
          <div ref={containerRef} className="virtual-container">
            <AutoSizer>
              {({ height, width }) => {
                const colCount = Math.max(1, Math.floor(width / 280));
                const colWidth = Math.floor(width / colCount);
                const rowCount = Math.ceil(filteredProducts.length / colCount);
                const itemData = makeItemData(colCount, colWidth);

                return (
                  <FixedSizeGrid
                    columnCount={colCount}
                    columnWidth={colWidth}
                    height={height}
                    rowCount={rowCount}
                    rowHeight={CARD_HEIGHT + GAP}
                    width={width}
                    itemData={itemData}
                    overscanRowCount={2}
                  >
                    {GridCell}
                  </FixedSizeGrid>
                );
              }}
            </AutoSizer>
          </div>
        </>
      )}
    </section>
  );
}
