import React from 'react';
import { expenseService } from '../services/expenseService';

const ExpenseSummary = ({ expenses }) => {
  const totals = expenseService.calculateTotals(expenses);

  const StatCard = ({ label, value, color, percentage, subtitle }) => (
    <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-600">{label}</p>
            {percentage && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                label.includes('Leslie') ? 'bg-pink-100 text-parent-leslie' : 'bg-blue-100 text-parent-ian'
              }`}>
                {percentage}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="text-right">
          <p className={`text-lg sm:text-xl font-bold ${color}`}>
            {expenseService.formatCurrency(value)}
          </p>
        </div>
      </div>
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
        <h2 className="text-2xl font-bold text-cal-poly-forest">Expense Summary</h2>
      </div>

      <div className="flex flex-col gap-3 mb-6">
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

    </div>
  );
};

export default ExpenseSummary;