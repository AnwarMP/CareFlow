import React, { useState, useEffect } from "react";
import { Pill, Activity, Calendar, Loader2 } from "lucide-react";
import CategoryProgressRing from "./CategoryProgressRing";
import { Button } from "../ui/button";

// Event types and status from your database
type EventType = 'medication' | 'exercise' | 'appointment';
type EventStatus = 'pending' | 'completed' | 'missed';

// Interface for event from your backend
interface Event {
  id: string;
  type: EventType;
  status: EventStatus;
  event_date_to_complete_by: string;
  event_header: string;
  event_description: string;
  priority: number;
}

// Stats for each category
interface CategoryStats {
  completedCount: number;
  totalCount: number;
}

interface ComplianceStats {
  medication: CategoryStats;
  exercise: CategoryStats;
  appointment: CategoryStats;
}

const ComplianceDashboard: React.FC = () => {
  const [stats, setStats] = useState<ComplianceStats>({
    medication: { completedCount: 0, totalCount: 0 },
    exercise: { completedCount: 0, totalCount: 0 },
    appointment: { completedCount: 0, totalCount: 0 }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('http://127.0.0.1:8000/get-events');

        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status}`);
        }

        const events: Event[] = await response.json();
        
        // Calculate stats for each category
        const newStats: ComplianceStats = {
          medication: { completedCount: 0, totalCount: 0 },
          exercise: { completedCount: 0, totalCount: 0 },
          appointment: { completedCount: 0, totalCount: 0 }
        };

        // Count completed and total events for each type
        events.forEach(event => {
          if (event.type in newStats) {
            newStats[event.type].totalCount++;
            if (event.status === 'completed') {
              newStats[event.type].completedCount++;
            }
          }
        });

        setStats(newStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching events:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 text-primary-teal animate-spin" />
        <span className="ml-2">Loading compliance data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-8">
        <p className="font-medium">Error loading compliance data</p>
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

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">My Recovery Progress</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CategoryProgressRing
          title="My Medications"
          completedCount={stats.medication.completedCount}
          totalCount={stats.medication.totalCount}
          icon={Pill}
        />
        
        <CategoryProgressRing
          title="My Exercises"
          completedCount={stats.exercise.completedCount}
          totalCount={stats.exercise.totalCount}
          icon={Activity}
        />
        
        <CategoryProgressRing
          title="My Appointments"
          completedCount={stats.appointment.completedCount}
          totalCount={stats.appointment.totalCount}
          icon={Calendar}
        />
      </div>
    </div>
  );
};

export default ComplianceDashboard;