import { Categories, LOW_STOCK_THRESHOLD, Product } from '../types/product';

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Check if a product has low stock
export const hasLowStock = (stock: number): boolean => {
  return stock <= LOW_STOCK_THRESHOLD;
};

// Get all available categories
export const getCategories = (): string[] => {
  return Object.values(Categories);
};

// Get count of products per category
export const getCategoryCounts = (products: Product[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  
  // Initialize all categories with zero
  getCategories().forEach(category => {
    counts[category] = 0;
  });
  
  // Count products in each category
  products.forEach(product => {
    if (counts[product.category] !== undefined) {
      counts[product.category]++;
    } else {
      counts[product.category] = 1;
    }
  });
  
  return counts;
};

// Generate a random ID for new products
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// Format date in a readable format
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Filter products based on criteria
export const filterProducts = (
  products: Product[],
  categoryFilter: string,
  inStockOnly: boolean,
  searchQuery: string
): Product[] => {
  return products.filter((product) => {
    // Filter by category
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    
    // Filter by stock
    const matchesStock = inStockOnly ? product.stock > 0 : true;
    
    // Filter by search query
    const matchesSearch = searchQuery
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        false
      : true;
    
    return matchesCategory && matchesStock && matchesSearch;
  });
};

// Sort products
export const sortProducts = (
  products: Product[],
  field: keyof Product | '',
  direction: 'asc' | 'desc'
): Product[] => {
  if (!field) return products;
  
  return [...products].sort((a, b) => {
    const valueA = a[field];
    const valueB = b[field];
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      const comparison = valueA.localeCompare(valueB);
      return direction === 'asc' ? comparison : -comparison;
    }
    
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return direction === 'asc' ? valueA - valueB : valueB - valueA;
    }
    
    // Default case (for dates, etc.)
    if (valueA < valueB) return direction === 'asc' ? -1 : 1;
    if (valueA > valueB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// Paginate products
export const paginateProducts = (
  products: Product[],
  currentPage: number,
  itemsPerPage: number
): Product[] => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  return products.slice(startIndex, startIndex + itemsPerPage);
};