import React from 'react';

const FilterButtons = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { value: 'all', label: 'All', icon: '👥' },
    { value: 'Leslie', label: 'Leslie', color: 'text-parent-leslie' },
    { value: 'Ian', label: 'Ian', color: 'text-parent-ian' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h3 className="text-sm font-semibold text-gray-800 tracking-tight">👤 Filter by Payer</h3>
        <div className="flex gap-1.5 bg-gradient-to-br from-gray-50 to-gray-100 p-1.5 rounded-xl shadow-inner">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                currentFilter === filter.value
                  ? 'bg-white shadow-soft text-cal-poly-forest transform scale-105'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
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