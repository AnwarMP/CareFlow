import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import ComplianceDashboard from "../components/dashboard/ComplianceDashboard";
import ThreeDayView from "../components/dashboard/ThreeDayView";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import FullPageUpload from "../components/upload/FullPageUpload";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [hasUploadedPlan, setHasUploadedPlan] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Simulate checking if user has already uploaded a plan
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasUploadedPlan(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // If we're still checking the upload status, show a simple loading state
  if (hasUploadedPlan === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  // If no plan has been uploaded, show the full page upload component
  if (hasUploadedPlan === false) {
    return <FullPageUpload isLoading={isLoading} />;
  }

  // Otherwise, show the dashboard with reordered components
  return (
    <Layout>
      <WelcomeBanner />
      <div className="space-y-8">
        <div className="glass-card rounded-xl p-6">
          <ThreeDayView />
        </div>
        
        <ComplianceDashboard data={{
          medication: 85,
          exercise: 65,
          appointment: 100,
        }} />
      </div>
    </Layout>
  );
};

export default Index;
