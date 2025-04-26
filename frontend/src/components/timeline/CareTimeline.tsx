
import React, { useState } from "react";
import { Pill, Activity, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";

interface TimelineEvent {
  id: number;
  type: 'medication' | 'exercise' | 'appointment';
  title: string;
  description: string;
  time: string;
  date: string;
  status: 'pending' | 'completed' | 'missed';
}

interface CareTimelineProps {
  events: TimelineEvent[];
}

const CareTimeline: React.FC<CareTimelineProps> = ({ events }) => {
  const [localEvents, setLocalEvents] = useState<TimelineEvent[]>(events);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'medication':
        return <Pill className="h-5 w-5" />;
      case 'exercise':
        return <Activity className="h-5 w-5" />;
      case 'appointment':
        return <Calendar className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'missed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Done';
      case 'missed':
        return 'Missed';
      case 'pending':
        return 'Upcoming';
      default:
        return '';
    }
  };

  const getEventClass = (type: string) => {
    switch (type) {
      case 'medication':
        return 'timeline-item-medication';
      case 'exercise':
        return 'timeline-item-exercise';
      case 'appointment':
        return 'timeline-item-appointment';
      default:
        return '';
    }
  };

  const formatDate = (dateStr: string) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const todayStr = today.toLocaleDateString();
    const tomorrowStr = tomorrow.toLocaleDateString();
    
    if (dateStr === todayStr) return "Today";
    if (dateStr === tomorrowStr) return "Tomorrow";
    
    return dateStr;
  };

  const handleMarkCompleted = (id: number) => {
    setLocalEvents(currentEvents => 
      currentEvents.map(event => 
        event.id === id ? { ...event, status: 'completed' } : event
      )
    );
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-6">My Recovery Timeline</h2>
      
      <div className="relative">
        {localEvents.map((event) => (
          <div 
            key={event.id} 
            className={`timeline-item ${getEventClass(event.type)}`}
          >
            <div className="glass-card rounded-lg p-4 mb-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <div 
                    className={`
                      p-2 rounded-lg mr-3 
                      ${event.type === 'medication' ? 'bg-primary-teal/10 text-primary-teal' : ''} 
                      ${event.type === 'exercise' ? 'bg-accent-orange/10 text-accent-orange' : ''} 
                      ${event.type === 'appointment' ? 'bg-primary-light/10 text-primary-light' : ''}
                    `}
                  >
                    {getEventIcon(event.type)}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-gray-600 text-sm">{event.description}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      {formatDate(event.date)} • {event.time}
                    </p>

                    {event.status === 'pending' && (
                      <button 
                        onClick={() => handleMarkCompleted(event.id)}
                        className="mt-2 text-xs bg-primary-teal/10 text-primary-teal px-3 py-1 rounded-full hover:bg-primary-teal/20 transition-colors"
                      >
                        Mark as done
                      </button>
                    )}

                    {event.status === 'completed' && (
                      <p className="mt-2 text-xs text-green-600">
                        Well done! You completed this task.
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center">
                  {getStatusIcon(event.status)}
                  <span 
                    className={`text-xs font-medium ml-1 
                      ${event.status === 'completed' ? 'text-green-500' : ''} 
                      ${event.status === 'missed' ? 'text-red-500' : ''} 
                      ${event.status === 'pending' ? 'text-yellow-500' : ''}
                    `}
                  >
                    {getStatusText(event.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareTimeline;
