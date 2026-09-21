import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Product } from './product.type';
import { MOCK_PRODUCTS } from './mockData';

// ─── Async Thunk: Giả lập gọi API fetch danh sách sản phẩm ───────────────────
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async () => {
    // Giả lập network delay 800ms
    await new Promise<void>((resolve) => setTimeout(resolve, 800));
    return MOCK_PRODUCTS;
  }
);

// ─── State Shape ──────────────────────────────────────────────────────────────
interface ProductsState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  selectedCategory: string;
  searchQuery: string;
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
  selectedCategory: 'Tất cả',
  searchQuery: '',
};

// ─── Slice ────────────────────────────────────────────────────────────────────
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedCategory(state, action: { payload: string }) {
      state.selectedCategory = action.payload;
    },
    setSearchQuery(state, action: { payload: string }) {
      state.searchQuery = action.payload;
    },
  },
  // Xử lý 3 trạng thái của async thunk: pending / fulfilled / rejected
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Không thể tải sản phẩm';
      });
  },
});

export const { setSelectedCategory, setSearchQuery } = productsSlice.actions;
export default productsSlice.reducer;
