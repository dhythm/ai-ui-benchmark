import React from 'react';
import { PackageCheck, CalendarDays } from 'lucide-react';
import { CURRENT_USER } from '../data/mockEquipment';

interface HeaderProps {
  myReservationsCount: number;
  onOpenMyReservations: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  myReservationsCount,
  onOpenMyReservations,
}) => {
  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & System Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <PackageCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">BizStock</span>
                <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-0.5 rounded-full font-medium border border-indigo-500/30">
                  社内備品予約 portal
                </span>
              </div>
              <p className="text-xs text-slate-400">社内共通IT機器・備品ポータル</p>
            </div>
          </div>

          {/* User & Actions */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Today Date */}
            <div className="hidden md:flex items-center text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <CalendarDays className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
              <span>{today}</span>
            </div>

            {/* My Reservations Button */}
            <button
              onClick={onOpenMyReservations}
              className="relative inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-sm active:scale-95"
            >
              <CalendarDays className="w-4 h-4" />
              <span>マイ予約・貸出</span>
              {myReservationsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-amber-400 text-slate-950 font-extrabold text-[11px] rounded-full animate-pulse">
                  {myReservationsCount}
                </span>
              )}
            </button>

            <div className="h-5 w-[1px] bg-slate-700 hidden sm:block" />

            {/* User Profile */}
            <div className="flex items-center space-x-2.5">
              <img
                src={CURRENT_USER.avatar}
                alt={CURRENT_USER.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-indigo-400/50"
              />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-medium text-slate-200">{CURRENT_USER.name}</div>
                <div className="text-[10px] text-slate-400">{CURRENT_USER.department}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
