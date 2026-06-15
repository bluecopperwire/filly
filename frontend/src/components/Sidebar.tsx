import { PenLine, BarChart3, BookOpen } from 'lucide-react';
import type { NavPage } from '../types';

interface SidebarProps {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
}

const navItems: { page: NavPage; label: string; icon: typeof PenLine }[] = [
  { page: 'write', label: 'Write', icon: PenLine },
  { page: 'analytics', label: 'Analytics', icon: BarChart3 },
  { page: 'guide', label: 'Guide', icon: BookOpen },
];

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-56 bg-primary flex flex-col shrink-0 h-full">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <span className="text-xl">🐱</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight leading-none">
              FILLY
            </h1>
            <p className="text-white/60 text-[0.65rem] mt-0.5 tracking-wide">
              Meow catchphrase
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-2">
        <ul className="space-y-1">
          {navItems.map(({ page, label, icon: Icon }) => {
            const isActive = activePage === page;
            return (
              <li key={page}>
                <button
                  id={`nav-${page}`}
                  onClick={() => onNavigate(page)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-200 cursor-pointer
                    ${
                      isActive
                        ? 'bg-accent text-primary-dark shadow-md shadow-accent/30'
                        : 'text-white/80 hover:bg-sidebar-hover hover:text-white'
                    }
                  `}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-5 pb-5">
        <div className="border-t border-white/10 pt-4">
          <p className="text-white/40 text-[0.6rem] text-center">
            Filipino Writing Assistant
          </p>
        </div>
      </div>
    </aside>
  );
}
