import React, { useState } from 'react';
import { getNextPaymentsDue, getDaysUntilNextPayment, formatCurrency } from '../data/paymentSchedule';
import { expenseService } from '../services/expenseService';

const NextPaymentDue = ({ onExpenseAdded }) => {
  console.log('NextPaymentDue component called!');
  
  const nextPayments = getNextPaymentsDue();
  const daysRemaining = getDaysUntilNextPayment();
  const [markedAsPaid, setMarkedAsPaid] = useState([]);
  const [isMarking, setIsMarking] = useState(false);
  
  console.log('NextPaymentDue data:', { 
    nextPayments: nextPayments,
    nextPaymentsLength: nextPayments.length, 
    daysRemaining 
  });

  // Temporarily show debug info
  if (nextPayments.length === 0) {
    console.log('No upcoming payments found');
    return (
      <div className="bg-red-100 p-4 text-center">
        DEBUG: No upcoming payments (check payment schedule dates)
      </div>
    );
  }

  const nextDate = nextPayments[0].dateObj;
  const totalAmount = nextPayments.reduce((sum, payment) => sum + payment.amount, 0);
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const handleMarkAsPaid = async (payment, index) => {
    setIsMarking(true);
    
    // Format the date properly for the expense
    const paymentDate = payment.dateObj;
    const formattedDate = `${paymentDate.getFullYear()}-${String(paymentDate.getMonth() + 1).padStart(2, '0')}-${String(paymentDate.getDate()).padStart(2, '0')}`;
    
    const expenseData = {
      payer: 'Leslie', // Default to Leslie, user can change if needed
      amount: payment.amount,
      description: `Cal Poly ${payment.description} - ${formatDate(paymentDate)}`,
      date: formattedDate
    };

    try {
      // If callback provided (demo mode), use it
      if (onExpenseAdded && typeof onExpenseAdded === 'function') {
        onExpenseAdded(expenseData);
      } else {
        // Otherwise use Firebase
        await expenseService.addExpense(expenseData);
      }
      
      setMarkedAsPaid([...markedAsPaid, index]);
    } catch (error) {
      console.error('Failed to mark as paid:', error);
      alert('Failed to mark payment as paid. Please try again.');
    } finally {
      setIsMarking(false);
    }
  };


  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-gray-600 text-sm">
            <div className="flex items-center gap-1">
              <span>📅</span>
              <span className="text-gray-700">Next Due {formatDate(nextDate)}:</span>
            </div>
            
            {nextPayments.map((payment, index) => (
              <div key={index} className="flex items-center gap-2">
                <span>{payment.description === 'Dining' ? '🍽️' : '🏠'}</span>
                <span className="text-gray-700">{payment.description}</span>
                <span className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</span>
                {!markedAsPaid.includes(index) && (
                  <button
                    onClick={() => handleMarkAsPaid(payment, index)}
                    disabled={isMarking}
                    className="ml-1 px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded transition-colors duration-200 disabled:opacity-50"
                    title={`Mark ${payment.description} as paid`}
                  >
                    ✓ Paid
                  </button>
                )}
                {markedAsPaid.includes(index) && (
                  <span className="ml-1 text-green-600 text-xs font-medium">✓ Added</span>
                )}
              </div>
            ))}

            <div className="flex items-center gap-3 ml-6">
              <span className="text-xl font-bold text-gray-900">{formatCurrency(totalAmount)}</span>
              <div className="flex items-center gap-1 text-red-500 text-sm">
                <span>📍</span>
                <span>{daysRemaining} days</span>
              </div>
            </div>
          </div>
          
          <a 
            href="https://commerce.cashnet.com/cashneti/static/epayment/cpslopay/login"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-cal-poly-gold hover:bg-yellow-500 text-cal-poly-forest font-medium py-2 px-4 rounded-md transition-all duration-200 flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span>Cal Poly Portal</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NextPaymentDue;