import React from 'react';

const AddExpenseButton = ({ onClick }) => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border border-emerald-200 shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
         onClick={onClick}>
      <div className="absolute inset-0 bg-gradient-to-br from-cal-poly-forest/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative text-center py-8 px-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cal-poly-forest to-emerald-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        
        <h2 className="text-xl font-bold text-cal-poly-forest group-hover:text-emerald-700 transition-colors duration-200 tracking-tight">
          Add New Expense
        </h2>
        <p className="text-sm text-gray-600 mt-1">Track a new expense</p>
      </div>
    </div>
  );
};

export default AddExpenseButton;