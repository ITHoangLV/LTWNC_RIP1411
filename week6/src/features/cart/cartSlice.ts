import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

// ─── Slice ────────────────────────────────────────────────────────────────────
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] } as CartState,
  reducers: {
    /**
     * Thêm sản phẩm vào giỏ:
     * - Nếu đã có → tăng quantity lên 1
     * - Nếu chưa có → thêm mới với quantity = 1
     * Immer cho phép "mutate" state trực tiếp một cách an toàn
     */
    addToCart(state, action: PayloadAction<Omit<CartItem, 'quantity'>>) {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },

    /**
     * Xoá sản phẩm khỏi giỏ theo id
     */
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    /**
     * Cập nhật số lượng của một sản phẩm cụ thể
     * Số lượng tối thiểu là 1
     */
    updateQuantity(
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
    },

    /**
     * Xoá toàn bộ giỏ hàng
     */
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
