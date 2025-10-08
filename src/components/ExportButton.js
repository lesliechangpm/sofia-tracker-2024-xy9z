import React from 'react';
import { expenseService } from '../services/expenseService';

const ExportButton = ({ expenses, filter }) => {
  const handleExport = () => {
    const filteredExpenses = expenseService.filterExpenses(expenses, filter);
    
    if (filteredExpenses.length === 0) {
      alert('No expenses to export');
      return;
    }
    
    const success = expenseService.exportToCSV(filteredExpenses, filter);
    
    if (!success) {
      alert('Failed to export expenses');
    }
  };

  const getButtonText = () => {
    const count = expenseService.filterExpenses(expenses, filter).length;
    if (count === 0) return 'Export CSV';
    
    const filterText = filter === 'all' ? 'All' : `${filter}'s`;
    return `Export ${filterText} (${count})`;
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-cal-poly-forest text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 text-sm font-medium"
      title="Export expenses to CSV"
    >
      <svg 
        className="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
        />
      </svg>
      {getButtonText()}
    </button>
  );
};

export default ExportButton;