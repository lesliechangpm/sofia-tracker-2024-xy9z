import React from 'react';
import { getEventsForDate, eventTypeColors } from '../data/academicCalendar';

const CalendarEventList = ({ selectedDate, monthNames, showEvents }) => {
  if (!selectedDate) return null;

  const events = getEventsForDate(selectedDate.year, selectedDate.month + 1, selectedDate.day);
  
  const getEventTypeIcon = (type) => {
    switch(type) {
      case 'term': return '📚';
      case 'holiday': return '🎉';
      case 'registration': return '📝';
      case 'exam': return '📖';
      case 'break': return '🌴';
      case 'commencement': return '🎓';
      default: return '📅';
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-gray-700">
          {monthNames[selectedDate.month]} {selectedDate.day}, {selectedDate.year}
        </h3>
      </div>
      
      {events.length > 0 ? (
        <div className="space-y-2">
          {events.map((event, index) => (
            <div 
              key={index}
              className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors duration-200"
            >
              <div className="flex items-start gap-2">
                <span className="text-lg mt-0.5">{getEventTypeIcon(event.type)}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-gray-800">
                      {event.title}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${eventTypeColors[event.type]}`}>
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                  </div>
                  {event.description && (
                    <p className="text-xs text-gray-600">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">No events scheduled for this date</p>
      )}
    </div>
  );
};

export default CalendarEventList;