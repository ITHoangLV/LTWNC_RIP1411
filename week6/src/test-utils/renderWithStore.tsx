import React from 'react';
import { render, renderHook, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';
import productsReducer from '../features/products/productsSlice';
import { productsApi } from '../features/products/productsApi';
import type { RootState } from '../app/store';

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export function createTestStore(preloadedState: DeepPartial<RootState> = {}) {
  // RTK v2 strictened Reducer type signature (added 3rd PreloadedState param).
  // Using 'as any' here is the standard test-utility workaround.
  return configureStore({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reducer: {
      cart: cartReducer,
      products: productsReducer,
      [productsApi.reducerPath]: productsApi.reducer,
    } as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    middleware: (getDefaultMiddleware: any) =>
      getDefaultMiddleware().concat(productsApi.middleware),
    preloadedState: preloadedState as any,
  });
}

/**
 * Helper render component với Redux store được cấu hình sẵn.
 *
 * Mỗi test sẽ có store riêng biệt (tránh side-effect giữa các test).
 * Có thể truyền preloadedState để set up trạng thái ban đầu cho test.
 */
export function renderWithStore(
  ui: React.ReactElement,
  preloadedState: DeepPartial<RootState> = {},
  renderOptions?: Omit<RenderOptions, 'wrapper'>
) {
  const store = createTestStore(preloadedState);

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    store,
  };
}

/**
 * Helper test custom hooks với Redux store Provider.
 */
export function renderHookWithStore<Result, Props>(
  renderCallback: (initialProps: Props) => Result,
  preloadedState: DeepPartial<RootState> = {}
) {
  const store = createTestStore(preloadedState);

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    ...renderHook(renderCallback, { wrapper: Wrapper }),
    store,
  };
}

