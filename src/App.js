import React, { useState, useEffect } from 'react';
import { expenseService } from './services/expenseService';
import AddExpenseButton from './components/AddExpenseButton';
import ExpenseFormModal from './components/ExpenseFormModal';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import FilterButtons from './components/FilterButtons';
import NextPaymentDue from './components/NextPaymentDue';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <img 
                src={`${process.env.PUBLIC_URL}/sofia.jpg`}
                alt="Sofia" 
                className="w-10 h-10 rounded-full object-cover border-2 border-cal-poly-gold shadow"
              />
              <div className="flex-1">
                <h1 className="text-lg font-bold text-cal-poly-forest">
                  Sofia's College Expense Tracker
                </h1>
                <p className="text-xs text-gray-600">
                  Cal Poly San Luis Obispo • Shared by Leslie & Ian
                </p>
              </div>
            </div>
          </div>
        </header>

        <NextPaymentDue />

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
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                  <AddExpenseButton onClick={() => setIsModalOpen(true)} />
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
          </>
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
      
      {/* Modal */}
      <ExpenseFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

export default App;
