import React, { useState } from 'react';
import { expenseService } from '../services/expenseService';

const ExpenseForm = ({ onExpenseAdded }) => {
  const [formData, setFormData] = useState({
    payer: 'Leslie',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
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

    // Check if we're in demo mode (callback provided) or Firebase mode (no callback)
    if (onExpenseAdded && typeof onExpenseAdded === 'function') {
      try {
        // Demo mode - call the callback function
        onExpenseAdded(expenseData);
        
        setMessage({ type: 'success', text: 'Expense added successfully!' });
        setFormData({
          payer: formData.payer,
          amount: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
          note: ''
        });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        setIsSubmitting(false);
        return;
      } catch (error) {
        console.log('Demo mode callback failed, falling back to Firebase');
      }
    }

    // Firebase mode - use Firebase service
    const result = await expenseService.addExpense(expenseData);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Expense added successfully!' });
      setFormData({
        payer: formData.payer,
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        note: ''
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } else {
      setMessage({ type: 'error', text: 'Failed to add expense. Please try again.' });
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="card animate-fade-in bg-gradient-to-br from-green-50/30 to-white border-l-4 border-cal-poly-market shadow-md">
      <h2 className="text-2xl font-bold text-cal-poly-forest mb-6 flex items-center gap-2">
        <span className="text-cal-poly-market">+</span>
        Add New Expense
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
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

        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
            Note (Optional)
          </label>
          <textarea
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Add any additional notes here..."
            className="input-field resize-none"
            rows="2"
            disabled={isSubmitting}
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

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full btn-primary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;