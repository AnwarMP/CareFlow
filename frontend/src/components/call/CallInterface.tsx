
import React, { useState } from "react";
import { Phone, PhoneCall, PhoneOff, User, Clock, X } from "lucide-react";

enum CallState {
  IDLE,
  CALLING,
  CONNECTED,
  ENDED
}

const CallInterface: React.FC = () => {
  const [callState, setCallState] = useState<CallState>(CallState.IDLE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callTimer, setCallTimer] = useState<NodeJS.Timeout | null>(null);

  const startCall = () => {
    setCallState(CallState.CALLING);
    
    // Simulate connecting after 2 seconds
    setTimeout(() => {
      if (callState === CallState.CALLING) {
        setCallState(CallState.CONNECTED);
        
        // Start the call duration timer
        const timer = setInterval(() => {
          setCallDuration(prev => prev + 1);
        }, 1000);
        
        setCallTimer(timer);
      }
    }, 2000);
  };

  const endCall = () => {
    setCallState(CallState.ENDED);
    
    // Clear the call duration timer
    if (callTimer) {
      clearInterval(callTimer);
      setCallTimer(null);
    }
    
    // Reset after 3 seconds
    setTimeout(() => {
      setCallState(CallState.IDLE);
      setCallDuration(0);
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)} 
        className="call-button"
        aria-label="Call patient"
      >
        <Phone className="h-6 w-6" />
      </button>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="relative">
              {/* Header */}
              <div className="bg-primary-teal text-white p-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Patient Call</h2>
                <button 
                  onClick={() => {
                    if (callState === CallState.CONNECTED) {
                      endCall();
                    } else {
                      setIsModalOpen(false);
                    }
                  }} 
                  className="text-white hover:text-gray-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Patient info */}
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-gray-200 p-3 rounded-full mr-4">
                    <User className="h-8 w-8 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">John Smith</h3>
                    <p className="text-gray-500">Patient ID: #37284</p>
                  </div>
                </div>
                
                {/* Upcoming events */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2 text-gray-700">Upcoming Events</h4>
                  <div className="bg-gray-50 rounded-md p-3">
                    <p className="text-sm mb-1">
                      <span className="font-medium">9:00 AM:</span> Take Amoxicillin
                    </p>
                    <p className="text-sm mb-1">
                      <span className="font-medium">10:30 AM:</span> Physical therapy exercises
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">2:00 PM:</span> Dr. Johnson appointment
                    </p>
                  </div>
                </div>
                
                {/* Call purpose */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2 text-gray-700">Call Purpose</h4>
                  <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-teal focus:ring-primary-teal">
                    <option value="reminder">Medication Reminder</option>
                    <option value="check-in">Daily Check-In</option>
                    <option value="appointment">Appointment Confirmation</option>
                    <option value="follow-up">Follow-up Call</option>
                  </select>
                </div>
                
                {/* Call controls */}
                <div className="flex justify-center mt-6">
                  {callState === CallState.IDLE && (
                    <button 
                      onClick={startCall}
                      className="bg-primary-teal text-white rounded-full p-4 flex items-center justify-center shadow-md hover:bg-primary-light transition-colors"
                    >
                      <PhoneCall className="h-8 w-8" />
                    </button>
                  )}
                  
                  {callState === CallState.CALLING && (
                    <div className="text-center">
                      <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full mb-4">
                        Calling...
                      </div>
                      <button 
                        onClick={endCall}
                        className="bg-red-500 text-white rounded-full p-4 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                      >
                        <PhoneOff className="h-8 w-8" />
                      </button>
                    </div>
                  )}
                  
                  {callState === CallState.CONNECTED && (
                    <div className="text-center">
                      <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4 flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Connected - {formatTime(callDuration)}
                      </div>
                      <button 
                        onClick={endCall}
                        className="bg-red-500 text-white rounded-full p-4 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                      >
                        <PhoneOff className="h-8 w-8" />
                      </button>
                    </div>
                  )}
                  
                  {callState === CallState.ENDED && (
                    <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full">
                      Call ended - {formatTime(callDuration)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CallInterface;
