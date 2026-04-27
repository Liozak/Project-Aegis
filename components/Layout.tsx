
import React from 'react';
import { NAVIGATION_ITEMS, APP_NAME, APP_VERSION } from '../constants';
import { Shield, ChevronLeft, Menu, Sun, Moon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (id: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, isDarkMode, setIsDarkMode }) => {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-80 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-900 flex flex-col relative z-20 transition-colors duration-300">
        <div className="p-8 flex items-center gap-4 border-b border-slate-100 dark:border-slate-900/50">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-600/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tighter text-slate-900 dark:text-white uppercase">{APP_NAME}</h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-blue-600 dark:text-blue-500/80 font-bold uppercase tracking-widest">Inference Terminal</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-3 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-600 tracking-[0.2em] mb-4 pl-4">System Console</p>
          {NAVIGATION_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30 ring-1 ring-blue-400/50'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900/80 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className={`transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
                {item.icon}
              </div>
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="bg-white dark:bg-slate-900/40 p-5 rounded-3xl border border-slate-200 dark:border-slate-800/50 space-y-4 shadow-sm dark:shadow-none">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-600 tracking-widest">Network Health</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
            <div className="space-y-3">
               <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[92%]"></div>
               </div>
               <p className="text-[9px] font-mono text-slate-400 dark:text-slate-500 uppercase">Latency: <span className="text-blue-600 dark:text-blue-400">Stable</span></p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[radial-gradient(circle_at_top_right,#e2e8f0,transparent)] dark:bg-[radial-gradient(circle_at_top_right,#1e293b,transparent)] transition-colors duration-300">
        <header className="h-20 border-b border-slate-200 dark:border-slate-900/50 flex items-center justify-between px-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl relative z-10 transition-colors duration-300">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              {NAVIGATION_ITEMS.find(i => i.id === activeTab)?.label}
            </h2>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800"></div>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-bold tracking-widest uppercase">Node: US-EAST-AEGIS-01</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:block text-right">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-0.5">Global Threat Level</p>
              <p className="text-xs font-mono font-bold text-amber-600 dark:text-amber-500">ELEVATED_RISK</p>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--chart-grid);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default Layout;
