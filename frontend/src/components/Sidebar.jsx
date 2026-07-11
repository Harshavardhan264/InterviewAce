import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  Code, 
  Building2, 
  ClipboardList, 
  FileText, 
  Settings, 
  LogOut, 
  Trophy,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Topic Tracker', path: '/topics', icon: <BookOpen size={20} /> },
    { name: 'Problem Manager', path: '/problems', icon: <Code size={20} /> },
    { name: 'Company Prep', path: '/companies', icon: <Building2 size={20} /> },
    { name: 'Mock Interviews', path: '/mock-interviews', icon: <ClipboardList size={20} /> },
    { name: 'Notes Manager', path: '/notes', icon: <FileText size={20} /> },
  ];

  if (user && user.role === 'admin') {
    navItems.push({ name: 'Admin Panel', path: '/admin', icon: <Settings size={20} /> });
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Nav Header */}
      <div className="flex items-center justify-between border-b border-dark-800 bg-dark-900/60 p-4 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-600 to-violet-500 shadow-md">
            <Trophy className="text-white" size={18} />
          </div>
          <span className="font-sans text-lg font-bold tracking-tight text-white">InterviewAce</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-dark-400 hover:bg-dark-850 hover:text-white"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Sidebar Sidebar */}
      <aside className={`
        fixed bottom-0 top-0 z-50 flex w-64 flex-col border-r border-dark-850 bg-dark-950/80 px-4 py-6 backdrop-blur-xl transition-all duration-300 lg:sticky lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Logo */}
        <div className="mb-8 hidden items-center gap-2 lg:flex">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-violet-500 shadow-lg shadow-brand-500/20">
            <Trophy className="text-white" size={20} />
          </div>
          <span className="font-sans text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-dark-200 to-brand-400 bg-clip-text text-transparent">
            InterviewAce
          </span>
        </div>

        {/* User Card */}
        {user && (
          <div className="mb-6 rounded-xl bg-dark-900/50 p-4 border border-dark-850/50 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/10 text-brand-400 font-bold border border-brand-500/20">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-semibold text-sm truncate text-white">{user.name}</h4>
              <span className="text-xs text-dark-400 block truncate capitalize">{user.role}</span>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group
                ${isActive 
                  ? 'bg-brand-600/10 text-brand-400 border border-brand-500/20 shadow-inner' 
                  : 'text-dark-400 hover:bg-dark-900/30 hover:text-white border border-transparent'}
              `}
            >
              <span className="transition-transform group-hover:scale-110 duration-200">
                {item.icon}
              </span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="mt-auto border-t border-dark-850/60 pt-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3.5 rounded-xl border border-transparent px-4 py-3 text-sm font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile drawer */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;
