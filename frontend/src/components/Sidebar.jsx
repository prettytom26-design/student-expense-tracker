// FILE: c:\Users\Sree\Desktop\pat\frontend\src\components\Sidebar.jsx
import { NavLink } from 'react-router-dom';
import {
  GraduationCap,
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
  Lightbulb,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
];

export default function Sidebar() {
  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-green-200 flex flex-col z-40">
      {/* Logo / Title */}
      <div className="px-6 py-6 border-b border-green-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1a3c5e] leading-tight">
              ExpenseTracker
            </h1>
            <p className="text-xs text-slate-500 leading-tight">
              Student Finance Manager
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors duration-150 ${
                isActive
                  ? 'bg-green-100 text-green-700 font-semibold'
                  : 'text-slate-600 hover:bg-green-50 hover:text-slate-800'
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom tip box */}
      <div className="px-4 py-4 border-t border-green-100">
        <div className="bg-green-50 rounded-xl p-4 flex gap-3 items-start">
          <Lightbulb className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-green-800 leading-snug">
            <span className="font-semibold">Tip:</span> Track every expense to
            stay on budget!
          </p>
        </div>
      </div>
    </div>
  );
}
