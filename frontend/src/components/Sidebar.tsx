
import React from "react";
import { Home, Calendar, PieChart, Users, Settings, X, Activity, Pill, Hospital } from "lucide-react";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  return (
    <aside
      className={`bg-sidebar fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-white" />
            <h1 className="ml-2 text-xl font-bold text-white">CareFlow</h1>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-white hover:text-gray-300 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {[
              { name: "Dashboard", icon: Home, href: "/" },
              { name: "Patient Timeline", icon: Calendar, href: "/timeline" },
              { name: "Compliance", icon: PieChart, href: "/compliance" },
              { name: "Medications", icon: Pill, href: "/medications" },
              { name: "Appointments", icon: Hospital, href: "/appointments" },
            ].map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="flex items-center px-4 py-3 text-white hover:bg-sidebar-accent rounded-md transition-colors"
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <a
            href="/settings"
            className="flex items-center px-4 py-2 text-white hover:bg-sidebar-accent rounded-md transition-colors"
          >
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
