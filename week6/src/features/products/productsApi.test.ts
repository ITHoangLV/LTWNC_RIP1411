/**
 * productsApi.test.ts
 * ───────────────────
 * Async unit tests cho RTK Query endpoints: getProducts và getProductById
 * Kiểm thử queryFn bất đồng bộ với fakeBaseQuery / timers.
 */

import { configureStore } from '@reduxjs/toolkit';
import { productsApi } from './productsApi';

function setupApiStore() {
  return configureStore({
    reducer: {
      [productsApi.reducerPath]: productsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(productsApi.middleware),
  });
}

describe('productsApi — RTK Query Async Endpoint Tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('getProducts endpoint — fetch danh sách sản phẩm thành công', async () => {
    const store = setupApiStore();

    const promise = store.dispatch(productsApi.endpoints.getProducts.initiate());
    jest.runAllTimers();

    const result = await promise;
    expect(result.data).toBeDefined();
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data!.length).toBeGreaterThan(0);
    expect(result.status).toBe('fulfilled');
  });

  it('getProductById endpoint — tìm thấy sản phẩm hợp lệ theo id', async () => {
    const store = setupApiStore();

    const promise = store.dispatch(
      productsApi.endpoints.getProductById.initiate('prod-1')
    );
    jest.runAllTimers();

    const result = await promise;
    expect(result.data).toBeDefined();
    expect(result.data?.id).toBe('prod-1');
    expect(result.status).toBe('fulfilled');
  });

  it('getProductById endpoint — trả về error khi không tìm thấy id', async () => {
    const store = setupApiStore();

    const promise = store.dispatch(
      productsApi.endpoints.getProductById.initiate('prod-not-exist')
    );
    jest.runAllTimers();

    const result = await promise;
    expect(result.error).toBeDefined();
    expect(result.status).toBe('rejected');
  });
});
