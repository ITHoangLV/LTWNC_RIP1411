import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { MOCK_PRODUCTS } from './mockData';
import type { Product } from './product.type';

// ─── State ─────────────────────────────────────────────────────────────────
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

// ─── Async Thunk ────────────────────────────────────────────────────────────
// Giả lập API call — trả về 10.000 sản phẩm sau 400ms
export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  await new Promise((r) => setTimeout(r, 400));
  return MOCK_PRODUCTS;
});

// ─── Slice ──────────────────────────────────────────────────────────────────
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedCategory(state, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Lỗi không xác định';
      });
  },
});

export const { setSelectedCategory, setSearchQuery } = productsSlice.actions;
export default productsSlice.reducer;
