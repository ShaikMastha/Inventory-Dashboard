import React from 'react';
import { Search, Filter } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { 
  setCategoryFilter, 
  setSearchQuery, 
  toggleInStockFilter 
} from '../../store/productSlice';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Checkbox from '../ui/Checkbox';
import { getCategories } from '../../utils/helpers';

const FilterSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.products);
  const { category, inStockOnly, searchQuery } = filters;

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setCategoryFilter(e.target.value));
  };

  const handleInStockToggle = () => {
    dispatch(toggleInStockFilter());
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  // Get all categories and prepare for select dropdown
  const categoryOptions = [
    { value: '', label: 'Sort By' },
    ...getCategories().map((cat) => ({ value: cat, label: cat })),
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
        <div className="flex-grow">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            leftIcon={<Search size={18} />}
            fullWidth
          />
        </div>
        
        <div className="md:w-1/4">
          <Select
            label="Category"
            value={category}
            onChange={handleCategoryChange}
            options={categoryOptions}
            fullWidth
          />
        </div>
        
        <div className="flex items-center">
          <Checkbox
            id="inStock"
            checked={inStockOnly}
            onChange={handleInStockToggle}
            label="In Stock Only"
          />
        </div>
      </div>
      
      {/* Active filters display */}
      <div className="mt-2 flex items-center text-sm">
        <Filter size={16} className="mr-1 text-gray-500" />
        <span className="mr-2 text-gray-500">Active filters:</span>
        {category && (
          <span className="mr-2 px-2 py-1 bg-primary-100 text-primary-800 rounded">
            {category}
          </span>
        )}
        {inStockOnly && (
          <span className="mr-2 px-2 py-1 bg-success-100 text-success-800 rounded">
            In Stock
          </span>
        )}
        {!category && !inStockOnly && (
          <span className="text-gray-500">None</span>
        )}
      </div>
    </div>
  );
};

export default FilterSection;