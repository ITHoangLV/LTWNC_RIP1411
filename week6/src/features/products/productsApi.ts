import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product } from './product.type';
import { MOCK_PRODUCTS } from './mockData';

/**
 * RTK Query API slice — cách hiện đại hơn để fetch data so với createAsyncThunk.
 * Tự động quản lý: loading states, caching, refetching, và deduplication.
 */
export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      queryFn: async () => {
        await new Promise<void>((resolve) => setTimeout(resolve, 800));
        return { data: MOCK_PRODUCTS };
      },
    }),
    getProductById: builder.query<Product | undefined, string>({
      queryFn: async (id) => {
        await new Promise<void>((resolve) => setTimeout(resolve, 300));
        const product = MOCK_PRODUCTS.find((p) => p.id === id);
        return { data: product };
      },
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productsApi;
