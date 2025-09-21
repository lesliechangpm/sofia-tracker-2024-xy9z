import React, { useState } from 'react';
import { expenseService } from '../services/expenseService';
import Modal from './Modal';

const ExpenseFormModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    payer: 'Leslie',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      payer: formData.payer, // Keep the payer selection
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    // Convert amount to number for consistency
    const expenseData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    // Use Firebase service to add expense
    const result = await expenseService.addExpense(expenseData);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Expense added successfully!' });
      resetForm();
      
      // Close modal after brief success message
      setTimeout(() => {
        onClose();
        setMessage({ type: '', text: '' });
      }, 1500);
    } else {
      setMessage({ type: 'error', text: 'Failed to add expense. Please try again.' });
    }
    
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="Add New Expense">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="payer" className="block text-sm font-medium text-gray-700 mb-1">
              Who Paid?
            </label>
            <div className="relative">
              <select
                id="payer"
                name="payer"
                value={formData.payer}
                onChange={handleChange}
                className="input-field appearance-none pr-10"
                disabled={isSubmitting}
              >
                <option value="Leslie">Leslie</option>
                <option value="Ian">Ian</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <div className={`w-3 h-3 rounded-full ${
                  formData.payer === 'Leslie' ? 'bg-parent-leslie' : 'bg-parent-ian'
                }`}></div>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount ($)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="input-field"
              disabled={isSubmitting}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g., Textbooks, Dorm supplies, Meal plan"
            className="input-field"
            disabled={isSubmitting}
            required
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="input-field"
            disabled={isSubmitting}
            required
          />
        </div>

        {message.text && (
          <div className={`p-3 rounded-lg animate-slide-up ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-700 border border-green-300' 
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}>
            {message.text}
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 btn-primary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Adding...' : 'Add Expense'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ExpenseFormModal;