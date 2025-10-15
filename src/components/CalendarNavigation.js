import React from 'react';

const CalendarNavigation = ({ 
  currentMonth, 
  currentYear, 
  monthNames, 
  onNavigate,
  onMonthChange,
  onYearChange 
}) => {
  const years = [2024, 2025, 2026];
  
  const handleMonthChange = (e) => {
    onMonthChange(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    onYearChange(parseInt(e.target.value));
  };

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={() => onNavigate('prev')}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        aria-label="Previous month"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="flex items-center gap-2">
        <select
          value={currentMonth}
          onChange={handleMonthChange}
          className="text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-1.5 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-cal-poly-forest focus:border-transparent"
        >
          {monthNames.map((month, index) => (
            <option key={month} value={index}>
              {month}
            </option>
          ))}
        </select>
        
        <select
          value={currentYear}
          onChange={handleYearChange}
          className="text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-1.5 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-cal-poly-forest focus:border-transparent"
        >
          {years.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => onNavigate('next')}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        aria-label="Next month"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default CalendarNavigation;