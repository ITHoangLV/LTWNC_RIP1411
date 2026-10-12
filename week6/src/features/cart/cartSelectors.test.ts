/**
 * cartSelectors.test.ts
 * ──────────────────────
 * Unit tests cho cartSelectors (TC-07 → TC-09)
 * Selector là pure function: nhận state → trả về giá trị tính toán.
 * Dùng "as unknown as RootState" để tạo mock state tối giản mà không cần
 * khởi tạo toàn bộ store (tránh boilerplate không cần thiết).
 */

import {
  selectCartTotalItems,
  selectCartTotalPrice,
  selectCartItems,
  selectIsInCart,
} from './cartSelectors';
import type { RootState } from '../../app/store';
import type { CartItem } from './cartSlice';

// ─── Helper: tạo mock RootState chỉ với phần cart ─────────────────────────────
function buildMockState(items: CartItem[]): RootState {
  return { cart: { items } } as unknown as RootState;
}

// ─── Dữ liệu dùng chung ────────────────────────────────────────────────────────
const itemA: CartItem = {
  id: 'prod-1',
  name: 'MacBook Pro',
  price: 52990000,
  image: '',
  quantity: 2,
};

const itemB: CartItem = {
  id: 'prod-2',
  name: 'iPhone 16 Pro',
  price: 29990000,
  image: '',
  quantity: 3,
};

// ─── Test Suite ────────────────────────────────────────────────────────────────
describe('cartSelectors — Unit Tests', () => {
  // ── TC-07 ──────────────────────────────────────────────────────────────────
  it('TC-07: selectCartTotalItems — tính tổng số lượng tất cả items', () => {
    // itemA: qty=2, itemB: qty=3 → tổng = 5
    const state = buildMockState([itemA, itemB]);
    expect(selectCartTotalItems(state)).toBe(5);
  });

  it('TC-07b: selectCartTotalItems — giỏ rỗng trả về 0', () => {
    const state = buildMockState([]);
    expect(selectCartTotalItems(state)).toBe(0);
  });

  // ── TC-08 ──────────────────────────────────────────────────────────────────
  it('TC-08: selectCartTotalPrice — tính tổng tiền chính xác', () => {
    // itemA: 52.990.000 × 2 = 105.980.000
    // itemB: 29.990.000 × 3 = 89.970.000
    // Tổng = 195.950.000
    const state = buildMockState([itemA, itemB]);
    const expected = 52990000 * 2 + 29990000 * 3;
    expect(selectCartTotalPrice(state)).toBe(expected);
    expect(selectCartTotalPrice(state)).toBe(195950000);
  });

  it('TC-08b: selectCartTotalPrice — giỏ rỗng trả về 0', () => {
    const state = buildMockState([]);
    expect(selectCartTotalPrice(state)).toBe(0);
  });

  // ── TC-09 ──────────────────────────────────────────────────────────────────
  it('TC-09: selectIsInCart — trả về true nếu sản phẩm đã có trong giỏ', () => {
    const state = buildMockState([itemA]);
    expect(selectIsInCart('prod-1')(state)).toBe(true);
  });

  it('TC-09b: selectIsInCart — trả về false nếu sản phẩm chưa có trong giỏ', () => {
    const state = buildMockState([itemA]);
    expect(selectIsInCart('prod-99')(state)).toBe(false);
  });

  it('TC-09c: selectCartItems — trả về đúng mảng items', () => {
    const state = buildMockState([itemA, itemB]);
    expect(selectCartItems(state)).toEqual([itemA, itemB]);
    expect(selectCartItems(state)).toHaveLength(2);
  });
});
