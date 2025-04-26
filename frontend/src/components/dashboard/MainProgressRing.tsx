
import React from "react";
import ProgressRing from "./ProgressChart";

interface MainProgressRingProps {
  progress: number;
  streak: number;
}

const MainProgressRing = ({ progress, streak }: MainProgressRingProps) => {
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
      
      <div className="mt-4 bg-primary-teal/10 rounded-full px-4 py-2 flex items-center">
        <span className="text-primary-teal font-medium">{streak} Day Streak! 🔥</span>
      </div>
    </div>
  );
};

export default MainProgressRing;
