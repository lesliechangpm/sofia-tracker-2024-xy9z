import React from 'react';
import { expenseService } from '../services/expenseService';

const ExpenseSummary = ({ expenses }) => {
  const totals = expenseService.calculateTotals(expenses);

  const StatCard = ({ label, value, color, percentage, subtitle }) => (
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className={`text-2xl font-bold ${color}`}>
            {expenseService.formatCurrency(value)}
          </p>
        </div>
        {percentage && (
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            label.includes('Leslie') ? 'bg-pink-100 text-parent-leslie' : 'bg-blue-100 text-parent-ian'
          }`}>
            {percentage}%
          </div>
        )}
      </div>
      {subtitle && (
        <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
      )}
    </div>
  );

  const getBalanceMessage = () => {
    if (totals.leslieOwes > 0.01) {
      return {
        text: `Leslie owes Ian ${expenseService.formatCurrency(totals.leslieOwes)}`,
        color: 'text-parent-leslie'
      };
    } else if (totals.ianOwes > 0.01) {
      return {
        text: `Ian owes Leslie ${expenseService.formatCurrency(totals.ianOwes)}`,
        color: 'text-parent-ian'
      };
    } else {
      return {
        text: 'Expenses are balanced!',
        color: 'text-green-600'
      };
    }
  };

  const balance = getBalanceMessage();

  return (
    <div className="card">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-cal-poly-forest mb-2">Expense Summary</h2>
        <p className="text-sm text-gray-600">For Sofia's Cal Poly expenses</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total Expenses"
          value={totals.total}
          color="text-cal-poly-forest"
          subtitle={`${expenses.length} expenses tracked`}
        />
        <StatCard
          label="Leslie's Total"
          value={totals.leslie}
          color="text-parent-leslie"
          percentage={totals.lesliePercentage}
          subtitle={`Target: ${expenseService.formatCurrency(totals.total / 2)}`}
        />
        <StatCard
          label="Ian's Total"
          value={totals.ian}
          color="text-parent-ian"
          percentage={totals.ianPercentage}
          subtitle={`Target: ${expenseService.formatCurrency(totals.total / 2)}`}
        />
      </div>

      <div className="bg-gradient-to-r from-cal-poly-forest to-cal-poly-market rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">Current Balance</p>
            <p className="text-lg font-bold">{balance.text}</p>
          </div>
          <div className="flex items-center">
            <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="flex h-full">
                <div 
                  className="bg-parent-leslie h-full transition-all duration-500"
                  style={{ width: `${totals.lesliePercentage}%` }}
                />
                <div 
                  className="bg-parent-ian h-full transition-all duration-500"
                  style={{ width: `${totals.ianPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {expenses.length > 0 && (
        <div className="mt-6 p-4 bg-cal-poly-surf/10 rounded-lg border border-cal-poly-surf/30">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-cal-poly-surf mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm">
              <p className="font-medium text-cal-poly-forest">Quick Tip</p>
              <p className="text-gray-600 mt-1">
                Each parent should aim to contribute 50% of total expenses. 
                The app automatically calculates who owes whom to maintain balance.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseSummary;