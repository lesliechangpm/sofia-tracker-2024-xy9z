// src/App.js
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
import AcademicCalendar from './components/AcademicCalendar';

// 🔐 Auth imports
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  signInWithPopup,
  signInWithRedirect,
} from 'firebase/auth';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  // ✅ Auth-aware subscription to expenses with popup→redirect fallback
  useEffect(() => {
    const auth = getAuth();
    let unsubscribeExpenses = null;

    // Make login persist across refreshes
    setPersistence(auth, browserLocalPersistence).catch((e) => {
      console.error('setPersistence error:', e);
    });

    const handleSignedIn = (user) => {
      // If user changes, re-subscribe cleanly
      if (unsubscribeExpenses) {
        unsubscribeExpenses();
        unsubscribeExpenses = null;
      }

      unsubscribeExpenses = expenseService.subscribeToExpenses(
        user.uid,
        (expenseData, err) => {
          if (err) {
            console.error('subscribeToExpenses error:', err);
            setError('Failed to load expenses. Please check your connection.');
            setIsLoading(false);
          } else {
            setExpenses(expenseData);
            setError(null);
            setIsLoading(false);
          }
        }
      );
    };

    const attemptSignIn = async () => {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        // onAuthStateChanged will fire next
      } catch (e) {
        console.warn('Popup sign-in failed; trying redirect...', e?.code || e);
        // Common popup issues: auth/popup-blocked, auth/cancelled-popup-request
        // Fallback to redirect flow (more reliable)
        const provider = new GoogleAuthProvider();
        await signInWithRedirect(auth, provider);
      }
    };

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsLoading(true);
        setError(null);
        try {
          await attemptSignIn();
        } catch (e) {
          console.error('Sign-in error:', e);
          const msg =
            e?.code === 'auth/operation-not-allowed'
              ? 'Google sign-in is not enabled in your Firebase project. Enable it in Console → Authentication → Sign-in method.'
              : 'Sign-in failed. Please try again.';
          setError(msg);
          setIsLoading(false);
        }
        return;
      }
      // We have a user
      handleSignedIn(user);
    });

    // Cleanup on unmount
    return () => {
      if (unsubscribeExpenses) unsubscribeExpenses();
      unsubscribeAuth();
    };
  }, []);

  // Load Instagram embed script (unchanged)
  useEffect(() => {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
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
                  Sofia&apos;s College Expense Tracker
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-0.5">
                  Cal Poly San Luis Obispo • Shared by Leslie &amp; Ian
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
                  <AcademicCalendar />
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
                  <DateRangeFilter onDateRangeChange={setDateRange} />
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

        {/* Instagram Embed Section */}
        <section className="mt-16 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-cal-poly-forest mb-6 text-center">
                Cal Poly Parent &amp; Family Programs
              </h2>
              <div className="flex justify-center">
                <div
                  dangerouslySetInnerHTML={{
                    __html: `
                      <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/calpolyparent/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/calpolyparent/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 560.06,27.196 561.058,27.846 562.623,28.894 565.378,32.338 C565.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">View this profile on Instagram</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 144px;"></div></div></a><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/calpolyparent/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px;" target="_blank">Cal Poly Parent and Family Programs</a> (@<a href="https://www.instagram.com/calpolyparent/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px;" target="_blank">calpolyparent</a>) • Instagram photos and videos</p></div></blockquote>
                    `
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-20 pb-10 pt-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white/70 text-sm sm:text-base">
              <p>Made with ❤️ for Sofia&apos;s education</p>
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
