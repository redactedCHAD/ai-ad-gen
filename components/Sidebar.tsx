import React from 'react';
// FIX: Import the shared 'Tool' type to avoid local definitions.
import type { Tool } from '../types';

interface NavLinkProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  isComingSoon?: boolean;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ icon, label, isActive = false, isComingSoon = false, onClick }) => {
  const baseClasses = "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors";
  const activeClasses = "text-white bg-cyan-500/10";
  const inactiveClasses = "text-gray-400 hover:bg-gray-700/50 hover:text-white";
  const disabledClasses = "text-gray-500 cursor-not-allowed";

  const classes = `${baseClasses} ${
    isActive ? activeClasses : isComingSoon ? disabledClasses : inactiveClasses
  }`;

  return (
    <a 
        href="#" 
        className={classes} 
        aria-disabled={isComingSoon || !onClick}
        onClick={(e) => {
            e.preventDefault();
            if (!isComingSoon && onClick) {
                onClick();
            }
        }}
    >
      {icon}
      <span className="ml-3">{label}</span>
      {isComingSoon && (
        <span className="ml-auto text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">
          Soon
        </span>
      )}
    </a>
  );
};

interface SidebarProps {
    activeTool: Tool;
    onNavClick: (tool: Tool) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTool, onNavClick }) => {
  return (
    <aside className="w-64 bg-[#161B22] border-r border-gray-800 flex-shrink-0 flex-col hidden sm:flex">
      <div className="px-6 py-5 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white tracking-wide">Marketing Suite</h2>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        <NavLink
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
          label="Dashboard"
          isActive={activeTool === 'dashboard'}
          onClick={() => onNavClick('dashboard')}
        />
        <NavLink
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>}
          label="Ad Generation"
          isActive={activeTool === 'ad-generator'}
          onClick={() => onNavClick('ad-generator')}
        />
        <NavLink
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>}
          label="Social Posts"
          isActive={activeTool === 'social-posts'}
          onClick={() => onNavClick('social-posts')}
        />
      </nav>
    </aside>
  );
};

export default Sidebar;