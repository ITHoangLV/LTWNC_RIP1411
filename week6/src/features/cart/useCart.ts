import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  type CartItem,
} from './cartSlice';
import {
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalPrice,
} from './cartSelectors';

/**
 * Custom Hook: useCart
 * Đóng gói logic tương tác với Redux store của giỏ hàng.
 * Phục vụ cả UI components và bài kiểm thử custom hook.
 */
export function useCart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const totalItems = useAppSelector(selectCartTotalItems);
  const totalPrice = useAppSelector(selectCartTotalPrice);

  return {
    items,
    totalItems,
    totalPrice,
    addToCart: (item: Omit<CartItem, 'quantity'>) => dispatch(addToCart(item)),
    removeFromCart: (id: string) => dispatch(removeFromCart(id)),
    updateQuantity: (id: string, quantity: number) =>
      dispatch(updateQuantity({ id, quantity })),
    clearCart: () => dispatch(clearCart()),
    isInCart: (id: string) => items.some((item) => item.id === id),
  };
}
