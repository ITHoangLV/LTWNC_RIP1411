/**
 * CartSidebar.test.tsx
 * ─────────────────────
 * Integration tests cho CartSidebar component (TC-12 → TC-14)
 * Dùng React Testing Library (RTL) để render component thật trong JSDOM,
 * tương tác với DOM, và kiểm tra UI phản ánh đúng Redux state.
 */

import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartSidebar } from './CartSidebar';
import { renderWithStore } from '../../test-utils/renderWithStore';
import type { CartItem } from './cartSlice';

// ─── Dữ liệu mock ─────────────────────────────────────────────────────────────
const sampleItem: CartItem = {
  id: 'prod-1',
  name: 'MacBook Pro 14"',
  price: 52990000,
  image: '',
  quantity: 1,
};

const sampleItem2: CartItem = {
  id: 'prod-2',
  name: 'iPhone 16 Pro',
  price: 29990000,
  image: '',
  quantity: 2,
};

// ─── Test Suite ────────────────────────────────────────────────────────────────
describe('CartSidebar — Integration Tests (RTL)', () => {
  // ── TC-12 ──────────────────────────────────────────────────────────────────
  it('TC-12: Render đúng khi giỏ hàng rỗng — hiển thị thông báo trống', () => {
    // preloadedState không có items → giỏ trống
    renderWithStore(<CartSidebar isOpen={true} onClose={() => {}} />);

    // Kiểm tra thông báo giỏ rỗng xuất hiện
    expect(screen.getByText('Giỏ hàng trống')).toBeInTheDocument();
    expect(screen.getByText('Hãy thêm sản phẩm vào giỏ')).toBeInTheDocument();

    // Nút footer không được render khi giỏ rỗng
    expect(screen.queryByText('Xoá tất cả')).not.toBeInTheDocument();
    expect(screen.queryByText('Thanh toán ngay →')).not.toBeInTheDocument();
  });

  // ── TC-13 ──────────────────────────────────────────────────────────────────
  it('TC-13: Render đúng tên sản phẩm và tổng cộng khi có items', () => {
    renderWithStore(
      <CartSidebar isOpen={true} onClose={() => {}} />,
      { cart: { items: [sampleItem, sampleItem2] } }
    );

    // Tên sản phẩm hiển thị đúng
    expect(screen.getByText('MacBook Pro 14"')).toBeInTheDocument();
    expect(screen.getByText('iPhone 16 Pro')).toBeInTheDocument();

    // Tổng số lượng: qty=1 + qty=2 = 3
    // CartSidebar hiển thị: "Tổng cộng (3 sản phẩm)"
    expect(screen.getByText('Tổng cộng (3 sản phẩm)')).toBeInTheDocument();

    // Badge tổng số lượng trong header
    expect(screen.getByText('3')).toBeInTheDocument();

    // Nút footer phải có mặt
    expect(screen.getByText('Xoá tất cả')).toBeInTheDocument();
    expect(screen.getByText('Thanh toán ngay →')).toBeInTheDocument();
  });

  // ── TC-14 ──────────────────────────────────────────────────────────────────
  it('TC-14: Click "Xoá tất cả" → dispatch clearCart → hiển thị giỏ rỗng', async () => {
    const user = userEvent.setup();

    renderWithStore(
      <CartSidebar isOpen={true} onClose={() => {}} />,
      { cart: { items: [sampleItem] } }
    );

    // Trước khi click: sản phẩm đang có
    expect(screen.getByText('MacBook Pro 14"')).toBeInTheDocument();

    // Click nút "Xoá tất cả"
    const clearBtn = screen.getByText('Xoá tất cả');
    await user.click(clearBtn);

    // Sau khi click: hiển thị giỏ hàng trống
    expect(screen.getByText('Giỏ hàng trống')).toBeInTheDocument();
    expect(screen.queryByText('MacBook Pro 14"')).not.toBeInTheDocument();
    expect(screen.queryByText('Xoá tất cả')).not.toBeInTheDocument();
  });

  // ── TC bonus: Tương tác tăng/giảm số lượng ────────────────────────────────
  it('TC-14b: Click "+" → tăng số lượng; Click "−" bị disabled khi qty=1', async () => {
    const user = userEvent.setup();

    renderWithStore(
      <CartSidebar isOpen={true} onClose={() => {}} />,
      { cart: { items: [sampleItem] } } // quantity = 1
    );

    // Nút giảm phải bị disable khi qty=1
    const decreaseBtn = screen.getByLabelText('Giảm số lượng');
    expect(decreaseBtn).toBeDisabled();

    // Click nút tăng
    const increaseBtn = screen.getByLabelText('Tăng số lượng');
    await user.click(increaseBtn);

    // qty tăng lên 2 → "Tổng cộng (2 sản phẩm)"
    expect(screen.getByText('Tổng cộng (2 sản phẩm)')).toBeInTheDocument();

    // Nút giảm bây giờ không còn bị disable
    expect(decreaseBtn).not.toBeDisabled();
  });

  it('TC-14c: Click nút xóa (🗑️) → xóa đúng 1 item khỏi giỏ', async () => {
    const user = userEvent.setup();

    renderWithStore(
      <CartSidebar isOpen={true} onClose={() => {}} />,
      { cart: { items: [sampleItem, sampleItem2] } }
    );

    // Xóa MacBook
    const removeBtn = screen.getByLabelText('Xoá MacBook Pro 14"');
    await user.click(removeBtn);

    // MacBook biến mất, iPhone vẫn còn
    expect(screen.queryByText('MacBook Pro 14"')).not.toBeInTheDocument();
    expect(screen.getByText('iPhone 16 Pro')).toBeInTheDocument();
  });

  it('TC-14d: CartSidebar closed — sidebar có class đúng khi isOpen=false', () => {
    const { container } = renderWithStore(
      <CartSidebar isOpen={false} onClose={() => {}} />
    );

    // Khi isOpen=false, sidebar KHÔNG có class --open
    const sidebar = container.querySelector('.cart-sidebar');
    expect(sidebar).not.toHaveClass('cart-sidebar--open');
  });
});
