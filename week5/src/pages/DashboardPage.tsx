/**
 * DashboardPage.tsx
 * =================
 * ✅ Kỹ thuật: Code Splitting với React.lazy
 *
 * Page này được import bằng React.lazy() trong App.tsx
 * → Chỉ load chunk JS này khi người dùng click tab "Dashboard"
 * → Giảm initial bundle size, cải thiện FCP
 */

import { useMemo } from 'react';
import { useAppSelector } from '../app/hooks';
import { CATEGORIES, MOCK_PRODUCTS } from '../features/products/mockData';

// Thống kê tính toán từ 10.000 sản phẩm
function useDashboardStats() {
  return useMemo(() => {
    const products = MOCK_PRODUCTS;

    const totalProducts = products.length;
    const avgPrice = Math.round(
      products.reduce((s, p) => s + p.price, 0) / totalProducts
    );
    const avgRating =
      Math.round((products.reduce((s, p) => s + p.rating, 0) / totalProducts) * 10) / 10;

    const maxPrice = Math.max(...products.map((p) => p.price));
    const minPrice = Math.min(...products.map((p) => p.price));

    // Đếm theo category
    const byCat = CATEGORIES.map((cat) => ({
      name: cat,
      count: products.filter((p) => p.category === cat).length,
    })).sort((a, b) => b.count - a.count);

    // Top 5 sản phẩm đánh giá cao nhất
    const top5 = [...products].sort((a, b) => b.rating - a.rating).slice(0, 5);

    // Phân phối giá (price brackets)
    const brackets = [
      { label: '< 5M', min: 0, max: 5_000_000 },
      { label: '5M–15M', min: 5_000_000, max: 15_000_000 },
      { label: '15M–30M', min: 15_000_000, max: 30_000_000 },
      { label: '30M–60M', min: 30_000_000, max: 60_000_000 },
      { label: '> 60M', min: 60_000_000, max: Infinity },
    ].map((b) => ({
      ...b,
      count: products.filter((p) => p.price >= b.min && p.price < b.max).length,
    }));

    return { totalProducts, avgPrice, avgRating, maxPrice, minPrice, byCat, top5, brackets };
  }, []);
}

export default function DashboardPage() {
  const cartCount = useAppSelector((s) => s.cart.items.length);
  const { totalProducts, avgPrice, avgRating, maxPrice, minPrice, byCat, top5, brackets } =
    useDashboardStats();

  const maxCatCount = Math.max(...byCat.map((c) => c.count));
  const maxBracketCount = Math.max(...brackets.map((b) => b.count));

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h2 className="dashboard__title">📊 Dashboard Thống kê</h2>
        <p className="dashboard__sub">
          Phân tích <strong>10.000 sản phẩm</strong> · Module này được load bằng{' '}
          <code>React.lazy()</code> (Code Splitting)
        </p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card kpi-card--purple">
          <span className="kpi-card__icon">📦</span>
          <div className="kpi-card__value">{totalProducts.toLocaleString()}</div>
          <div className="kpi-card__label">Tổng sản phẩm</div>
        </div>
        <div className="kpi-card kpi-card--cyan">
          <span className="kpi-card__icon">💰</span>
          <div className="kpi-card__value">{(avgPrice / 1_000_000).toFixed(1)}M ₫</div>
          <div className="kpi-card__label">Giá trung bình</div>
        </div>
        <div className="kpi-card kpi-card--amber">
          <span className="kpi-card__icon">⭐</span>
          <div className="kpi-card__value">{avgRating}</div>
          <div className="kpi-card__label">Rating trung bình</div>
        </div>
        <div className="kpi-card kpi-card--green">
          <span className="kpi-card__icon">🛒</span>
          <div className="kpi-card__value">{cartCount}</div>
          <div className="kpi-card__label">Sản phẩm trong giỏ</div>
        </div>
      </div>

      <div className="dashboard__charts">
        {/* Phân phối theo Category */}
        <div className="chart-card">
          <h3 className="chart-card__title">Phân phối theo danh mục</h3>
          <div className="bar-chart">
            {byCat.map((cat) => (
              <div key={cat.name} className="bar-chart__row">
                <span className="bar-chart__label">{cat.name}</span>
                <div className="bar-chart__track">
                  <div
                    className="bar-chart__fill"
                    style={{ width: `${(cat.count / maxCatCount) * 100}%` }}
                  />
                </div>
                <span className="bar-chart__count">{cat.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Phân phối giá */}
        <div className="chart-card">
          <h3 className="chart-card__title">Phân phối giá</h3>
          <div className="bar-chart">
            {brackets.map((b) => (
              <div key={b.label} className="bar-chart__row">
                <span className="bar-chart__label">{b.label}</span>
                <div className="bar-chart__track">
                  <div
                    className="bar-chart__fill bar-chart__fill--cyan"
                    style={{ width: `${(b.count / maxBracketCount) * 100}%` }}
                  />
                </div>
                <span className="bar-chart__count">{b.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top 5 sản phẩm */}
      <div className="chart-card">
        <h3 className="chart-card__title">🏆 Top 5 sản phẩm rating cao nhất</h3>
        <div className="top5-list">
          {top5.map((p, i) => (
            <div key={p.id} className="top5-item">
              <span className="top5-item__rank">#{i + 1}</span>
              <img src={p.image} alt={p.name} className="top5-item__img" loading="lazy" />
              <div className="top5-item__info">
                <strong>{p.name}</strong>
                <span>{p.category}</span>
              </div>
              <div className="top5-item__rating">⭐ {p.rating}</div>
              <div className="top5-item__price">
                {p.price.toLocaleString('vi-VN')} ₫
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="kpi-grid kpi-grid--2">
        <div className="kpi-card kpi-card--red">
          <span className="kpi-card__icon">📈</span>
          <div className="kpi-card__value">{(maxPrice / 1_000_000).toFixed(1)}M ₫</div>
          <div className="kpi-card__label">Giá cao nhất</div>
        </div>
        <div className="kpi-card kpi-card--blue">
          <span className="kpi-card__icon">📉</span>
          <div className="kpi-card__value">{(minPrice / 1_000_000).toFixed(1)}M ₫</div>
          <div className="kpi-card__label">Giá thấp nhất</div>
        </div>
      </div>
    </div>
  );
}
