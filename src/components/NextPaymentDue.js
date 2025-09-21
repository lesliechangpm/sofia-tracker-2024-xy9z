import React from 'react';
import { getNextPaymentsDue, getDaysUntilNextPayment, formatCurrency } from '../data/paymentSchedule';

const NextPaymentDue = () => {
  console.log('NextPaymentDue component called!');
  
  const nextPayments = getNextPaymentsDue();
  const daysRemaining = getDaysUntilNextPayment();
  
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

  return (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-600 text-sm">
            <div className="flex items-center gap-1">
              <span>📅</span>
              <span className="text-gray-700">Next Due {formatDate(nextDate)}:</span>
            </div>
            
            {nextPayments.map((payment, index) => (
              <div key={index} className="flex items-center gap-1">
                <span>{payment.description === 'Dining' ? '🍽️' : '🏠'}</span>
                <span className="text-gray-700">{payment.description}</span>
                <span className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</span>
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