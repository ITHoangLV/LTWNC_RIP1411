import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product } from './product.type';
import { MOCK_PRODUCTS } from './mockData';

/**
 * RTK Query API slice — cách hiện đại hơn để fetch data so với createAsyncThunk.
 * Tự động quản lý: loading states, caching, refetching, và deduplication.
 *
 * Dùng fakeBaseQuery() vì không có API server thật — thay bằng dữ liệu mock.
 */
export const productsApi = createApi({
  reducerPath: 'productsApi',
  // fakeBaseQuery cho phép dùng queryFn thay vì gọi HTTP thật
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    // Endpoint lấy tất cả sản phẩm
    getProducts: builder.query<Product[], void>({
      queryFn: async () => {
        // Giả lập network delay
        await new Promise<void>((resolve) => setTimeout(resolve, 800));
        return { data: MOCK_PRODUCTS };
      },
    }),
    // Endpoint lấy sản phẩm theo ID
    getProductById: builder.query<Product | undefined, string>({
      queryFn: async (id) => {
        await new Promise<void>((resolve) => setTimeout(resolve, 300));
        const product = MOCK_PRODUCTS.find((p) => p.id === id);
        return { data: product };
      },
    }),
  }),
});

// Export auto-generated hooks — đây là điểm mạnh của RTK Query
export const { useGetProductsQuery, useGetProductByIdQuery } = productsApi;
