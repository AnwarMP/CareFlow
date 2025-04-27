import React, { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { ArrowLeft, ArrowRight, Pill, Activity, Calendar, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { format, addDays, parseISO } from "date-fns";
import { toast } from "../ui/sonner";

// Updated to match your database schema
type EventType = 'medication' | 'exercise' | 'appointment';
type EventStatus = 'pending' | 'completed' | 'missed';

// Interface updated to match your backend structure
interface Event {
  id: string;
  type: EventType;
  status: EventStatus;
  event_date_to_complete_by: string;
  event_header: string;
  event_description: string;
  priority: number;
}

interface DayColumn {
  date: Date;
  label: string;
  events: Event[];
}

const EventCard = ({ event, onStatusChange }: { 
  event: Event;
  onStatusChange: (id: string, newStatus: EventStatus) => void;
}) => {
  const getEventIcon = (type: EventType) => {
    switch (type) {
      case 'medication':
        return <Pill className="w-5 h-5 text-primary-teal" />;
      case 'exercise':
        return <Activity className="w-5 h-5 text-accent-orange" />;
      case 'appointment':
        return <Calendar className="w-5 h-5 text-primary-light" />;
    }
  };

  const getEventTime = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'h:mm a');
    } catch (e) {
      return "Time not specified";
    }
  };

  return (
    <Card className="p-4 mb-4 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start gap-3">
        {getEventIcon(event.type)}
        <div className="flex-1">
          <h4 className="font-medium">{event.event_header}</h4>
          <p className="text-sm text-gray-600">{event.event_description}</p>
          <p className="text-sm text-gray-500 mt-1">{getEventTime(event.event_date_to_complete_by)}</p>
          
          {event.status === 'pending' && (
            <button 
              onClick={() => onStatusChange(event.id, 'completed')}
              className="text-sm text-primary-teal mt-2 hover:text-primary-light transition-colors"
            >
              Mark as done
            </button>
          )}
          
          {event.status === 'completed' && (
            <p className="text-sm text-green-600 mt-2">Completed</p>
          )}
          
          {event.status === 'missed' && (
            <div className="flex mt-2">
              <p className="text-sm text-red-600 mr-2">Missed</p>
              <button 
                onClick={() => onStatusChange(event.id, 'completed')}
                className="text-sm text-primary-teal hover:text-primary-light transition-colors"
              >
                Complete anyway
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

const ThreeDayView = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const eventsPerPage = 3;

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('http://127.0.0.1:8000/get-events');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status}`);
        }
        
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching events:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  // Handle status change
  const handleStatusChange = async (id: string, newStatus: EventStatus) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/update-event-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          status: newStatus
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status}`);
      }
      
      // Update local state
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === id ? { ...event, status: newStatus } : event
        )
      );
      
      toast.success('Event status updated successfully');
    } catch (err) {
      console.error('Error updating event status:', err);
      toast.error('Failed to update event status');
    }
  };

  const generateDayColumns = (): DayColumn[] => {
    const days: DayColumn[] = [];
    const startDate = new Date(); // Today
    const startIndex = currentPageIndex * eventsPerPage;

    for (let i = 0; i < eventsPerPage; i++) {
      const currentDate = addDays(startDate, startIndex + i);
      const formattedDate = format(currentDate, 'yyyy-MM-dd');
      
      // Filter events for this day
      const dayEvents = events.filter(event => {
        try {
          const eventDate = parseISO(event.event_date_to_complete_by);
          return format(eventDate, 'yyyy-MM-dd') === formattedDate;
        } catch {
          return false;
        }
      });
      
      // Sort events by priority and then by time
      dayEvents.sort((a, b) => {
        // First by priority (lower number = higher priority)
        if (a.priority !== b.priority) {
          return a.priority - b.priority;
        }
        
        // Then by time
        const timeA = parseISO(a.event_date_to_complete_by);
        const timeB = parseISO(b.event_date_to_complete_by);
        return timeA.getTime() - timeB.getTime();
      });
      
      days.push({
        date: currentDate,
        label: format(currentDate, 'EEEE, MMM d'),
        events: dayEvents
      });
    }
    
    return days;
  };

  const navigateDays = (direction: 'prev' | 'next') => {
    if (direction === 'next') {
      setCurrentPageIndex(prev => prev + 1);
    } else if (direction === 'prev' && currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
    }
  };

  const isFirstPage = currentPageIndex === 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 text-primary-teal animate-spin" />
        <span className="ml-2">Loading events...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">
        <p className="font-medium">Error loading events</p>
        <p className="text-sm">{error}</p>
        <Button 
          onClick={() => window.location.reload()}
          variant="outline" 
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  const dayColumns = generateDayColumns();

  return (
    <div className="relative px-8">
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigateDays('prev')}
          className="rounded-full shadow-sm hover:bg-gray-100"
          disabled={isFirstPage}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dayColumns.map((column, index) => (
          <div key={index}>
            <h3 className="font-medium mb-4 text-gray-700">{column.label}</h3>
            <div className="space-y-4">
              {column.events.map(event => (
                <EventCard 
                  key={event.id} 
                  event={event}
                  onStatusChange={handleStatusChange}
                />
              ))}
              {column.events.length === 0 && (
                <p className="text-gray-500 text-sm">No events scheduled</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigateDays('next')}
          className="rounded-full shadow-sm hover:bg-gray-100"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ThreeDayView;