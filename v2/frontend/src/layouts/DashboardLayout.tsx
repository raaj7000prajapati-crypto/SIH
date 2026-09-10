import { Outlet, Link, useLocation } from 'react-router-dom';
import { Shield, Home, FileText, History, Settings, LogOut, Bell, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = () => {
  const location = useLocation();

  const getLinkClass = (path: string) => {
    const isActive = location.pathname.startsWith(path);
    return `flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
      isActive 
        ? 'bg-neutral-900 text-neutral-100' 
        : 'text-neutral-500 hover:bg-neutral-900/50 hover:text-neutral-200'
    }`;
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-neutral-100 flex selection:bg-neutral-800 selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A0A0A] border-r border-neutral-900 hidden md:flex flex-col relative z-20 shrink-0">
        <div className="h-14 px-6 flex items-center gap-3 border-b border-neutral-900">
          <Shield className="w-5 h-5 text-neutral-100" />
          <h1 className="text-sm font-semibold tracking-tight text-neutral-100">IDENTRA</h1>
        </div>
        
        <nav className="flex-1 py-6 px-3">
          <ul className="space-y-1">
            <li>
              <Link to="/dashboard" className={getLinkClass('/dashboard')}>
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/screening" className={getLinkClass('/screening')}>
                <FileText className="w-4 h-4" />
                <span>New Screening</span>
              </Link>
            </li>
            <li>
              <Link to="/history" className={getLinkClass('/history')}>
                <History className="w-4 h-4" />
                <span>History</span>
              </Link>
            </li>
            <li>
              <Link to="/admin" className={getLinkClass('/admin')}>
                <Settings className="w-4 h-4" />
                <span>System</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="p-3 border-t border-neutral-900">
          <button className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-neutral-500 hover:bg-neutral-900/50 hover:text-red-400 transition-colors group">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden relative z-10 bg-[#0A0A0A]">
        <header className="h-14 border-b border-neutral-900 bg-[#0A0A0A] flex items-center justify-between px-6 shrink-0 z-20">
          <div className="md:hidden flex items-center gap-2">
            <Shield className="w-5 h-5 text-neutral-100" />
            <span className="font-semibold text-sm tracking-tight text-neutral-100">IDENTRA</span>
          </div>
          <div className="hidden md:flex items-center text-neutral-500 text-xs font-medium tracking-wide uppercase">
            Secure Border Control Network
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-1.5 text-neutral-500 hover:text-neutral-200 transition-colors rounded-md hover:bg-neutral-900">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-neutral-200 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-neutral-900">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-medium text-neutral-200">A. Kumar</div>
                <div className="text-[10px] text-neutral-500 uppercase tracking-wider">OFF-8472</div>
              </div>
              <div className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-neutral-400" />
              </div>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-6 md:p-10 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="h-full max-w-7xl mx-auto"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
