import type { Product } from './product.type';

// ─── Dữ liệu tĩnh để tạo tên sản phẩm ─────────────────────────────────────
const BRANDS = [
  'Apple', 'Samsung', 'Sony', 'ASUS', 'Dell',
  'HP', 'Lenovo', 'Xiaomi', 'LG', 'Razer',
];

const PRODUCT_TYPES = [
  'Laptop', 'Smartphone', 'Tablet', 'Headphone',
  'Smartwatch', 'Monitor', 'Speaker', 'Camera', 'Keyboard', 'Mouse',
];

const ADJECTIVES = [
  'Pro', 'Max', 'Ultra', 'Plus', 'Elite',
  'Premium', 'Air', 'Mini', 'Lite', 'X',
];

export const CATEGORIES = [
  'Laptop', 'Điện thoại', 'Máy tính bảng', 'Tai nghe',
  'Đồng hồ thông minh', 'TV & Màn hình', 'Gaming', 'Camera', 'Phụ kiện', 'Âm thanh',
];

const CATEGORY_MAP: Record<string, string> = {
  Laptop: 'Laptop',
  Smartphone: 'Điện thoại',
  Tablet: 'Máy tính bảng',
  Headphone: 'Tai nghe',
  Smartwatch: 'Đồng hồ thông minh',
  Monitor: 'TV & Màn hình',
  Speaker: 'Âm thanh',
  Camera: 'Camera',
  Keyboard: 'Gaming',
  Mouse: 'Gaming',
};

// Hàm tạo giá ngẫu nhiên có hạt giống (deterministic)
function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

/**
 * Generator 10.000 sản phẩm — dùng deterministic random để kết quả nhất quán.
 */
export function generateProducts(count = 10_000): Product[] {
  return Array.from({ length: count }, (_, i) => {
    const brand = BRANDS[i % BRANDS.length];
    const type = PRODUCT_TYPES[Math.floor(i / BRANDS.length) % PRODUCT_TYPES.length];
    const adj = ADJECTIVES[Math.floor(i / (BRANDS.length * PRODUCT_TYPES.length)) % ADJECTIVES.length];
    const gen = Math.floor(i / (BRANDS.length * PRODUCT_TYPES.length * ADJECTIVES.length)) + 1;
    const suffix = gen > 1 ? ` Gen${gen}` : '';

    const basePrice = 500_000 + Math.floor(seededRandom(i * 7) * 79_500_000);
    const roundedPrice = Math.round(basePrice / 1_000) * 1_000;

    return {
      id: `prod-${i + 1}`,
      name: `${brand} ${type} ${adj}${suffix}`,
      price: roundedPrice,
      stock: Math.floor(seededRandom(i * 13) * 100) + 1,
      category: CATEGORY_MAP[type],
      description: `${brand} ${type} ${adj} — hiệu năng vượt trội với công nghệ tiên tiến nhất. Model #${i + 1}.`,
      // Dùng picsum.photos với seed để ảnh nhất quán (1–999)
      image: `https://picsum.photos/seed/${(i % 999) + 1}/400/300`,
      rating: Math.round((3.5 + seededRandom(i * 3) * 1.5) * 10) / 10,
    };
  });
}

// Tạo sẵn 10.000 sản phẩm — export dùng cho Redux store
export const MOCK_PRODUCTS: Product[] = generateProducts(10_000);
