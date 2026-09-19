import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchProducts, setSelectedCategory, setSearchQuery } from './productsSlice';
import { addToCart } from '../cart/cartSlice';
import { selectIsInCart } from '../cart/cartSelectors';
import { useGetProductsQuery } from './productsApi';
import type { RootState } from '../../app/store';

// Selector lấy categories không trùng lặp
const selectAllCategories = (state: RootState) => {
  const cats = state.products.items.map((p) => p.category);
  return ['Tất cả', ...Array.from(new Set(cats))];
};

// Selector lấy sản phẩm đã lọc
const selectFilteredProducts = (state: RootState) => {
  const { items, selectedCategory, searchQuery } = state.products;
  return items.filter((p) => {
    const matchCat =
      selectedCategory === 'Tất cả' || p.category === selectedCategory;
    const matchSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });
};

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

function ProductCard({ product }: { product: ReturnType<typeof selectFilteredProducts>[0] }) {
  const dispatch = useAppDispatch();
  const isInCart = useAppSelector(selectIsInCart(product.id));

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      })
    );
  };

  return (
    <article className="product-card">
      <div className="product-card__image-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-card__image"
          loading="lazy"
        />
        <span className="product-card__category">{product.category}</span>
        {product.stock < 15 && (
          <span className="product-card__stock-badge">
            Còn {product.stock}
          </span>
        )}
      </div>
      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__description">{product.description}</p>
        <StarRating rating={product.rating} />
        <div className="product-card__footer">
          <span className="product-card__price">
            {product.price.toLocaleString('vi-VN')} ₫
          </span>
          <button
            id={`add-to-cart-${product.id}`}
            className={`add-to-cart-btn ${isInCart ? 'add-to-cart-btn--in-cart' : ''}`}
            onClick={handleAddToCart}
          >
            {isInCart ? '✓ Đã thêm' : '+ Thêm vào giỏ'}
          </button>
        </div>
      </div>
    </article>
  );
}

export function ProductList() {
  const dispatch = useAppDispatch();

  // ── createAsyncThunk approach ──────────────────────────────────────────────
  const { status, error } = useAppSelector((state) => state.products);
  const categories = useAppSelector(selectAllCategories);
  const filteredProducts = useAppSelector(selectFilteredProducts);
  const selectedCategory = useAppSelector(
    (state) => state.products.selectedCategory
  );
  const searchQuery = useAppSelector((state) => state.products.searchQuery);

  // ── RTK Query approach (điểm cộng) — chạy song song, dùng data để seed store ──
  const { isLoading: rtkLoading } = useGetProductsQuery();

  // Fetch khi component mount (createAsyncThunk)
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const isLoading = status === 'loading' || rtkLoading;

  return (
    <section className="product-list">
      {/* Search & Filter Bar */}
      <div className="filter-bar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            id="search-input"
            type="text"
            className="search-input"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />
        </div>
        <div className="category-chips">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-${cat}`}
              className={`category-chip ${selectedCategory === cat ? 'category-chip--active' : ''}`}
              onClick={() => dispatch(setSelectedCategory(cat))}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* States */}
      {isLoading && (
        <div className="loading-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton skeleton--image" />
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
        <div className="empty-state">
          <p>🔎 Không tìm thấy sản phẩm phù hợp</p>
        </div>
      )}

      {/* Product Grid */}
      {status === 'succeeded' && filteredProducts.length > 0 && (
        <>
          <p className="result-count">
            Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm
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
