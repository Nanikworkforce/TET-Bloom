"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  color?: string;
  description?: string;
}

interface CalendarProps {
  events?: CalendarEvent[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  className?: string;
}

const Calendar: React.FC<CalendarProps> = ({
  events = [],
  onDateClick,
  onEventClick,
  className
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const today = new Date();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const getNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    onDateClick?.(clickedDate);
  };

  const getEventsForDate = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return events.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  const isToday = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date.toDateString() === selectedDate.toDateString();
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day);
      const hasEvents = dayEvents.length > 0;
      
      days.push(
        <div
          key={day}
          className={cn(
            "h-8 w-8 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-200 relative group",
            "hover:scale-105",
            isToday(day) && "text-white font-bold shadow-md",
            isSelected(day) && !isToday(day) && "font-semibold",
            hasEvents && !isToday(day) && !isSelected(day) && ""
          )}
          style={{
            ...(isToday(day) ? {
              background: 'linear-gradient(135deg, rgba(132, 84, 124, 1) 0%, rgba(228, 164, 20, 1) 100%)'
            } : {}),
            ...(isSelected(day) && !isToday(day) ? {
              backgroundColor: 'rgba(132, 84, 124, 0.1)',
              color: '#84547c'
            } : {}),
            ...(hasEvents && !isToday(day) && !isSelected(day) ? {
              backgroundColor: 'rgba(228, 164, 20, 0.1)',
              color: '#e4a414'
            } : {})
          }}
          onMouseEnter={(e) => {
            if (!isToday(day) && !isSelected(day) && !hasEvents) {
              (e.target as HTMLElement).style.background = 'linear-gradient(135deg, rgba(132, 84, 124, 0.05) 0%, rgba(228, 164, 20, 0.05) 100%)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isToday(day) && !isSelected(day) && !hasEvents) {
              (e.target as HTMLElement).style.background = 'transparent';
            }
          }}
          onClick={() => handleDateClick(day)}
        >
          <span className="text-xs relative z-10">{day}</span>
          {hasEvents && (
            <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-0.5">
                {dayEvents.slice(0, 3).map((event, index) => (
                  <div
                    key={event.id}
                    className={cn(
                      "w-1 h-1 rounded-full",
                      event.color || "bg-[#e4a414]"
                    )}
                  />
                ))}
                {dayEvents.length > 3 && (
                  <div className="w-1 h-1 rounded-full bg-gray-400" />
                )}
              </div>
            </div>
          )}
          
          {/* Tooltip for events */}
          {hasEvents && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
              <div className="bg-gray-900 text-white text-xs rounded-lg px-2 py-1 shadow-lg max-w-32">
                <div className="font-medium">{dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}</div>
                {dayEvents.slice(0, 2).map(event => (
                  <div key={event.id} className="truncate">{event.title}</div>
                ))}
                {dayEvents.length > 2 && <div>+{dayEvents.length - 2} more</div>}
              </div>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className={cn("bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden", className)}>
      {/* Calendar Header */}
      <div className="p-4 text-white" style={{background: 'linear-gradient(90deg, rgba(132, 84, 124, 1) 0%, rgba(228, 164, 20, 1) 100%)'}}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <CalendarIcon size={20} />
            </div>
            <h2 className="text-lg font-bold">Event Calendar</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={getPreviousMonth}
              className="text-white hover:bg-white/20 border-0"
            >
              <ChevronLeft size={16} />
            </Button>
            
            <div className="text-base font-semibold min-w-[120px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={getNextMonth}
              className="text-white hover:bg-white/20 border-0"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
        
        {/* Current Date Info */}
        <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
          <div className="text-xs opacity-90">Today</div>
          <div className="text-sm font-semibold">
            {today.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric'
            })}
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-3">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <div className="border-t border-gray-100 p-4" style={{background: 'linear-gradient(90deg, rgba(132, 84, 124, 0.05) 0%, rgba(228, 164, 20, 0.05) 100%)'}}>
          <h3 className="font-semibold text-gray-800 mb-3">
            Events for {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          {getEventsForDate(selectedDate.getDate()).length > 0 ? (
            <div className="space-y-2">
              {getEventsForDate(selectedDate.getDate()).map(event => (
                <div
                  key={event.id}
                  className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onEventClick?.(event)}
                >
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: event.color || "#e4a414"}} />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{event.title}</div>
                    {event.description && (
                      <div className="text-sm text-gray-600">{event.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No events scheduled for this date.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Calendar;
