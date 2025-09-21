import React, { useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import FilterButtons from './components/FilterButtons';
import NextPaymentDue from './components/NextPaymentDue';

// Mock data for demo/testing purposes
const mockExpenses = [
  {
    id: '1',
    payer: 'Leslie',
    amount: 250.00,
    description: 'Textbooks for Winter Quarter',
    date: '2024-01-15',
    timestamp: new Date('2024-01-15')
  },
  {
    id: '2',
    payer: 'Ian',
    amount: 450.00,
    description: 'Meal Plan Payment',
    date: '2024-01-10',
    timestamp: new Date('2024-01-10')
  },
  {
    id: '3',
    payer: 'Leslie',
    amount: 125.50,
    description: 'Dorm Supplies - Bedding & Storage',
    date: '2024-01-08',
    timestamp: new Date('2024-01-08')
  },
  {
    id: '4',
    payer: 'Ian',
    amount: 89.99,
    description: 'Parking Permit',
    date: '2024-01-05',
    timestamp: new Date('2024-01-05')
  },
  {
    id: '5',
    payer: 'Leslie',
    amount: 320.00,
    description: 'Lab Equipment for Chemistry',
    date: '2024-01-03',
    timestamp: new Date('2024-01-03')
  }
];

function AppDemo() {
  const [expenses, setExpenses] = useState(mockExpenses);
  const [filter, setFilter] = useState('all');

  // Simulate adding an expense
  const handleAddExpense = (newExpense) => {
    const expense = {
      ...newExpense,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setExpenses(prev => [expense, ...prev]);
  };

  // Simulate deleting an expense
  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cal-poly-forest via-cal-poly-market to-cal-poly-surf">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl"></div>
      
      <div className="relative z-10">
        {/* Header with improved spacing */}
        <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-cal-poly-forest/10">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <img 
                  src={`${process.env.PUBLIC_URL}/sofia.jpg`}
                  alt="Sofia" 
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-cal-poly-gold shadow-lg"
                />
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-cal-poly-forest">
                    Sofia's College Expense Tracker
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Cal Poly San Luis Obispo • Shared by Leslie & Ian
                  </p>
                </div>
              </div>
              {/* Removed old Pay button - now in NextPaymentDue component */}
            </div>
          </div>
        </header>

        <NextPaymentDue />

        {/* Main content with improved spacing */}
        <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Left column - Form and Summary */}
              <div className="lg:col-span-1">
                <div className="space-y-4 sm:space-y-6">
                  <ExpenseForm onExpenseAdded={handleAddExpense} />
                  <ExpenseSummary expenses={expenses} />
                </div>
              </div>
              
              {/* Right column - Filter and List */}
              <div className="lg:col-span-2">
                <div className="space-y-4 sm:space-y-6">
                  <FilterButtons 
                    currentFilter={filter} 
                    onFilterChange={setFilter} 
                  />
                  <ExpenseList 
                    expenses={expenses} 
                    filter={filter}
                    onDeleteExpense={handleDeleteExpense}
                  />
                </div>
              </div>
            </div>
        </main>

        {/* Footer with improved spacing */}
        <footer className="mt-12 sm:mt-16 pb-6 sm:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white/60 text-sm">
              <p>Made with ❤️ for Sofia's education</p>
              <p className="mt-1">Cal Poly SLO • Learn by Doing</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default AppDemo;