import React from 'react';
import { LayoutDashboard, Users, Settings, LogOut, Search, Bell } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navigation = [
    { name: 'Tableau de bord', href: '/', icon: LayoutDashboard },
    { name: 'Membres', href: '/members', icon: Users },
    { name: 'Paramètres', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-64 flex-shrink-0 bg-gray-900/50 backdrop-blur-2xl border-r border-gray-800/50 flex flex-col hidden md:flex relative"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>
        <div className="h-16 flex items-center px-6 border-b border-gray-800/50">
          <div className="flex items-center gap-3 font-bold text-lg tracking-tight z-10">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white text-sm font-black">FA</span>
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Forge AI</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 z-10">
          {navigation.map((item, idx) => {
            const isActive = location === item.href;
            return (
              <motion.div 
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + (idx * 0.05) }}
              >
                <Link 
                  href={item.href}
                  className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-indigo-500/10 text-indigo-400 font-semibold shadow-inner shadow-indigo-500/10' 
                      : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800/50'
                  }`}
                >
                  <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  {item.name}
                  {isActive && (
                    <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-full" />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-800/50 z-10">
          <button className="group flex items-center gap-3 px-3 py-3 w-full rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300">
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 lg:px-10 border-b border-gray-800/50 bg-gray-950/50 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex-1 flex items-center">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative w-full max-w-md hidden sm:block"
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-500" />
              </div>
              <input 
                type="text" 
                className="block w-full pl-10 pr-3 py-2 border border-gray-800/80 rounded-xl leading-5 bg-gray-900/50 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 sm:text-sm transition-all duration-300" 
                placeholder="Rechercher (Ctrl+K)..." 
              />
            </motion.div>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="ml-4 flex items-center gap-4"
          >
            <button className="p-2 text-gray-400 hover:text-white relative rounded-full hover:bg-gray-800/80 transition-all duration-300">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 block w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-gray-950 animate-pulse"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px] cursor-pointer hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105">
              <div className="w-full h-full rounded-full bg-gray-950 flex items-center justify-center border border-gray-800">
                <span className="text-sm font-bold text-gray-200">JD</span>
              </div>
            </div>
          </motion.div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-transparent p-6 lg:p-10 scroll-smooth relative z-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
