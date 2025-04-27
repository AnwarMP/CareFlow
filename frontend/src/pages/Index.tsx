// src/pages/Index.tsx
import React, { useState } from "react";
import FullPageUpload from "../components/upload/FullPageUpload";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleUploadSuccess = () => {
    // Show success toast
    toast({
      title: "Upload successful",
      description: "Redirecting to your dashboard...",
    });
    
    // Simulate a small delay before navigating
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };
  
  return (
    <FullPageUpload 
      isLoading={isLoading} 
      onUploadSuccess={handleUploadSuccess}
    />
  );
};

export default Index;