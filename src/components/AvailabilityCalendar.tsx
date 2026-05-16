import React, { useEffect, useState } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  isBefore,
  startOfDay
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toDateKey } from '../lib/ical';
import { supabase } from '../lib/supabase';

interface AvailabilityCalendarProps {
  roomId: string;
}

const fetchCachedBookedDates = async (roomId: string) => {
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase
    .from('calendar_cache')
    .select('booked_dates')
    .eq('room_id', roomId)
    .maybeSingle();

  if (error) throw error;
  if (!data?.booked_dates) return new Set<string>();

  return new Set(data.booked_dates as string[]);
};

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ roomId }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<'loading' | 'synced' | 'unavailable'>('loading');

  useEffect(() => {
    let cancelled = false;

    const syncCalendar = async (showLoading = false) => {
      if (showLoading) setStatus('loading');

      try {
        const cachedDates = await fetchCachedBookedDates(roomId);
        if (cancelled) return;

        setBookedDates(cachedDates);
        setStatus('synced');
        return;
      } catch {
        if (cancelled) return;

        setBookedDates(new Set());
        setStatus('unavailable');
      }
    };

    syncCalendar(true);
    const interval = window.setInterval(() => syncCalendar(), 30000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [roomId]);

  const isAvailable = (date: Date) => {
    const today = startOfDay(new Date());
    
    // Past dates are unavailable
    if (isBefore(date, today)) return false;

    return !bookedDates.has(toDateKey(date));
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between px-2 mb-8">
        <h3 className="label-caps text-xs text-primary font-bold">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <div className="flex gap-4">
          <button 
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 border border-divider-subtle hover:border-primary transition-colors hover:bg-primary/5 rounded-lg"
          >
            <ChevronLeft size={14} />
          </button>
          <button 
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 border border-divider-subtle hover:border-primary transition-colors hover:bg-primary/5 rounded-lg"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-4">
        {days.map((day, index) => (
          <div key={index} className="text-center label-caps text-[8px] text-text-muted">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        const available = isAvailable(day);
        
        days.push(
          <div
            key={day.toString()}
            className={`relative h-16 flex items-center justify-center text-sm font-mono border-t border-l border-divider-subtle last:border-r transition-colors duration-200
              ${!isSameMonth(day, monthStart) ? "text-text-muted/20" : available ? "bg-primary/20 text-primary hover:bg-primary/30 cursor-pointer" : "text-text-muted cursor-not-allowed"}
              ${isSameDay(day, selectedDate) && available ? "!bg-primary !text-on-primary font-bold" : ""}`}
            onClick={() => available && setSelectedDate(cloneDay)}
          >
            <span className="z-10">{formattedDate}</span>
            {!available && isSameMonth(day, monthStart) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-[1px] bg-divider-subtle rotate-45 opacity-30" />
              </div>
            )}
            {isSameDay(day, new Date()) && !isSameDay(day, selectedDate) && (
              <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 last:border-b border-divider-subtle" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="bg-surface-container/50 border border-divider-subtle p-10 rounded-2xl">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      
      <div className="mt-8 flex items-center gap-8 px-2">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-sm border border-primary bg-primary/10" />
          <span className="label-caps text-[10px] text-text-muted">Available</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-sm border border-divider-subtle relative overflow-hidden">
             <div className="absolute inset-0 w-full h-[1px] bg-divider-subtle rotate-45 opacity-50 translate-y-1" />
          </div>
          <span className="label-caps text-[10px] text-text-muted">Booked</span>
        </div>
      </div>

      <div className="mt-12 pt-10 border-t border-divider-subtle flex items-center justify-between">
        <div>
          <p className="text-[10px] text-text-muted italic mb-3 uppercase tracking-[0.2em]">Initial Residency Date</p>
          <h4 className="text-3xl font-display italic text-primary">{format(selectedDate, 'MMMM dd, yyyy')}</h4>
        </div>
        <div className="hidden md:block text-right">
           <p className="text-[10px] text-text-muted italic mb-1 uppercase tracking-[0.2em]">Status</p>
           <span className="text-sm font-bold text-primary italic">
             {status === 'synced' ? 'Airbnb Calendar Synced' : status === 'loading' ? 'Syncing Calendar' : 'Calendar Unavailable'}
           </span>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
