// Import jest-dom matchers: toBeInTheDocument, toHaveTextContent, v.v.
import '@testing-library/jest-dom';

// Mock window.alert toàn cục (CartSidebar dùng alert() khi checkout)
window.alert = jest.fn();
