import React, { useState, useEffect } from 'react';
import { expenseService } from './services/expenseService';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import FilterButtons from './components/FilterButtons';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = expenseService.subscribeToExpenses((expenseData, error) => {
      if (error) {
        setError('Failed to load expenses. Please check your connection.');
        setIsLoading(false);
      } else {
        setExpenses(expenseData);
        setError(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cal-poly-forest via-cal-poly-market to-cal-poly-surf">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl"></div>
      
      <div className="relative z-10">
        <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-cal-poly-forest/10">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-cal-poly-forest">
                  Sofia's College Expense Tracker
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Cal Poly San Luis Obispo • Shared by Leslie & Ian
                </p>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Live Sync Active</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cal-poly-forest mx-auto"></div>
                <p className="mt-4 text-white/80">Loading expenses...</p>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <ExpenseForm onExpenseAdded={() => {}} />
                <ExpenseSummary expenses={expenses} />
              </div>
              
              <div className="lg:col-span-2 space-y-6">
                <FilterButtons 
                  currentFilter={filter} 
                  onFilterChange={setFilter} 
                />
                <ExpenseList 
                  expenses={expenses} 
                  filter={filter} 
                />
              </div>
            </div>
          )}
        </main>

        <footer className="mt-16 pb-8">
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

export default App;
