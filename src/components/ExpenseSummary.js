import React from 'react';
import { expenseService } from '../services/expenseService';
import PieChart from './PieChart';

const ExpenseSummary = ({ expenses, dateRange }) => {
  // Apply date range filter to expenses for summary calculations
  const filteredExpenses = dateRange ? expenseService.filterByDateRange(expenses, dateRange) : expenses;
  const totals = expenseService.calculateTotals(filteredExpenses);

  const StatCard = ({ label, value, color, percentage, subtitle }) => (
    <div className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-700">{label}</p>
            {percentage && (
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                label.includes('Leslie') ? 'bg-gradient-to-r from-pink-100 to-rose-100 text-rose-700' : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700'
              }`}>
                {percentage}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1.5">{subtitle}</p>
          )}
        </div>
        <div className="text-right">
          <p className={`text-xl sm:text-2xl font-bold ${color} group-hover:scale-105 transition-transform duration-200`}>
            {expenseService.formatCurrency(value)}
          </p>
        </div>
      </div>
    </div>
  );


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
          subtitle={`${filteredExpenses.length} expenses ${dateRange?.start || dateRange?.end ? 'in range' : 'tracked'}`}
        />
        <StatCard
          label="Leslie's Total"
          value={totals.leslie}
          color="text-parent-leslie"
          percentage={totals.lesliePercentage}
        />
        <StatCard
          label="Ian's Total"
          value={totals.ian}
          color="text-parent-ian"
          percentage={totals.ianPercentage}
        />
      </div>
      
      {/* Pie Chart Visualization */}
      {totals.total > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-4 text-center">Expense Distribution</h3>
          <div className="flex justify-center">
            <PieChart 
              data={[
                {
                  label: 'Leslie',
                  value: totals.leslie,
                  color: '#ec4899' // Pink color for Leslie
                },
                {
                  label: 'Ian',
                  value: totals.ian,
                  color: '#3b82f6' // Blue color for Ian
                }
              ]}
              size={180}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseSummary;