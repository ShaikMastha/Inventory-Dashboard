import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          className={`
            h-4 w-4 rounded
            border-gray-300 text-primary-600
            focus:ring-primary-500
            ${error ? 'border-error-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {label && (
        <div className="ml-2 text-sm">
          <label className="font-medium text-gray-700">{label}</label>
          {error && <p className="text-error-500 text-xs mt-1">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Checkbox;