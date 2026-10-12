/**
 * cartSlice.test.ts
 * ─────────────────
 * Unit tests cho cartSlice reducer (TC-01 → TC-06)
 * Kiểm thử thuần túy: reducer là pure function, không cần render component hay store.
 */

import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  type CartItem,
} from './cartSlice';

// ─── Dữ liệu dùng chung ────────────────────────────────────────────────────────
const mockItemA: Omit<CartItem, 'quantity'> = {
  id: 'prod-1',
  name: 'MacBook Pro 14"',
  price: 52990000,
  image: 'https://example.com/macbook.jpg',
};

const mockItemB: Omit<CartItem, 'quantity'> = {
  id: 'prod-2',
  name: 'iPhone 16 Pro',
  price: 29990000,
  image: 'https://example.com/iphone.jpg',
};

const mockItemC: Omit<CartItem, 'quantity'> = {
  id: 'prod-3',
  name: 'Sony WH-1000XM5',
  price: 8490000,
  image: 'https://example.com/sony.jpg',
};

// ─── Test Suite ────────────────────────────────────────────────────────────────
describe('cartSlice — Unit Tests (Reducer)', () => {
  // ── TC-01 ──────────────────────────────────────────────────────────────────
  it('TC-01: addToCart — thêm sản phẩm mới với quantity = 1', () => {
    // Bắt đầu từ state ban đầu (undefined → initialState)
    const state = cartReducer(undefined, addToCart(mockItemA));

    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe('prod-1');
    expect(state.items[0].name).toBe('MacBook Pro 14"');
    expect(state.items[0].price).toBe(52990000);
    expect(state.items[0].quantity).toBe(1);
  });

  // ── TC-02 ──────────────────────────────────────────────────────────────────
  it('TC-02: addToCart — tăng quantity khi sản phẩm đã có (không duplicate)', () => {
    // Dispatch cùng item 2 lần
    let state = cartReducer(undefined, addToCart(mockItemA));
    state = cartReducer(state, addToCart(mockItemA));

    // Vẫn chỉ có 1 item trong danh sách
    expect(state.items).toHaveLength(1);
    // Nhưng quantity đã tăng lên 2
    expect(state.items[0].quantity).toBe(2);
  });

  // ── TC-03 ──────────────────────────────────────────────────────────────────
  it('TC-03: removeFromCart — xóa đúng item theo id, giữ lại item khác', () => {
    // Thêm 2 sản phẩm
    let state = cartReducer(undefined, addToCart(mockItemA));
    state = cartReducer(state, addToCart(mockItemB));
    expect(state.items).toHaveLength(2);

    // Xóa item A
    state = cartReducer(state, removeFromCart('prod-1'));

    // Chỉ còn item B
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe('prod-2');
  });

  // ── TC-04 ──────────────────────────────────────────────────────────────────
  it('TC-04: updateQuantity — cập nhật số lượng hợp lệ (> 1)', () => {
    let state = cartReducer(undefined, addToCart(mockItemA));
    // Tăng lên 5
    state = cartReducer(state, updateQuantity({ id: 'prod-1', quantity: 5 }));

    expect(state.items[0].quantity).toBe(5);
  });

  // ── TC-05 ──────────────────────────────────────────────────────────────────
  it('TC-05: updateQuantity — không cho quantity xuống dưới 1 (Math.max guard)', () => {
    let state = cartReducer(undefined, addToCart(mockItemA));
    // Cố tình set về 0
    state = cartReducer(state, updateQuantity({ id: 'prod-1', quantity: 0 }));

    // Math.max(1, 0) = 1 → giữ nguyên ở 1
    expect(state.items[0].quantity).toBe(1);

    // Thử set về -5
    state = cartReducer(state, updateQuantity({ id: 'prod-1', quantity: -5 }));
    expect(state.items[0].quantity).toBe(1);
  });

  // ── TC-06 ──────────────────────────────────────────────────────────────────
  it('TC-06: clearCart — xóa toàn bộ giỏ hàng về mảng rỗng', () => {
    // Thêm 3 sản phẩm
    let state = cartReducer(undefined, addToCart(mockItemA));
    state = cartReducer(state, addToCart(mockItemB));
    state = cartReducer(state, addToCart(mockItemC));
    expect(state.items).toHaveLength(3);

    // Clear toàn bộ
    state = cartReducer(state, clearCart());

    expect(state.items).toHaveLength(0);
    expect(state.items).toEqual([]);
  });
});
