import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
import DeleteConfirmModal from './DeleteConfirmModal';
import ExportButton from './ExportButton';

const ExpenseList = ({ expenses, filter, dateRange, onDeleteExpense }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const EXPENSES_PER_PAGE = 10;

  // Apply both payer filter and date range filter
  const payerFiltered = expenseService.filterExpenses(expenses, filter);
  const filteredExpenses = expenseService.filterByDateRange(payerFiltered, dateRange);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredExpenses.length / EXPENSES_PER_PAGE);
  const startIndex = (currentPage - 1) * EXPENSES_PER_PAGE;
  const endIndex = startIndex + EXPENSES_PER_PAGE;
  const currentExpenses = filteredExpenses.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, dateRange]);

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of expense list
    window.scrollTo({ top: 200, behavior: 'smooth' });
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

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);
    
    if (endPage - startPage < maxVisibleButtons - 1) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    // First page button
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-3 py-2 text-sm rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className="px-2 text-gray-400">...</span>
        );
      }
    }

    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm rounded-lg transition-colors ${
            currentPage === i
              ? 'bg-cal-poly-forest text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page button
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="ellipsis2" className="px-2 text-gray-400">...</span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-2 text-sm rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
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

        {/* Showing X-Y of Z expenses info */}
        {filteredExpenses.length > EXPENSES_PER_PAGE && (
          <div className="mb-4 text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredExpenses.length)} of {filteredExpenses.length} expenses
          </div>
        )}

        <div className="space-y-3">
          {currentExpenses.map((expense, index) => (
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 text-sm rounded-lg flex items-center gap-1 transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
            </div>

            <div className="flex items-center gap-1">
              {renderPaginationButtons()}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 text-sm rounded-lg flex items-center gap-1 transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
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