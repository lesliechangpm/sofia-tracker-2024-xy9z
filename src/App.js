import React, { useState, useEffect } from 'react';
import { expenseService } from './services/expenseService';
import AddExpenseButton from './components/AddExpenseButton';
import ExpenseFormModal from './components/ExpenseFormModal';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import FilterButtons from './components/FilterButtons';
import NextPaymentDue from './components/NextPaymentDue';
import ActivityHistory from './components/ActivityHistory';
import DateRangeFilter from './components/DateRangeFilter';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: null, end: null });

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
        <header className="bg-white/95 backdrop-blur-sm shadow-soft sticky top-0 z-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:py-5 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 sm:gap-5">
              <img 
                src={`${process.env.PUBLIC_URL}/sofia.jpg`}
                alt="Sofia" 
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-cal-poly-gold shadow-xl ring-4 ring-cal-poly-gold/20 transition-transform duration-300 hover:scale-105"
              />
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-cal-poly-forest tracking-tight">
                  Sofia's College Expense Tracker
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-0.5">
                  Cal Poly San Luis Obispo • Shared by Leslie & Ian
                </p>
              </div>
            </div>
          </div>
        </header>

        <NextPaymentDue />

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-10">
                <div className="lg:col-span-1 space-y-5 sm:space-y-6">
                  <AddExpenseButton onClick={() => setIsModalOpen(true)} />
                  <ExpenseSummary expenses={expenses} dateRange={dateRange} />
                </div>
              
              <div className="lg:col-span-2 space-y-5 sm:space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <FilterButtons 
                      currentFilter={filter} 
                      onFilterChange={setFilter} 
                    />
                  </div>
                </div>
                <DateRangeFilter 
                  onDateRangeChange={setDateRange}
                />
                <ExpenseList 
                  expenses={expenses} 
                  filter={filter}
                  dateRange={dateRange} 
                />
              </div>
            </div>
          </>
          )}
        </main>

        <footer className="mt-20 pb-10 pt-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white/70 text-sm sm:text-base">
              <p>Made with ❤️ for Sofia's education</p>
              <p className="mt-1">Cal Poly SLO • Learn by Doing</p>
              <div className="mt-4 flex justify-center items-center gap-4">
                <button
                  onClick={() => setIsHistoryOpen(true)}
                  className="text-white/70 hover:text-white transition-colors duration-200 flex items-center gap-1"
                >
                  📜 Activity History
                </button>
                <span className="text-white/40">•</span>
                <a 
                  href="#top"
                  className="text-white/70 hover:text-white transition-colors duration-200 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Back to Top ↑
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
      
      {/* Modals */}
      <ExpenseFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      
      <ActivityHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
}

export default App;
