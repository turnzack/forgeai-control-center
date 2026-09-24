import React from 'react';
import { LayoutDashboard, Users, Settings, LogOut, Search, Bell } from 'lucide-react';
import { Link, useLocation } from 'wouter';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navigation = [
    { name: 'Tableau de bord', href: '/', icon: LayoutDashboard },
    { name: 'Membres', href: '/members', icon: Users },
    { name: 'Paramètres', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <span className="text-white text-sm">FA</span>
            </div>
            Forge AI
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-500/10 text-indigo-400 font-semibold' 
                    : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800/50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200">
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 lg:px-10 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex-1 flex items-center">
            <div className="relative w-full max-w-md hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <input 
                type="text" 
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-xl leading-5 bg-gray-800/50 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all" 
                placeholder="Rechercher partout..." 
              />
            </div>
          </div>
          <div className="ml-4 flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-100 relative rounded-full hover:bg-gray-800 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 block w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-gray-900"></span>
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px] cursor-pointer">
              <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center border border-gray-800">
                <span className="text-xs font-bold">JD</span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-gray-950 p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
