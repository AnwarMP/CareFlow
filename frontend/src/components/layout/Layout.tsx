
import React from "react";
import { Headset } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <main className="pb-20">
          {children}
        </main>
      </div>
      
      <div className="fixed bottom-6 right-6">
        <button className="bg-primary-teal hover:bg-primary-teal/80 text-white rounded-full p-4 shadow-lg flex items-center transition-all">
          <Headset className="mr-2 w-5 h-5" />
          <span className="mr-2">Get Support</span>
        </button>
      </div>
    </div>
  );
};

export default Layout;
