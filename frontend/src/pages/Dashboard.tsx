// src/pages/Dashboard.tsx
import React from "react";
import Layout from "../components/layout/Layout";
import ComplianceDashboard from "../components/dashboard/ComplianceDashboard";
import ThreeDayView from "../components/dashboard/ThreeDayView";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";

const Dashboard = () => {
  return (
    <Layout>
      <WelcomeBanner />
      <div className="space-y-8">
        <div className="glass-card rounded-xl p-6">
          <ThreeDayView />
        </div>
        
        <ComplianceDashboard/>
      </div>
    </Layout>
  );
};

export default Dashboard;