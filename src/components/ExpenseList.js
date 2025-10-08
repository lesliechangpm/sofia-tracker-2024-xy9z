import React, { useState } from 'react';
import { expenseService } from '../services/expenseService';
import DeleteConfirmModal from './DeleteConfirmModal';
import ExportButton from './ExportButton';

const ExpenseList = ({ expenses, filter, dateRange, onDeleteExpense }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Apply both payer filter and date range filter
  const payerFiltered = expenseService.filterExpenses(expenses, filter);
  const filteredExpenses = expenseService.filterByDateRange(payerFiltered, dateRange);

  const handleDeleteClick = (expense) => {
    setExpenseToDelete(expense);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!expenseToDelete) return;
    
    setIsDeleting(true);
    
    // Use passed delete function for demo mode, or Firebase for production
    if (onDeleteExpense) {
      // Demo mode - delete from local state
      onDeleteExpense(expenseToDelete.id);
      setDeleteModalOpen(false);
      setExpenseToDelete(null);
      setIsDeleting(false);
    } else {
      // Production mode - delete from Firebase
      const result = await expenseService.deleteExpense(expenseToDelete.id);
      
      if (result.success) {
        setDeleteModalOpen(false);
        setExpenseToDelete(null);
      }
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setExpenseToDelete(null);
  };

  const getPayerAvatar = (payer) => {
    const initial = payer ? payer[0].toUpperCase() : '?';
    const bgColor = payer?.toLowerCase() === 'leslie' ? 'bg-parent-leslie' : 'bg-parent-ian';
    return (
      <div className={`w-10 h-10 rounded-full ${bgColor} text-white flex items-center justify-center font-bold text-sm`}>
        {initial}
      </div>
    );
  };

  if (filteredExpenses.length === 0) {
    return (
      <div className="card text-center py-12">
        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="text-lg font-medium text-gray-500 mb-2">No expenses yet</h3>
        <p className="text-gray-400">
          {filter === 'all' 
            ? 'Add your first expense to get started' 
            : `No expenses from ${filter} yet`}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-cal-poly-forest">
            {filter === 'all' ? 'All Expenses' : `${filter}'s Expenses`}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {filteredExpenses.length} {filteredExpenses.length === 1 ? 'expense' : 'expenses'}
            </span>
            <ExportButton expenses={expenses} filter={filter} />
          </div>
        </div>

        <div className="space-y-3">
          {filteredExpenses.map((expense, index) => (
            <div
              key={expense.id}
              className="flex items-start p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex-shrink-0 mr-3 sm:mr-4">
                {getPayerAvatar(expense.payer)}
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="flex-grow min-w-0">
                    <h3 className="font-semibold text-gray-800 break-words">{expense.description}</h3>
                    <p className="text-sm text-gray-500">
                      {expenseService.formatDate(expense.date)} • Paid by {expense.payer}
                    </p>
                    {expense.note && (
                      <p className="text-sm text-gray-600 mt-1 italic">
                        📝 {expense.note}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <span className="text-lg font-bold text-cal-poly-forest">
                      {expenseService.formatCurrency(expense.amount)}
                    </span>
                    <button
                      onClick={() => handleDeleteClick(expense)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                      title="Delete expense"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {deleteModalOpen && (
        <DeleteConfirmModal
          expense={expenseToDelete}
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default ExpenseList;