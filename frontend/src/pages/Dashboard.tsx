import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import ComplianceDashboard from "../components/dashboard/ComplianceDashboard";
import MainProgressRing from "../components/dashboard/MainProgressRing";
import ThreeDayView from "../components/dashboard/ThreeDayView";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import { Loader2 } from "lucide-react";

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

const Dashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch events
        const eventsResponse = await fetch('http://127.0.0.1:8000/get-events');
        if (!eventsResponse.ok) {
          throw new Error(`Failed to fetch events: ${eventsResponse.status}`);
        }
        const eventsData: Event[] = await eventsResponse.json();
        setEvents(eventsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Calculate overall statistics
  const totalEvents = events.length;
  const completedEvents = events.filter(e => e.status === 'completed').length;
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-10 h-10 text-primary-teal animate-spin" />
          <span className="ml-3 text-lg">Loading dashboard...</span>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <WelcomeBanner />
      
      <div className="space-y-8">
        <MainProgressRing 
          completedCount={completedEvents}
          totalCount={totalEvents}
        />
        
        <ComplianceDashboard />
        
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          <ThreeDayView />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;