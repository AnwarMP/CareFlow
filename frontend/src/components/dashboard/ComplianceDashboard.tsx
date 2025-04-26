
import React from "react";
import { Pill, Activity, Calendar } from "lucide-react";
import CategoryProgressRing from "./CategoryProgressRing";

interface ComplianceData {
  medication: number;
  exercise: number;
  appointment: number;
}

interface ComplianceDashboardProps {
  data: ComplianceData;
}

const ComplianceDashboard: React.FC<ComplianceDashboardProps> = ({ data }) => {
  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CategoryProgressRing
          title="My Medications"
          progress={data.medication}
          icon={Pill}
        />
        
        <CategoryProgressRing
          title="My Exercises"
          progress={data.exercise}
          icon={Activity}
        />
        
        <CategoryProgressRing
          title="My Appointments"
          progress={data.appointment}
          icon={Calendar}
        />
      </div>
    </div>
  );
};

export default ComplianceDashboard;
