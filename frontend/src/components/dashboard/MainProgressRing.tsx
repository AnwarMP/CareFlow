import React from "react";
import ProgressRing from "./ProgressChart";

interface MainProgressRingProps {
  completedCount: number;
  totalCount: number;
}

const MainProgressRing = ({ completedCount, totalCount }: MainProgressRingProps) => {
  // Calculate the overall progress
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getStatusColor = (value: number) => {
    if (value >= 75) return "#4CAF50";
    if (value >= 50) return "#FFC107";
    return "#F44336";
  };

  return (
    <div className="glass-card rounded-xl p-6 flex flex-col items-center md:col-span-3">
      <div className="relative mb-2">
        <ProgressRing
          progress={progress}
          size={200}
          strokeWidth={15}
          color={getStatusColor(progress)}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold">{progress}%</span>
          <span className="text-sm text-gray-500">Recovery Journey</span>
        </div>
      </div>
      
      <div className="mt-2 text-center">
        <p className="text-gray-600">
          <span className="font-medium">{completedCount}</span> of <span className="font-medium">{totalCount}</span> tasks completed
        </p>
      </div>
    </div>
  );
};

export default MainProgressRing;