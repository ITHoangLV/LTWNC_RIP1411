/**
 * useCart.test.tsx
 * ────────────────
 * Unit tests cho custom hook `useCart` (sử dụng renderHook từ React Testing Library)
 * Đáp ứng yêu cầu bài tập: unit test cho hook với Redux store.
 */

import { act } from '@testing-library/react';
import { useCart } from './useCart';
import { renderHookWithStore } from '../../test-utils/renderWithStore';
import type { CartItem } from './cartSlice';

const mockProductA: Omit<CartItem, 'quantity'> = {
  id: 'prod-hook-1',
  name: 'Bàn phím cơ Aula F75',
  price: 1200000,
  image: 'https://example.com/aula.jpg',
};

const mockProductB: Omit<CartItem, 'quantity'> = {
  id: 'prod-hook-2',
  name: 'Chuột Logitech G Pro X',
  price: 2500000,
  image: 'https://example.com/gpro.jpg',
};

describe('useCart — Custom Hook Tests (renderHook)', () => {
  it('Hook trả về state mặc định chính xác khi giỏ rỗng', () => {
    const { result } = renderHookWithStore(() => useCart());

    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
    expect(result.current.isInCart('prod-hook-1')).toBe(false);
  });

  it('addToCart — thêm sản phẩm và cập nhật totalItems, totalPrice', () => {
    const { result } = renderHookWithStore(() => useCart());

    act(() => {
      result.current.addToCart(mockProductA);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('prod-hook-1');
    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalPrice).toBe(1200000);
    expect(result.current.isInCart('prod-hook-1')).toBe(true);
  });

  it('updateQuantity — cập nhật số lượng và tính lại tổng tiền qua hook', () => {
    const { result } = renderHookWithStore(() => useCart(), {
      cart: { items: [{ ...mockProductA, quantity: 1 }] },
    });

    act(() => {
      result.current.updateQuantity('prod-hook-1', 3);
    });

    expect(result.current.items[0].quantity).toBe(3);
    expect(result.current.totalItems).toBe(3);
    expect(result.current.totalPrice).toBe(3600000);
  });

  it('removeFromCart — xóa sản phẩm khỏi giỏ qua hook', () => {
    const { result } = renderHookWithStore(() => useCart(), {
      cart: {
        items: [
          { ...mockProductA, quantity: 1 },
          { ...mockProductB, quantity: 2 },
        ],
      },
    });

    expect(result.current.items).toHaveLength(2);

    act(() => {
      result.current.removeFromCart('prod-hook-1');
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('prod-hook-2');
    expect(result.current.isInCart('prod-hook-1')).toBe(false);
    expect(result.current.isInCart('prod-hook-2')).toBe(true);
  });

  it('clearCart — xóa toàn bộ giỏ hàng qua hook', () => {
    const { result } = renderHookWithStore(() => useCart(), {
      cart: {
        items: [
          { ...mockProductA, quantity: 2 },
          { ...mockProductB, quantity: 1 },
        ],
      },
    });

    expect(result.current.totalItems).toBe(3);

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });
});
