import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Product, ProductState } from '../types/product';
import { mockProducts } from '../utils/mockData';

const initialState: ProductState = {
  products: mockProducts,
  status: 'idle',
  error: null,
  selectedProducts: [],
  filters: {
    category: '',
    inStockOnly: false,
    searchQuery: '',
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
  },
  sorting: {
    field: 'name',
    direction: 'asc',
  },
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Add a product
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    
    // Update a product
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(
        (product) => product.id === action.payload.id
      );
      if (index !== -1) {
        state.products[index] = {
          ...state.products[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    // Delete a product
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
      state.selectedProducts = state.selectedProducts.filter(
        (id) => id !== action.payload
      );
    },
    
    // Delete multiple products
    deleteSelectedProducts: (state) => {
      state.products = state.products.filter(
        (product) => !state.selectedProducts.includes(product.id)
      );
      state.selectedProducts = [];
    },
    
    // Select a product
    selectProduct: (state, action: PayloadAction<string>) => {
      if (!state.selectedProducts.includes(action.payload)) {
        state.selectedProducts.push(action.payload);
      }
    },
    
    // Deselect a product
    deselectProduct: (state, action: PayloadAction<string>) => {
      state.selectedProducts = state.selectedProducts.filter(
        (id) => id !== action.payload
      );
    },
    
    // Toggle product selection
    toggleProductSelection: (state, action: PayloadAction<string>) => {
      const index = state.selectedProducts.indexOf(action.payload);
      if (index === -1) {
        state.selectedProducts.push(action.payload);
      } else {
        state.selectedProducts.splice(index, 1);
      }
    },
    
    // Select all products
    selectAllProducts: (state) => {
      state.selectedProducts = state.products.map((product) => product.id);
    },
    
    // Deselect all products
    deselectAllProducts: (state) => {
      state.selectedProducts = [];
    },
    
    // Set category filter
    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.filters.category = action.payload;
      state.pagination.currentPage = 1; // Reset to first page when filtering
    },
    
    // Toggle in-stock only filter
    toggleInStockFilter: (state) => {
      state.filters.inStockOnly = !state.filters.inStockOnly;
      state.pagination.currentPage = 1; // Reset to first page when filtering
    },
    
    // Set search query
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
      state.pagination.currentPage = 1; // Reset to first page when searching
    },
    
    // Set current page
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    
    // Set items per page
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.pagination.itemsPerPage = action.payload;
      state.pagination.currentPage = 1; // Reset to first page when changing items per page
    },
    
    // Set sorting
    setSorting: (
      state,
      action: PayloadAction<{ field: keyof Product | ''; direction: 'asc' | 'desc' }>
    ) => {
      state.sorting = action.payload;
    },
  },
});

export const {
  addProduct,
  updateProduct,
  deleteProduct,
  deleteSelectedProducts,
  selectProduct,
  deselectProduct,
  toggleProductSelection,
  selectAllProducts,
  deselectAllProducts,
  setCategoryFilter,
  toggleInStockFilter,
  setSearchQuery,
  setCurrentPage,
  setItemsPerPage,
  setSorting,
} = productSlice.actions;

export default productSlice.reducer;