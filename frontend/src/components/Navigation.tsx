
import React from "react";
import { Home, Calendar, PieChart, Pill, Hospital, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Navigation: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-primary-teal/10">
            <Home className="h-6 w-6 text-primary-teal" />
          </div>
          <h1 className="ml-2 text-xl font-bold text-primary-teal">My Recovery</h1>
        </div>
        
        <div className="hidden md:flex space-x-1">
          {[
            { name: "Dashboard", icon: Home, href: "/" },
            { name: "My Timeline", icon: Calendar, href: "/timeline" },
            { name: "My Progress", icon: PieChart, href: "/progress" },
            { name: "Medications", icon: Pill, href: "/medications" },
            { name: "Appointments", icon: Hospital, href: "/appointments" },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center px-3 py-2 text-gray-600 hover:bg-primary-teal/10 rounded-md transition-colors"
            >
              <item.icon className="h-5 w-5 mr-1" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
        
        <div className="md:hidden flex space-x-1">
          {[
            { name: "Dashboard", icon: Home, href: "/" },
            { name: "Timeline", icon: Calendar, href: "/timeline" },
            { name: "Help", icon: HelpCircle, href: "/help" },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center p-2 text-gray-600 hover:bg-primary-teal/10 rounded-md transition-colors"
            >
              <item.icon className="h-5 w-5" />
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
