import React from 'react';
import { expenseService } from '../services/expenseService';

const DeleteConfirmModal = ({ expense, isDeleting, onConfirm, onCancel }) => {
  if (!expense) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl animate-slide-up">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Delete Expense</h3>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-3">
            Are you sure you want to delete this expense? This action cannot be undone.
          </p>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-semibold text-gray-800">{expense.description}</p>
            <p className="text-sm text-gray-600 mt-1">
              {expenseService.formatCurrency(expense.amount)} • Paid by {expense.payer}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {expenseService.formatDate(expense.date)}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className={`flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium ${
              isDeleting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;