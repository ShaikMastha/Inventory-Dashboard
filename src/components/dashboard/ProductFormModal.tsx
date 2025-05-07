import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../hooks/useRedux';
import { addProduct, updateProduct } from '../../store/productSlice';
import { Categories, Product, ProductFormData } from '../../types/product';
import { formatCurrency, generateId, getCategories } from '../../utils/helpers';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import Select from '../ui/Select';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
}

// Initial form data
const initialFormData: ProductFormData = {
  name: '',
  category: Categories.Electronics,
  price: 0,
  stock: 0,
  description: '',
  image: '',
};

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set form data when editing a product
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        description: product.description || '',
        image: product.image || '',
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [product, isOpen]);
  
  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Handle number inputs
    if (name === 'price' || name === 'stock') {
      const numValue = parseFloat(value);
      setFormData((prev) => ({
        ...prev,
        [name]: isNaN(numValue) ? 0 : numValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }
    
    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }
    
    if (formData.image && !isValidUrl(formData.image)) {
      newErrors.image = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Check if URL is valid
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Create new product or update existing one
    if (product) {
      // Update existing product
      dispatch(
        updateProduct({
          ...product,
          ...formData,
          updatedAt: new Date().toISOString(),
        })
      );
    } else {
      // Create new product
      dispatch(
        addProduct({
          id: generateId(),
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      );
    }
    
    // Reset form and close modal
    setIsSubmitting(false);
    onClose();
  };
  
  // Category options for select dropdown
  const categoryOptions = getCategories().map((cat) => ({
    value: cat,
    label: cat,
  }));
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Edit Product' : 'Add New Product'}
      size="lg"
      footer={
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            {product ? 'Update Product' : 'Add Product'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              fullWidth
              required
            />
          </div>
          
          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={categoryOptions}
            fullWidth
            required
          />
          
          <Input
            label="Price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price.toString()}
            onChange={handleChange}
            error={errors.price}
            helperText={`Preview: ${formatCurrency(formData.price)}`}
            fullWidth
            required
          />
          
          <Input
            label="Stock Quantity"
            name="stock"
            type="number"
            min="0"
            step="1"
            value={formData.stock.toString()}
            onChange={handleChange}
            error={errors.stock}
            fullWidth
            required
          />
          
          <div className="md:col-span-2">
            <Input
              label="Image URL"
              name="image"
              value={formData.image}
              onChange={handleChange}
              error={errors.image}
              helperText="Enter a URL for the product image"
              fullWidth
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        
        {/* Preview image if URL is provided */}
        {formData.image && !errors.image && (
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-700 mb-1">Image Preview</p>
            <div className="border border-gray-200 rounded-md p-2 w-24 h-24 overflow-hidden">
              <img
                src={formData.image}
                alt="Product preview"
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Handle image load error
                  setErrors((prev) => ({
                    ...prev,
                    image: 'Failed to load image from URL',
                  }));
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default ProductFormModal;