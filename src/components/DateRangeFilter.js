import React, { useState } from 'react';

const DateRangeFilter = ({ onDateRangeChange, className = '' }) => {
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('all');

  const getDateRange = (preset) => {
    const today = new Date();
    const startOfDay = (date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    };
    const endOfDay = (date) => {
      const d = new Date(date);
      d.setHours(23, 59, 59, 999);
      return d;
    };

    switch (preset) {
      case 'today':
        return {
          start: startOfDay(today),
          end: endOfDay(today)
        };
      
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - 7);
        return {
          start: startOfDay(weekStart),
          end: endOfDay(today)
        };
      
      case 'month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        return {
          start: startOfDay(monthStart),
          end: endOfDay(today)
        };
      
      case 'quarter':
        const quarterStart = new Date(today);
        quarterStart.setMonth(today.getMonth() - 3);
        return {
          start: startOfDay(quarterStart),
          end: endOfDay(today)
        };
      
      case 'year':
        const yearStart = new Date(today.getFullYear(), 0, 1);
        return {
          start: startOfDay(yearStart),
          end: endOfDay(today)
        };
      
      case 'all':
      default:
        return {
          start: null,
          end: null
        };
    }
  };

  const handlePresetChange = (preset) => {
    setSelectedPreset(preset);
    setIsCustomRange(false);
    const range = getDateRange(preset);
    onDateRangeChange(range);
  };

  const handleCustomRangeApply = () => {
    if (startDate && endDate) {
      const range = {
        start: new Date(startDate + 'T00:00:00'),
        end: new Date(endDate + 'T23:59:59')
      };
      onDateRangeChange(range);
      setSelectedPreset('custom');
    }
  };

  const clearCustomRange = () => {
    setStartDate('');
    setEndDate('');
    setIsCustomRange(false);
    setSelectedPreset('all');
    onDateRangeChange({ start: null, end: null });
  };

  return (
    <div className={`bg-white rounded-xl shadow-soft border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-all duration-300 ${className}`}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800 tracking-tight">📅 Date Range</h3>
          {isCustomRange && (
            <button
              onClick={clearCustomRange}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          )}
        </div>
        
        {/* Preset buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'All Time' },
            { value: 'today', label: 'Today' },
            { value: 'week', label: 'Last 7 Days' },
            { value: 'month', label: 'This Month' },
            { value: 'quarter', label: 'Last 3 Months' },
            { value: 'year', label: 'This Year' }
          ].map(preset => (
            <button
              key={preset.value}
              onClick={() => handlePresetChange(preset.value)}
              className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
                selectedPreset === preset.value && !isCustomRange
                  ? 'bg-cal-poly-forest text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
          <button
            onClick={() => setIsCustomRange(!isCustomRange)}
            className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
              isCustomRange
                ? 'bg-cal-poly-market text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Custom Range
          </button>
        </div>

        {/* Custom date range inputs */}
        {isCustomRange && (
          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cal-poly-forest focus:border-transparent"
              placeholder="Start date"
            />
            <span className="text-gray-500 text-sm self-center">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cal-poly-forest focus:border-transparent"
              placeholder="End date"
            />
            <button
              onClick={handleCustomRangeApply}
              disabled={!startDate || !endDate}
              className="px-4 py-1.5 text-sm bg-cal-poly-forest text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Apply
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateRangeFilter;