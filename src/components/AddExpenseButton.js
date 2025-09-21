import React from 'react';

const AddExpenseButton = ({ onClick }) => {
  return (
    <div className="card bg-gradient-to-br from-green-50/30 to-white border-l-4 border-cal-poly-market shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group"
         onClick={onClick}>
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-cal-poly-market rounded-full mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        
        <h2 className="text-xl font-bold text-cal-poly-forest group-hover:text-cal-poly-market transition-colors duration-200">
          Add New Expense
        </h2>
      </div>
    </div>
  );
};

export default AddExpenseButton;