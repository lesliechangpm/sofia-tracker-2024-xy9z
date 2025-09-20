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
              <a 
                href="https://commerce.cashnet.com/cashneti/static/epayment/cpslopay/login"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-cal-poly-gold hover:bg-cal-poly-gold/90 text-cal-poly-forest font-bold py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="hidden sm:inline">Pay Cal Poly Bill</span>
                <span className="sm:hidden">Pay Bill</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                <ExpenseForm />
                <ExpenseSummary expenses={expenses} />
              </div>
              
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
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
