import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
import cartReducer from '../features/cart/cartSlice';
import { productsApi } from '../features/products/productsApi';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    // RTK Query reducer
    [productsApi.reducerPath]: productsApi.reducer,
  },
  // Thêm RTK Query middleware để hỗ trợ caching, invalidation, polling
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
});

// Infer type RootState từ store
export type RootState = ReturnType<typeof store.getState>;
// Infer type AppDispatch từ store
export type AppDispatch = typeof store.dispatch;
