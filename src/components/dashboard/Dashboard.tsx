import React, { useState } from 'react';
import { Package, PlusCircle, BarChart2, Grid } from 'lucide-react';
import { useAppSelector } from '../../hooks/useRedux';
import { Product } from '../../types/product';
import Button from '../ui/Button';
import ProductTable from './ProductTable';
import FilterSection from './FilterSection';
import ProductFormModal from './ProductFormModal';
import CategoryChart from './CategoryChart';

const Dashboard: React.FC = () => {
  const { products, selectedProducts } = useAppSelector((state) => state.products);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | undefined>(undefined);
  const [showChart, setShowChart] = useState(true);
  
  // Open product form modal for adding a new product
  const handleAddProduct = () => {
    setProductToEdit(undefined);
    setIsProductFormOpen(true);
  };
  
  // Open product form modal for editing a product
  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsProductFormOpen(true);
  };
  
  // Close product form modal
  const handleCloseProductForm = () => {
    setIsProductFormOpen(false);
  };
  
  // Toggle chart visibility
  const toggleChart = () => {
    setShowChart(!showChart);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Package className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
                <p className="text-sm text-gray-500">
                  {products.length} products | {selectedProducts.length} selected
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                leftIcon={showChart ? <Grid size={18} /> : <BarChart2 size={18} />}
                onClick={toggleChart}
              >
                {showChart ? 'Hide Chart' : 'Show Chart'}
              </Button>
              <Button
                variant="primary"
                leftIcon={<PlusCircle size={18} />}
                onClick={handleAddProduct}
              >
                Add Product
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Filters */}
          <FilterSection />
          
          {/* Chart and Table Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product Table */}
            <div className={showChart ? 'lg:col-span-2' : 'lg:col-span-3'}>
              <ProductTable onEdit={handleEditProduct} />
            </div>
            
            {/* Chart */}
            {showChart && (
              <div className="lg:col-span-1">
                <CategoryChart />
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isProductFormOpen}
        onClose={handleCloseProductForm}
        product={productToEdit}
      />
    </div>
  );
};

export default Dashboard;