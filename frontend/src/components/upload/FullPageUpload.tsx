
import React from "react";
import UploadZone from "./UploadZone";
import { Skeleton } from "@/components/ui/skeleton";

interface FullPageUploadProps {
  isLoading?: boolean;
}

const FullPageUpload: React.FC<FullPageUploadProps> = ({ isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto animate-pulse">
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        
        <div className="mb-8">
          <Skeleton className="h-6 w-48 mb-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-3 bg-white rounded-xl p-8 flex flex-col items-center shadow-sm">
              <Skeleton className="h-48 w-48 rounded-full mb-4" />
              <Skeleton className="h-6 w-32 rounded-full" />
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between mb-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="flex justify-center">
                <Skeleton className="h-28 w-28 rounded-full" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between mb-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="flex justify-center">
                <Skeleton className="h-28 w-28 rounded-full" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between mb-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="flex justify-center">
                <Skeleton className="h-28 w-28 rounded-full" />
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <Skeleton className="h-6 w-48 mb-6" />
          
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex">
                  <Skeleton className="h-10 w-10 rounded-lg mr-3" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-40 mb-2" />
                    <Skeleton className="h-4 w-60 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center max-w-lg mx-auto py-10">
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-2 text-center">Welcome to Your Recovery Assistant</h1>
        <p className="text-gray-500 text-center mb-8">
          Let's create your personalized recovery plan to help you get back on your feet
        </p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6">
          <UploadZone />
        </div>
        
        <div className="mt-8 text-center">
          <h2 className="text-xl font-medium mb-3">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-primary-teal text-xl font-bold mb-2">1</div>
              <p className="text-sm">Upload your hospital discharge instructions or care plan</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-primary-teal text-xl font-bold mb-2">2</div>
              <p className="text-sm">We create a personalized recovery timeline for you</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-primary-teal text-xl font-bold mb-2">3</div>
              <p className="text-sm">Track your progress and get support when needed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullPageUpload;
