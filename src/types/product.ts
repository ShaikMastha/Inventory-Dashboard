export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

export interface ProductState {
  products: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  selectedProducts: string[];
  filters: {
    category: string;
    inStockOnly: boolean;
    searchQuery: string;
  };
  pagination: {
    currentPage: number;
    itemsPerPage: number;
  };
  sorting: {
    field: keyof Product | '';
    direction: 'asc' | 'desc';
  };
}

export enum Categories {
  Electronics = 'Electronics',
  Clothing = 'Clothing',
  Food = 'Food',
  Furniture = 'Furniture',
  Books = 'Books',
  Toys = 'Toys',
  Other = 'Other',
}

export const LOW_STOCK_THRESHOLD = 10;