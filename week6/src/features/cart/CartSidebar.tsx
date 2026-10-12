import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from './cartSlice';
import {
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalPrice,
} from './cartSelectors';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const totalItems = useAppSelector(selectCartTotalItems);
  const totalPrice = useAppSelector(selectCartTotalPrice);

  const formatPrice = (price: number) =>
    price.toLocaleString('vi-VN') + ' ₫';

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${isOpen ? 'cart-overlay--visible' : ''}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={`cart-sidebar ${isOpen ? 'cart-sidebar--open' : ''}`}>
        {/* Header */}
        <div className="cart-header">
          <div className="cart-header__title">
            <span className="cart-icon">🛒</span>
            <h2>Giỏ hàng</h2>
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </div>
          <button className="cart-close-btn" onClick={onClose} aria-label="Đóng giỏ hàng">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <span className="cart-empty__icon">🛍️</span>
              <p>Giỏ hàng trống</p>
              <small>Hãy thêm sản phẩm vào giỏ</small>
            </div>
          ) : (
            <ul className="cart-items">
              {items.map((item) => (
                <li key={item.id} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item__image"
                  />
                  <div className="cart-item__info">
                    <p className="cart-item__name">{item.name}</p>
                    <p className="cart-item__price">
                      {formatPrice(item.price)}
                    </p>
                    {/* Điều chỉnh số lượng */}
                    <div className="cart-item__qty">
                      <button
                        className="qty-btn"
                        onClick={() =>
                          dispatch(
                            updateQuantity({ id: item.id, quantity: item.quantity - 1 })
                          )
                        }
                        disabled={item.quantity <= 1}
                        aria-label="Giảm số lượng"
                      >
                        −
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() =>
                          dispatch(
                            updateQuantity({ id: item.id, quantity: item.quantity + 1 })
                          )
                        }
                        aria-label="Tăng số lượng"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="cart-item__right">
                    <p className="cart-item__subtotal">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <button
                      className="remove-btn"
                      onClick={() => dispatch(removeFromCart(item.id))}
                      aria-label={`Xoá ${item.name}`}
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-footer__summary">
              <span>Tổng cộng ({totalItems} sản phẩm)</span>
              <strong className="cart-footer__total">
                {formatPrice(totalPrice)}
              </strong>
            </div>
            <button
              id="checkout-btn"
              className="checkout-btn"
              onClick={() => {
                alert(`🎉 Đặt hàng thành công!\nTổng thanh toán: ${formatPrice(totalPrice)}`);
                dispatch(clearCart());
                onClose();
              }}
            >
              Thanh toán ngay →
            </button>
            <button
              className="clear-cart-btn"
              onClick={() => dispatch(clearCart())}
            >
              Xoá tất cả
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
