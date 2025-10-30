
import React, { useContext } from 'react';
import { CreditSystemContext } from '../App';
import { Menu, User, Bell, Sun, Moon, CreditCard } from './ui/icons';

interface HeaderProps {
  setSidebarOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const creditSystem = useContext(CreditSystemContext);
  const [isDarkMode, setIsDarkMode] = React.useState(false); // Mock dark mode state

  if (!creditSystem) return null;

  const { credits, isAdminMode, setIsAdminMode } = creditSystem;
  const creditPercentage = (credits.balance / credits.plan_limit) * 100;
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  }

  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-20 shadow-sm border-b border-slate-200">
      <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-slate-500 hover:text-slate-700"
        >
          <Menu size={24} />
        </button>
        <div className="flex-1 flex justify-end items-center space-x-4">
          <div className="hidden md:block p-3 rounded-lg bg-slate-100 border border-slate-200">
            <div className="flex items-center space-x-3">
              <CreditCard className="text-blue-500" size={24} />
              <div>
                <div className="text-sm font-semibold text-slate-800">
                  {isAdminMode ? (
                    <span className="text-green-600 font-bold">∞ Unlimited</span>
                  ) : (
                    <>{credits.balance.toLocaleString()} <span className="text-xs text-slate-500 font-normal">/ {credits.plan_limit.toLocaleString()} Credits</span></>
                  )}
                </div>
                {!isAdminMode && (
                  <div className="w-40 bg-slate-200 rounded-full h-1.5 mt-1">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${creditPercentage}%` }}></div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsAdminMode(!isAdminMode)} 
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              isAdminMode 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-slate-100 text-slate-600 border border-slate-300'
            }`}
            title="Toggle admin mode for unlimited credits"
          >
            {isAdminMode ? '👑 Admin Mode' : 'User Mode'}
          </button>
          <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-slate-100 text-slate-500">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="p-2 rounded-full hover:bg-slate-100 text-slate-500">
            <Bell size={20} />
          </button>
          <div className="w-px h-8 bg-slate-200"></div>
          <button className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
              <User size={20} className="text-slate-500" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-slate-800">John Doe</p>
              <p className="text-xs text-slate-500">Admin</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
