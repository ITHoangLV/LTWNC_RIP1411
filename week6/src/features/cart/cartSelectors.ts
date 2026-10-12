import type { RootState } from '../../app/store';

// Tổng số lượng items trong giỏ
export const selectCartTotalItems = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

// Tổng tiền giỏ hàng
export const selectCartTotalPrice = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

// Lấy toàn bộ items
export const selectCartItems = (state: RootState) => state.cart.items;

// Kiểm tra sản phẩm đã có trong giỏ chưa
export const selectIsInCart = (productId: string) => (state: RootState) =>
  state.cart.items.some((item) => item.id === productId);
