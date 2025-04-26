import React, { useState } from "react";
import { Card } from "../ui/card";
import { ArrowLeft, ArrowRight, Pill, Activity, Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { format, addDays } from "date-fns";

type EventType = 'medication' | 'exercise' | 'appointment';

interface Event {
  id: number;
  type: EventType;
  title: string;
  description: string;
  time: string;
  date: string;
  status: 'pending' | 'completed' | 'missed';
}

interface DayColumn {
  date: Date;
  label: string;
  events: Event[];
}

const EventCard = ({ event }: { event: Event }) => {
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

  return (
    <Card className="p-4 mb-4 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start gap-3">
        {getEventIcon(event.type)}
        <div className="flex-1">
          <h4 className="font-medium">{event.title}</h4>
          <p className="text-sm text-gray-600">{event.description}</p>
          <p className="text-sm text-gray-500 mt-1">{event.time}</p>
          <button className="text-sm text-primary-teal mt-2 hover:text-primary-light transition-colors">
            Mark as done
          </button>
        </div>
      </div>
    </Card>
  );
};

const ThreeDayView = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const eventsPerPage = 3;
  const totalDays = 6;

  const sampleEvents: Event[] = [
    {
      id: 1,
      type: 'medication',
      title: 'Morning Medication',
      description: 'Take with breakfast',
      time: '8:00 AM',
      date: '4/26/2025',
      status: 'pending'
    },
    {
      id: 2,
      type: 'exercise',
      title: 'Physical Therapy',
      description: 'Knee strengthening exercises',
      time: '2:00 PM',
      date: '4/26/2025',
      status: 'pending'
    },
    {
      id: 3,
      type: 'medication',
      title: 'Evening Medication',
      description: 'Take with dinner',
      time: '8:00 PM',
      date: '4/26/2025',
      status: 'pending'
    },
    {
      id: 4,
      type: 'medication',
      title: 'Morning Medication',
      description: 'Take with breakfast',
      time: '8:00 AM',
      date: '4/27/2025',
      status: 'pending'
    },
    {
      id: 5,
      type: 'appointment',
      title: 'Physical Therapy Session',
      description: 'With Dr. Smith',
      time: '11:00 AM',
      date: '4/27/2025',
      status: 'pending'
    },
    {
      id: 6,
      type: 'medication',
      title: 'Morning Medication',
      description: 'Take with breakfast',
      time: '8:00 AM',
      date: '4/28/2025',
      status: 'pending'
    },
    {
      id: 7,
      type: 'exercise',
      title: 'Walking Exercise',
      description: '30 minutes moderate pace',
      time: '4:00 PM',
      date: '4/28/2025',
      status: 'pending'
    },
    {
      id: 8,
      type: 'medication',
      title: 'Morning Medication',
      description: 'Take with breakfast',
      time: '8:00 AM',
      date: '4/29/2025',
      status: 'pending'
    },
    {
      id: 9,
      type: 'appointment',
      title: 'Follow-up Visit',
      description: 'Progress check with Dr. Johnson',
      time: '2:30 PM',
      date: '4/29/2025',
      status: 'pending'
    },
    {
      id: 10,
      type: 'medication',
      title: 'Morning Medication',
      description: 'Take with breakfast',
      time: '8:00 AM',
      date: '4/30/2025',
      status: 'pending'
    },
    {
      id: 11,
      type: 'exercise',
      title: 'Physical Therapy',
      description: 'Joint mobility exercises',
      time: '3:00 PM',
      date: '4/30/2025',
      status: 'pending'
    },
    {
      id: 12,
      type: 'medication',
      title: 'Morning Medication',
      description: 'Take with breakfast',
      time: '8:00 AM',
      date: '5/1/2025',
      status: 'pending'
    },
    {
      id: 13,
      type: 'appointment',
      title: 'Final Check-up',
      description: 'Review recovery progress',
      time: '10:00 AM',
      date: '5/1/2025',
      status: 'pending'
    }
  ];

  const generateDayColumns = (): DayColumn[] => {
    const days: DayColumn[] = [];
    const startDate = new Date('2025-04-26'); // Starting from today
    const startIndex = currentPageIndex * eventsPerPage;

    for (let i = 0; i < eventsPerPage; i++) {
      const currentDate = addDays(startDate, startIndex + i);
      const formattedDate = format(currentDate, 'M/d/yyyy');
      
      days.push({
        date: currentDate,
        label: format(currentDate, 'EEEE, MMM d'),
        events: sampleEvents.filter(event => event.date === formattedDate)
      });
    }
    return days;
  };

  const navigateDays = (direction: 'prev' | 'next') => {
    if (direction === 'next' && (currentPageIndex + 1) * eventsPerPage < totalDays) {
      setCurrentPageIndex(prev => prev + 1);
    } else if (direction === 'prev' && currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
    }
  };

  const isFirstPage = currentPageIndex === 0;
  const isLastPage = (currentPageIndex + 1) * eventsPerPage >= totalDays;

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
        {generateDayColumns().map((column, index) => (
          <div key={index}>
            <h3 className="font-medium mb-4 text-gray-700">{column.label}</h3>
            <div className="space-y-4">
              {column.events.map(event => (
                <EventCard key={event.id} event={event} />
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
          disabled={isLastPage}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ThreeDayView;
