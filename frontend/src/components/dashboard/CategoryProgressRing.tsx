import React from "react";
import ProgressRing from "./ProgressChart";
import { LucideIcon } from "lucide-react";

interface CategoryProgressRingProps {
  title: string;
  completedCount: number;
  totalCount: number;
  icon: LucideIcon;
}

const CategoryProgressRing = ({ 
  title, 
  completedCount, 
  totalCount, 
  icon: Icon 
}: CategoryProgressRingProps) => {
  // Calculate the progress percentage
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getStatusColor = (value: number) => {
    if (value >= 75) return "#4CAF50";
    if (value >= 50) return "#FFC107";
    return "#F44336";
  };

  const getStatusClass = (value: number) => {
    if (value >= 75) return "bg-green-100 text-green-800";
    if (value >= 50) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center">
          <Icon className="w-5 h-5 mr-2" />
          {title}
        </h3>
        <span className={`text-sm font-medium px-2 py-1 rounded-full ${getStatusClass(progress)}`}>
          {progress}% Complete
        </span>
      </div>
      
      <div className="flex justify-center">
        <ProgressRing
          progress={progress}
          size={120}
          strokeWidth={10}
          color={getStatusColor(progress)}
        />
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        <span className="font-medium">{completedCount}</span> of <span className="font-medium">{totalCount}</span> completed
      </div>
    </div>
  );
};

export default CategoryProgressRing;