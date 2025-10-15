import React, { useState } from 'react';
import { getEventsForDate, hasEvents, eventTypeLabels } from '../data/academicCalendar';
import CalendarNavigation from './CalendarNavigation';
import CalendarEventList from './CalendarEventList';

const AcademicCalendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEvents, setShowEvents] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const isToday = (day) => {
    return day === today.getDate() && 
           currentMonth === today.getMonth() && 
           currentYear === today.getFullYear();
  };

  const isSelected = (day) => {
    return selectedDate && 
           selectedDate.day === day && 
           selectedDate.month === currentMonth && 
           selectedDate.year === currentYear;
  };

  const handleDateClick = (day) => {
    const newSelectedDate = {
      day,
      month: currentMonth,
      year: currentYear
    };
    
    if (isSelected(day)) {
      setSelectedDate(null);
      setShowEvents(false);
    } else {
      setSelectedDate(newSelectedDate);
      const events = getEventsForDate(currentYear, currentMonth + 1, day);
      setShowEvents(events.length > 0);
    }
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
    setSelectedDate(null);
    setShowEvents(false);
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth, currentYear);
    const startDay = firstDayOfMonth(currentMonth, currentYear);

    // Empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-10"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= totalDays; day++) {
      const hasEvent = hasEvents(currentYear, currentMonth + 1, day);
      const events = hasEvent ? getEventsForDate(currentYear, currentMonth + 1, day) : [];
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`
            h-10 rounded-lg border transition-all duration-200 relative
            ${isToday(day) 
              ? 'bg-cal-poly-gold text-white border-cal-poly-gold font-bold' 
              : isSelected(day)
              ? 'bg-cal-poly-forest text-white border-cal-poly-forest'
              : hasEvent
              ? 'bg-blue-50 hover:bg-blue-100 border-blue-200 font-medium'
              : 'hover:bg-gray-50 border-gray-200'
            }
          `}
        >
          <span className="text-sm">{day}</span>
          {hasEvent && !isToday(day) && !isSelected(day) && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
              {events.slice(0, 3).map((event, idx) => (
                <div 
                  key={idx} 
                  className={`w-1 h-1 rounded-full ${
                    event.type === 'exam' ? 'bg-red-500' :
                    event.type === 'holiday' ? 'bg-cal-poly-gold' :
                    event.type === 'term' ? 'bg-cal-poly-forest' :
                    event.type === 'commencement' ? 'bg-purple-600' :
                    'bg-cal-poly-surf'
                  }`}
                />
              ))}
            </div>
          )}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="card">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-cal-poly-forest">Academic Calendar</h2>
        <p className="text-sm text-gray-600 mt-1">Cal Poly SLO 2024-2026</p>
      </div>

      <CalendarNavigation
        currentMonth={currentMonth}
        currentYear={currentYear}
        monthNames={monthNames}
        onNavigate={navigateMonth}
        onMonthChange={setCurrentMonth}
        onYearChange={setCurrentYear}
      />

      <div className="mt-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Event Type Legend */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex flex-wrap gap-2 text-xs">
          {Object.entries(eventTypeLabels).map(([type, label]) => (
            <div key={type} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${
                type === 'exam' ? 'bg-red-500' :
                type === 'holiday' ? 'bg-cal-poly-gold' :
                type === 'term' ? 'bg-cal-poly-forest' :
                type === 'commencement' ? 'bg-purple-600' :
                type === 'break' ? 'bg-orange-500' :
                'bg-cal-poly-surf'
              }`} />
              <span className="text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <CalendarEventList
          selectedDate={selectedDate}
          monthNames={monthNames}
          showEvents={showEvents}
        />
      )}
    </div>
  );
};

export default AcademicCalendar;