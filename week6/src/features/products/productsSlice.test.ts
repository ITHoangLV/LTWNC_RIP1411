/**
 * productsSlice.test.ts
 * ──────────────────────
 * Unit + Async tests cho productsSlice (TC-10 → TC-11)
 *
 * TC-11 là test BẤT ĐỒNG BỘ (async) với API được MOCK:
 * - jest.mock('./mockData') thay thế MOCK_PRODUCTS bằng dữ liệu giả
 * - jest.useFakeTimers() thay thế setTimeout để không cần chờ 800ms thật
 * - Kiểm tra chuỗi trạng thái: idle → loading (pending) → succeeded (fulfilled)
 */

import { configureStore } from '@reduxjs/toolkit';
import productsReducer, {
  fetchProducts,
  setSelectedCategory,
  setSearchQuery,
} from './productsSlice';

// ─── MOCK: thay thế ./mockData bằng 1 sản phẩm test ──────────────────────────
// jest.mock() được HOISTED tự động lên đầu file bởi Babel/ts-jest
// → module mockData sẽ dùng dữ liệu mock này khi productsSlice.ts import nó
jest.mock('./mockData', () => ({
  MOCK_PRODUCTS: [
    {
      id: 'test-prod-1',
      name: 'Test MacBook',
      price: 1000000,
      stock: 5,
      category: 'Laptop',
      description: 'Mock product for testing',
      image: '',
      rating: 4.5,
    },
    {
      id: 'test-prod-2',
      name: 'Test iPhone',
      price: 500000,
      stock: 10,
      category: 'Điện thoại',
      description: 'Mock phone for testing',
      image: '',
      rating: 4.2,
    },
  ],
}));

// ─── Helper: tạo store chỉ với productsReducer ────────────────────────────────
function buildProductsStore() {
  return configureStore({
    reducer: { products: productsReducer },
  });
}

// ─── Test Suite ────────────────────────────────────────────────────────────────
describe('productsSlice — Unit & Async Tests', () => {
  // ── TC-10 ──────────────────────────────────────────────────────────────────
  describe('TC-10: Synchronous reducers', () => {
    it('setSearchQuery — cập nhật searchQuery trong state', () => {
      const store = buildProductsStore();

      store.dispatch(setSearchQuery('MacBook'));

      expect(store.getState().products.searchQuery).toBe('MacBook');
    });

    it('setSelectedCategory — cập nhật selectedCategory trong state', () => {
      const store = buildProductsStore();

      store.dispatch(setSelectedCategory('Laptop'));

      expect(store.getState().products.selectedCategory).toBe('Laptop');
    });

    it('initialState — state khởi đầu đúng giá trị mặc định', () => {
      const store = buildProductsStore();
      const { status, items, error, selectedCategory, searchQuery } =
        store.getState().products;

      expect(status).toBe('idle');
      expect(items).toEqual([]);
      expect(error).toBeNull();
      expect(selectedCategory).toBe('Tất cả');
      expect(searchQuery).toBe('');
    });
  });

  // ── TC-11 ──────────────────────────────────────────────────────────────────
  describe('TC-11: fetchProducts — Async Thunk với API Mock', () => {
    // Dùng fake timers để bypass setTimeout(800ms) trong thunk
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('pending: status chuyển sang "loading" ngay sau khi dispatch', () => {
      const store = buildProductsStore();

      // Dispatch nhưng KHÔNG await → bắt trạng thái intermediate
      store.dispatch(fetchProducts());

      // Ngay sau dispatch, thunk đang chạy → status = 'loading'
      expect(store.getState().products.status).toBe('loading');
      expect(store.getState().products.error).toBeNull();

      // Advance timers để resolve setTimeout trong thunk
      jest.runAllTimers();
    });

    it('fulfilled: sau khi resolve, state.items nhận đúng dữ liệu mock', async () => {
      const store = buildProductsStore();

      // Bắt đầu dispatch
      const thunkPromise = store.dispatch(fetchProducts());

      // Advance fake timers → setTimeout(resolve, 800) sẽ resolve ngay
      jest.runAllTimers();

      // Đợi thunk hoàn thành
      await thunkPromise;

      const state = store.getState().products;
      expect(state.status).toBe('succeeded');
      expect(state.items).toHaveLength(2); // mock data có 2 sản phẩm
      expect(state.items[0].id).toBe('test-prod-1');
      expect(state.items[0].name).toBe('Test MacBook');
      expect(state.items[1].id).toBe('test-prod-2');
      expect(state.error).toBeNull();
    });

    it('rejected: dispatch rejected action trực tiếp → state.status = "failed"', () => {
      // Cách chính xác nhất để test extraReducers "rejected" branch:
      // dispatch trực tiếp action object được tạo bởi fetchProducts.rejected()
      // (không cần thực sự làm thunk fail)
      const store = buildProductsStore();

      const errorMessage = 'Không thể tải sản phẩm';
      const rejectedAction = fetchProducts.rejected(
        new Error(errorMessage),
        'test-request-id'
      );
      store.dispatch(rejectedAction);

      const state = store.getState().products;
      expect(state.status).toBe('failed');
      expect(state.error).toBe(errorMessage);
    });
  });
});
