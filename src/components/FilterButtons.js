import React from 'react';

const FilterButtons = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { value: 'all', label: 'All', icon: '👥' },
    { value: 'Leslie', label: 'Leslie', color: 'text-parent-leslie' },
    { value: 'Ian', label: 'Ian', color: 'text-parent-ian' }
  ];

  return (
    <div className="card mb-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-700">Filter Expenses</h3>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                currentFilter === filter.value
                  ? 'bg-white shadow-md text-cal-poly-forest'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="flex items-center gap-2">
                {filter.value === 'Leslie' && (
                  <span className="w-3 h-3 rounded-full bg-parent-leslie"></span>
                )}
                {filter.value === 'Ian' && (
                  <span className="w-3 h-3 rounded-full bg-parent-ian"></span>
                )}
                {filter.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterButtons;