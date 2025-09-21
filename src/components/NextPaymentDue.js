import React from 'react';
import { getNextPaymentsDue, getDaysUntilNextPayment, formatCurrency } from '../data/paymentSchedule';

const NextPaymentDue = () => {
  const nextPayments = getNextPaymentsDue();
  const daysRemaining = getDaysUntilNextPayment();

  // If no upcoming payments, don't render the component
  if (nextPayments.length === 0) {
    return null;
  }

  const nextDate = nextPayments[0].dateObj;
  const totalAmount = nextPayments.reduce((sum, payment) => sum + payment.amount, 0);
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const getPaymentIcon = (description) => {
    switch (description.toLowerCase()) {
      case 'dining':
        return '🍽️';
      case 'housing':
        return '🏠';
      default:
        return '💰';
    }
  };

  const getDaysRemainingText = (days) => {
    if (days === 0) return 'Due today';
    if (days === 1) return '1 day';
    return `${days} days`;
  };

  const getUrgencyColor = (days) => {
    if (days <= 7) return 'bg-red-50 border-red-200 text-red-700';
    if (days <= 14) return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    return 'bg-blue-50 border-blue-200 text-blue-700';
  };

  return (
    <div className="bg-gradient-to-r from-cal-poly-forest to-cal-poly-market text-white p-3 mb-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-cal-poly-gold">📅</span>
          <span className="text-sm">
            Next Payment: <strong>{formatDate(nextDate)}</strong>
          </span>
          <span className="text-white/80">•</span>
          <div className="flex items-center gap-2">
            {nextPayments.map((payment, index) => (
              <span key={index} className="text-sm">
                {payment.description}: <strong>{formatCurrency(payment.amount)}</strong>
                {index < nextPayments.length - 1 && <span className="ml-2 text-white/60">+</span>}
              </span>
            ))}
          </div>
          <span className="text-white/80">•</span>
          <span className={`text-sm font-semibold ${
            daysRemaining <= 7 ? 'text-cal-poly-gold' : 'text-white'
          }`}>
            {getDaysRemainingText(daysRemaining)}
          </span>
        </div>
        
        <a 
          href="https://commerce.cashnet.com/cashneti/static/epayment/cpslopay/login"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-cal-poly-gold hover:bg-yellow-400 text-cal-poly-forest font-semibold py-1.5 px-4 rounded-md transition-all duration-200 flex items-center gap-2 text-sm whitespace-nowrap self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span>Pay Cal Poly</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default NextPaymentDue;