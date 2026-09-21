import { create } from 'zustand';

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  ZUSTAND FAVORITES STORE                                     ║
 * ║  Week 4 — LTWNC 2026                                        ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * Zustand dùng mô hình "single hook" — không cần:
 *   ✗ Provider bọc ngoài App
 *   ✗ Reducer / Action Creator / PayloadAction boilerplate
 *   ✗ combineReducers hay configureStore
 *
 * Chỉ cần gọi create() và truy cập store ở bất kỳ component nào.
 */

interface FavoritesState {
  /** Set<string> chứa id của các sản phẩm yêu thích */
  favoriteIds: Set<string>;

  /** Thêm vào / bỏ ra khỏi danh sách yêu thích */
  toggleFavorite: (productId: string) => void;

  /** Kiểm tra xem sản phẩm có đang được yêu thích không */
  isFavorite: (productId: string) => boolean;

  /** Xóa toàn bộ danh sách yêu thích */
  clearFavorites: () => void;

  /** Tổng số sản phẩm yêu thích */
  count: () => number;
}

export const useFavoritesStore = create<FavoritesState>()((set, get) => ({
  favoriteIds: new Set<string>(),

  toggleFavorite: (productId: string) => {
    set((state) => {
      // Tạo Set mới thay vì mutate để trigger re-render
      const next = new Set(state.favoriteIds);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return { favoriteIds: next };
    });
  },

  isFavorite: (productId: string) => {
    return get().favoriteIds.has(productId);
  },

  clearFavorites: () => {
    set({ favoriteIds: new Set<string>() });
  },

  count: () => {
    return get().favoriteIds.size;
  },
}));
