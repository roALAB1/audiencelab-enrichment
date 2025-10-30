
import React from 'react';
import { Tab } from '../types';
// Fix: Removed unused and non-existent 'Sliders' icon from import.
import { BarChart2, CheckSquare, FileText, LayoutDashboard, Settings, UploadCloud } from './ui/icons';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const navItems = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
  { id: 'enrichment', label: 'Enrichment', icon: <UploadCloud size={20} /> },
  { id: 'quality', label: 'Quality', icon: <CheckSquare size={20} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={20} /> },
  { id: 'activity', label: 'Activity', icon: <FileText size={20} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isSidebarOpen, setSidebarOpen }) => {
  return (
    <>
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0`}>
        <div className="flex items-center justify-center h-20 border-b border-slate-200">
           <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">SPARK</h1>
        </div>
        <nav className="mt-6">
          {navItems.map((item) => (
            <a
              key={item.id}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(item.id as Tab);
                setSidebarOpen(false);
              }}
              className={`flex items-center px-6 py-4 text-slate-600 hover:bg-slate-100 transition-colors duration-200 ${
                activeTab === item.id ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-600 font-semibold' : ''
              }`}
            >
              {React.cloneElement(item.icon, { className: 'mr-4' })}
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
      {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}
    </>
  );
};

export default Sidebar;