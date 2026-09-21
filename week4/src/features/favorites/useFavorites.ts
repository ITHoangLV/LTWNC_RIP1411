import { useMemo } from 'react';
import { useFavoritesStore } from './favoritesStore';
import { MOCK_PRODUCTS } from '../products/mockData';
import type { Product } from '../products/product.type';

/**
 * Custom hook bọc Zustand store — cung cấp API tiện lợi cho các component.
 *
 * Tại sao tách useFavorites ra khỏi favoritesStore?
 *  - Store chỉ giữ raw IDs (nhẹ, serialize được)
 *  - Hook này kết hợp IDs với MOCK_PRODUCTS để trả về Product[] đầy đủ
 *  - useMemo tránh tạo mảng mới mỗi lần render không liên quan
 */
export function useFavorites() {
  const { favoriteIds, toggleFavorite, isFavorite, clearFavorites } =
    useFavoritesStore();

  /** Danh sách Product đầy đủ tương ứng với các ID yêu thích */
  const favoriteProducts: Product[] = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => favoriteIds.has(p.id));
  }, [favoriteIds]);

  return {
    favoriteIds,
    favoriteProducts,
    count: favoriteIds.size,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };
}
