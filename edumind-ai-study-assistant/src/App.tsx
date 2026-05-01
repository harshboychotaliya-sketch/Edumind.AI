import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { SmoothScroll } from './components/SmoothScroll';
import { ProblemSolver } from './components/ProblemSolver';
import { DocumentProcessor } from './components/DocumentProcessor';
import { PracticeTests } from './components/PracticeTests';
import { ProgressTracker } from './components/ProgressTracker';
import { MindMap } from './components/MindMap';
import { LandingPage } from './components/LandingPage';
import { Button, Card, cn } from './components/ui/UI';
import { 
  Library, 
  GraduationCap, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  User as UserIcon,
  Search,
  Loader2,
  Brain,
  FileText,
  BrainCircuit,
  TrendingUp,
  Network,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Dashboard: React.FC<{ isDark: boolean; toggleDark: () => void }> = ({ isDark, toggleDark }) => {
  const { user, userProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('solve');

  const menuItems = [
    { id: 'solve', label: 'Problem Solver', icon: Brain, category: 'Study Console' },
    { id: 'docs', label: 'Documents', icon: FileText, category: 'Study Console' },
    { id: 'tests', label: 'Practice Tests', icon: BrainCircuit, category: 'Study Console' },
    { id: 'map', label: 'Mind Map', icon: Network, category: 'Study Console' },
    { id: 'progress', label: 'Progress', icon: TrendingUp, category: 'Analysis' },
  ];

  return (
    <div className={cn(
      "min-h-screen flex flex-col md:flex-row font-sans transition-colors duration-300",
      isDark ? "bg-[#0B1120] text-slate-100" : "bg-[#F8FAFC] text-slate-900"
    )}>
      {/* Sidebar */}
      <aside className={cn(
        "w-full md:w-64 border-r flex flex-col h-screen sticky top-0 shrink-0 transition-colors duration-300",
        isDark ? "bg-[#0F172A] border-slate-800" : "bg-white border-slate-200"
      )}>
        <div className={cn("p-6 border-b flex items-center justify-between", isDark ? "border-slate-800" : "border-slate-100")}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <GraduationCap size={20} />
            </div>
            <span className="text-xl font-bold font-display tracking-tight">EduMind AI</span>
          </div>
          <button
            onClick={toggleDark}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              isDark ? "text-yellow-400 hover:bg-slate-800" : "text-slate-400 hover:bg-slate-50"
            )}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {['Study Console', 'Analysis'].map((category) => (
            <div key={category} className="mb-6">
              <div className={cn("text-[10px] font-bold uppercase tracking-widest mb-3 px-2", isDark ? "text-slate-500" : "text-slate-400")}>
                {category}
              </div>
              <div className="space-y-1">
                {menuItems.filter(i => i.category === category).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all font-medium text-sm",
                      activeTab === item.id 
                        ? "bg-indigo-600/10 text-indigo-500" 
                        : isDark ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <item.icon size={18} className={activeTab === item.id ? "text-indigo-500" : "text-slate-500"} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className={cn("p-4 border-t", isDark ? "border-slate-800" : "border-slate-100")}>
           <div className="bg-indigo-600 p-4 rounded-xl text-white mb-4 shadow-lg shadow-indigo-500/20">
              <p className="text-[10px] opacity-80 uppercase font-bold tracking-tight">System Status</p>
              <p className="font-bold text-sm">Powered by Gemini Pro</p>
           </div>
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className={cn("w-8 h-8 rounded-full border overflow-hidden shrink-0", isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-100")}>
              {user?.photoURL ? <img src={user.photoURL} alt="" /> : <UserIcon className="p-1.5 text-slate-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{user?.displayName}</p>
              <p className="text-[10px] opacity-50 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className={cn(
          "h-16 border-b px-8 flex items-center justify-between shrink-0 transition-colors duration-300",
          isDark ? "bg-[#0F172A] border-slate-800" : "bg-white border-slate-200"
        )}>
          <div className="flex items-center gap-4 flex-1">
             <div className="relative w-96 md:block hidden">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search your notes or topics..."
                  className={cn(
                    "w-full pl-10 pr-4 py-2 border rounded-full text-sm outline-none transition-all",
                    isDark 
                      ? "bg-slate-800 border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500" 
                      : "bg-slate-50 border-slate-200 focus:ring-indigo-500/20 focus:bg-white"
                  )}
                />
             </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={cn(
              "flex items-center gap-2 px-3 py-1 border rounded-full text-[10px] font-bold uppercase tracking-wider",
              isDark ? "bg-amber-900/30 text-amber-400 border-amber-900/50" : "bg-amber-50 text-amber-700 border-amber-100"
            )}>
               AI Credits: 850/1000
            </div>
            <div className="text-right">
              <h1 className="text-sm font-bold capitalize">{activeTab.replace('-', ' ')}</h1>
            </div>
          </div>
        </header>

        <div className={cn(
          "flex-1 overflow-y-auto p-4 md:p-8 transition-colors duration-300",
          isDark ? "bg-[#0B1120]" : "bg-slate-50/50"
        )}>
          <div className="max-w-6xl mx-auto pb-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className={isDark ? 'dark' : ''}>
                  {activeTab === 'solve' && <ProblemSolver />}
                  {activeTab === 'docs' && <DocumentProcessor />}
                  {activeTab === 'tests' && <PracticeTests />}
                  {activeTab === 'progress' && <ProgressTracker />}
                  {activeTab === 'map' && <MindMap />}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleDark = () => setIsDark(!isDark);

  if (loading) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center transition-colors", isDark ? "bg-slate-950" : "bg-slate-50")}>
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return user 
    ? <Dashboard isDark={isDark} toggleDark={toggleDark} /> 
    : <LandingPage isDark={isDark} toggleDark={toggleDark} />;
};

export default function App() {
  return (
    <AuthProvider>
      <SmoothScroll>
        <AppContent />
      </SmoothScroll>
    </AuthProvider>
  );
}
