
import React from "react";

const WelcomeBanner = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
      <h1 className="text-2xl font-medium">
        Hello Alex, welcome to your recovery center!
      </h1>
      <p className="text-gray-500 mt-1">
        Track your progress and stay on top of your recovery journey
      </p>
    </div>
  );
};

export default WelcomeBanner;
