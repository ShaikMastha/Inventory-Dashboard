import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useAppSelector } from '../../hooks/useRedux';
import { getCategoryCounts } from '../../utils/helpers';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart: React.FC = () => {
  const { products } = useAppSelector((state) => state.products);
  
  // Calculate category counts
  const categoryCounts = getCategoryCounts(products);
  
  // Prepare data for chart
  const data = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        data: Object.values(categoryCounts),
        backgroundColor: [
          '#3b82f6', // primary
          '#14b8a6', // secondary
          '#f97316', // accent
          '#10b981', // success
          '#fbbf24', // warning
          '#ef4444', // error
          '#6366f1', // indigo
          '#ec4899', // pink
          '#8b5cf6', // purple
          '#64748b', // slate
        ],
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 2,
      },
    ],
  };
  
  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            const percentage = (value / products.length * 100).toFixed(1);
            return `${value} products (${percentage}%)`;
          },
        },
      },
    },
    cutout: '70%',
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Product Distribution by Category</h3>
      <div className="h-64">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default CategoryChart;