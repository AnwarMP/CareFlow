import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Check, X, Loader2, HelpCircle } from "lucide-react";

enum UploadState {
  IDLE,
  DRAGGING,
  UPLOADING,
  SUCCESS,
  ERROR
}

interface UploadZoneProps {
  onUploadSuccess?: () => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onUploadSuccess }) => {
  const [uploadState, setUploadState] = useState<UploadState>(UploadState.IDLE);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (uploadState !== UploadState.UPLOADING && uploadState !== UploadState.SUCCESS) {
      setUploadState(UploadState.DRAGGING);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (uploadState !== UploadState.UPLOADING && uploadState !== UploadState.SUCCESS) {
      setUploadState(UploadState.IDLE);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (uploadState === UploadState.UPLOADING || uploadState === UploadState.SUCCESS) {
      return;
    }
    
    const droppedFile = e.dataTransfer.files[0];
    
    if (droppedFile && droppedFile.type === "application/pdf") {
      processPdfFile(droppedFile);
    } else {
      setUploadState(UploadState.ERROR);
      toast({
        title: "Invalid file format",
        description: "Please upload a PDF file",
        variant: "destructive"
      });
      setTimeout(() => setUploadState(UploadState.IDLE), 3000);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (selectedFile && selectedFile.type === "application/pdf") {
      processPdfFile(selectedFile);
    } else if (selectedFile) {
      setUploadState(UploadState.ERROR);
      toast({
        title: "Invalid file format",
        description: "Please upload a PDF file",
        variant: "destructive"
      });
      setTimeout(() => setUploadState(UploadState.IDLE), 3000);
    }
  };

  const processPdfFile = async (pdfFile: File) => {
    setFile(pdfFile);
    setUploadState(UploadState.UPLOADING);
    
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append("file", pdfFile);
    
    try {
      // Start progress indication
      setProgress(10);
      
      // Make the API call to your FastAPI endpoint
      const response = await fetch("http://127.0.0.1:8000/upload-pdf", {
        method: "POST",
        body: formData,
        // You may need to handle CORS and credentials depending on your setup
        // credentials: 'include',
      });
      
      // Update progress
      setProgress(70);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Upload failed");
      }
      
      // Get response data
      const data = await response.json();
      
      // Complete progress
      setProgress(100);
      
      // Show success state
      setUploadState(UploadState.SUCCESS);
      toast({
        title: "Upload successful",
        description: data.message || "Your recovery plan is being created",
      });
      
      // Call the success callback if provided
      if (onUploadSuccess) {
        setTimeout(() => {
          onUploadSuccess();
        }, 1000);
      }
    } catch (error) {
      console.error("Upload error:", error);
      
      setUploadState(UploadState.ERROR);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const resetUpload = () => {
    setFile(null);
    setProgress(0);
    setUploadState(UploadState.IDLE);
  };

  const getUploadStageText = (progress: number) => {
    if (progress < 33) return "Analyzing your document...";
    if (progress < 66) return "Extracting your care plan...";
    return "Creating your recovery timeline...";
  };

  const renderContent = () => {
    switch (uploadState) {
      case UploadState.DRAGGING:
        return (
          <div className="text-center">
            <div className="mb-4 p-3 rounded-full bg-primary-teal/10 inline-block">
              <Upload className="h-8 w-8 text-primary-teal" />
            </div>
            <p className="text-lg font-medium text-primary-teal">Release to upload</p>
            <p className="text-sm text-gray-500 mt-1">Drop your recovery plan PDF</p>
          </div>
        );
        
      case UploadState.UPLOADING:
        return (
          <div className="text-center">
            <div className="mb-4 relative">
              <svg className="w-16 h-16">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="#e6e6e6"
                  strokeWidth="4"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="#0097A7"
                  strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                  className="transform -rotate-90 origin-center transition-all duration-200"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-medium">{progress}%</span>
              </div>
            </div>
            <p className="font-medium">{getUploadStageText(progress)}</p>
            <p className="text-sm text-gray-500 mt-1">Uploading {file?.name}</p>
            <button 
              onClick={resetUpload}
              className="mt-4 text-sm text-red-500 hover:text-red-700"
            >
              Cancel
            </button>
          </div>
        );
        
      case UploadState.SUCCESS:
        return (
          <div className="text-center">
            <div className="mb-4 p-3 rounded-full bg-green-100 inline-block">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <p className="font-medium text-green-600">Upload successful!</p>
            <p className="text-sm text-gray-500 mt-1">We've created your personal recovery plan.</p>
            <button 
              onClick={resetUpload}
              className="mt-4 px-4 py-2 bg-primary-teal text-white rounded-md hover:bg-primary-light transition-colors"
            >
              Upload another file
            </button>
          </div>
        );
        
      case UploadState.ERROR:
        return (
          <div className="text-center">
            <div className="mb-4 p-3 rounded-full bg-red-100 inline-block">
              <X className="h-8 w-8 text-red-600" />
            </div>
            <p className="font-medium text-red-600">Upload failed</p>
            <p className="text-sm text-gray-500 mt-1">Please try again</p>
            <button 
              onClick={resetUpload}
              className="mt-4 px-4 py-2 bg-primary-teal text-white rounded-md hover:bg-primary-light transition-colors"
            >
              Try again
            </button>
          </div>
        );
        
      default: // IDLE
        return (
          <div className="text-center">
            <div className="mb-4 p-3 rounded-full bg-primary-teal/10 inline-block">
              <FileText className="h-8 w-8 text-primary-teal" />
            </div>
            <p className="text-lg font-medium">Add Your Recovery Plan</p>
            <p className="text-sm text-gray-500 mt-1">Drag & drop your PDF or click to browse</p>
            <p className="text-xs text-gray-400 mt-1">We accept discharge instructions and care plans from most hospitals</p>
            
            <div className="mt-6">
              <label className="px-4 py-2 bg-primary-teal text-white rounded-md hover:bg-primary-light transition-colors cursor-pointer">
                Browse files
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileSelect}
                />
              </label>
            </div>
            
            <div className="mt-4 text-xs text-gray-500 flex justify-center">
              <button className="flex items-center hover:text-primary-teal transition-colors">
                <HelpCircle className="h-3 w-3 mr-1" />
                What documents can I upload?
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        upload-zone min-h-[250px] flex items-center justify-center rounded-xl
        ${uploadState === UploadState.DRAGGING ? 'upload-zone-active' : ''}
        ${uploadState === UploadState.UPLOADING ? 'border-primary-teal bg-primary-teal/5' : ''}
        ${uploadState === UploadState.SUCCESS ? 'border-green-500 bg-green-50' : ''}
        ${uploadState === UploadState.ERROR ? 'border-red-500 bg-red-50' : ''}
      `}
    >
      {renderContent()}
    </div>
  );
};

export default UploadZone;
