import React, { useState } from 'react';
import { 
  ArrowUpDown, 
  Edit, 
  Trash, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight,
  Check,
  X
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { 
  deleteProduct, 
  deleteSelectedProducts, 
  deselectAllProducts, 
  selectAllProducts, 
  setCurrentPage, 
  setItemsPerPage, 
  setSorting, 
  toggleProductSelection 
} from '../../store/productSlice';
import { 
  filterProducts, 
  formatCurrency, 
  formatDate, 
  hasLowStock, 
  paginateProducts, 
  sortProducts 
} from '../../utils/helpers';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import Badge from '../ui/Badge';
import { Product } from '../../types/product';

interface ProductTableProps {
  onEdit: (product: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ onEdit }) => {
  const dispatch = useAppDispatch();
  const { 
    products, 
    selectedProducts, 
    filters, 
    pagination, 
    sorting 
  } = useAppSelector((state) => state.products);
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  
  // Apply filters and sorting
  const filteredProducts = filterProducts(
    products,
    filters.category,
    filters.inStockOnly,
    filters.searchQuery
  );
  
  const sortedProducts = sortProducts(
    filteredProducts,
    sorting.field,
    sorting.direction
  );
  
  // Apply pagination
  const paginatedProducts = paginateProducts(
    sortedProducts,
    pagination.currentPage,
    pagination.itemsPerPage
  );
  
  const totalPages = Math.ceil(sortedProducts.length / pagination.itemsPerPage);
  
  // Handle sort toggle
  const handleSort = (field: keyof Product) => {
    const direction = 
      field === sorting.field && sorting.direction === 'asc' ? 'desc' : 'asc';
    dispatch(setSorting({ field, direction }));
  };
  
  // Select/deselect all products
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      dispatch(selectAllProducts());
    } else {
      dispatch(deselectAllProducts());
    }
  };
  
  // Toggle product selection
  const handleSelectProduct = (id: string) => {
    dispatch(toggleProductSelection(id));
  };
  
  // Handle delete confirmation
  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setShowDeleteConfirm(true);
  };
  
  // Handle batch delete confirmation
  const handleBatchDeleteClick = () => {
    setProductToDelete(null);
    setShowDeleteConfirm(true);
  };
  
  // Confirm delete
  const confirmDelete = () => {
    if (productToDelete) {
      dispatch(deleteProduct(productToDelete));
    } else {
      dispatch(deleteSelectedProducts());
    }
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };
  
  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };
  
  // Handle items per page change
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setItemsPerPage(Number(e.target.value)));
  };
  
  // Check if all products on current page are selected
  const areAllSelected = 
    paginatedProducts.length > 0 && 
    paginatedProducts.every((product) => selectedProducts.includes(product.id));
  
  // Check if any products are selected
  const hasSelections = selectedProducts.length > 0;
  
  // Render sort indicator
  const renderSortIndicator = (field: keyof Product) => {
    if (sorting.field !== field) return <ArrowUpDown size={16} />;
    return sorting.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Batch actions */}
      {hasSelections && (
        <div className="bg-primary-50 p-4 flex items-center justify-between">
          <span className="text-primary-700">
            {selectedProducts.length} {selectedProducts.length === 1 ? 'item' : 'items'} selected
          </span>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash size={16} />}
            onClick={handleBatchDeleteClick}
          >
            Delete Selected
          </Button>
        </div>
      )}
      
      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center text-error-600 mb-4">
              <AlertTriangle size={24} className="mr-2" />
              <h3 className="text-lg font-medium">Confirm Deletion</h3>
            </div>
            <p className="mb-4 text-gray-700">
              {productToDelete
                ? 'Are you sure you want to delete this product? This action cannot be undone.'
                : `Are you sure you want to delete ${selectedProducts.length} selected products? This action cannot be undone.`}
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" size="sm" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="pl-4 py-3 text-left w-10">
                <Checkbox
                  checked={areAllSelected}
                  onChange={handleSelectAll}
                  aria-label="Select all products"
                />
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th 
                scope="col" 
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Product
                  <span className="ml-1">{renderSortIndicator('name')}</span>
                </div>
              </th>
              <th 
                scope="col" 
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center">
                  Category
                  <span className="ml-1">{renderSortIndicator('category')}</span>
                </div>
              </th>
              <th 
                scope="col" 
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center">
                  Price
                  <span className="ml-1">{renderSortIndicator('price')}</span>
                </div>
              </th>
              <th 
                scope="col" 
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('stock')}
              >
                <div className="flex items-center">
                  Stock
                  <span className="ml-1">{renderSortIndicator('stock')}</span>
                </div>
              </th>
              <th 
                scope="col" 
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('updatedAt')}
              >
                <div className="flex items-center">
                  Last Updated
                  <span className="ml-1">{renderSortIndicator('updatedAt')}</span>
                </div>
              </th>
              <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product) => (
                <tr 
                  key={product.id} 
                  className={`
                    ${selectedProducts.includes(product.id) ? 'bg-primary-50' : ''}
                    hover:bg-gray-50 transition-colors
                  `}
                >
                  <td className="pl-4 py-4 whitespace-nowrap">
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      aria-label={`Select ${product.name}`}
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-10 w-10 rounded-full object-cover" 
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No img</span>
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-4">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    {product.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {product.description}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <Badge variant="secondary">
                      {product.category}
                    </Badge>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {hasLowStock(product.stock) ? (
                        <Badge variant="error" className="flex items-center">
                          <AlertTriangle size={12} className="mr-1" />
                          Low: {product.stock}
                        </Badge>
                      ) : product.stock === 0 ? (
                        <Badge variant="error">Out of Stock</Badge>
                      ) : (
                        <Badge variant="success">{product.stock}</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(product.updatedAt)}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Edit size={16} />}
                        onClick={() => onEdit(product)}
                        aria-label={`Edit ${product.name}`}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        leftIcon={<Trash size={16} />}
                        onClick={() => handleDeleteClick(product.id)}
                        aria-label={`Delete ${product.name}`}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-200 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <select
            className="mr-2 border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
            value={pagination.itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <span className="text-sm text-gray-700">
            Showing {paginatedProducts.length > 0 ? (pagination.currentPage - 1) * pagination.itemsPerPage + 1 : 0} to{' '}
            {Math.min(pagination.currentPage * pagination.itemsPerPage, sortedProducts.length)} of{' '}
            {sortedProducts.length} results
          </span>
        </div>
        
        <nav className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ChevronLeft size={16} />}
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            Previous
          </Button>
          <span className="mx-4 text-sm text-gray-700">
            Page {pagination.currentPage} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            rightIcon={<ChevronRight size={16} />}
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= totalPages}
          >
            Next
          </Button>
        </nav>
      </div>
    </div>
  );
};

export default ProductTable;