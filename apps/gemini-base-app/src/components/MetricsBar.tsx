import React from 'react';
import type { Equipment, EquipmentStatus } from '../types/equipment';
import { CheckCircle2, Clock, Calendar, AlertTriangle, Layers } from 'lucide-react';

interface MetricsBarProps {
  items: Equipment[];
  selectedStatus: EquipmentStatus | 'all';
  onSelectStatus: (status: EquipmentStatus | 'all') => void;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({
  items,
  selectedStatus,
  onSelectStatus,
}) => {
  const totalCount = items.length;
  const availableCount = items.filter(i => i.status === 'available').length;
  const inUseCount = items.filter(i => i.status === 'in_use').length;
  const reservedCount = items.filter(i => i.status === 'reserved').length;
  const maintenanceCount = items.filter(i => i.status === 'maintenance').length;

  const cards = [
    {
      id: 'all',
      label: '全備品数',
      count: totalCount,
      icon: Layers,
      color: 'text-slate-700',
      bgColor: 'bg-white',
      borderColor: 'border-slate-200',
      activeBorder: 'border-slate-900 ring-2 ring-slate-900/10',
    },
    {
      id: 'available',
      label: '今すぐ利用可能',
      count: availableCount,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50/50',
      borderColor: 'border-emerald-200',
      activeBorder: 'border-emerald-600 ring-2 ring-emerald-600/20',
    },
    {
      id: 'in_use',
      label: '貸出中',
      count: inUseCount,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50/50',
      borderColor: 'border-amber-200',
      activeBorder: 'border-amber-600 ring-2 ring-amber-600/20',
    },
    {
      id: 'reserved',
      label: '本日予約あり',
      count: reservedCount,
      icon: Calendar,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50/50',
      borderColor: 'border-indigo-200',
      activeBorder: 'border-indigo-600 ring-2 ring-indigo-600/20',
    },
    {
      id: 'maintenance',
      label: 'メンテナンス中',
      count: maintenanceCount,
      icon: AlertTriangle,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50/50',
      borderColor: 'border-rose-200',
      activeBorder: 'border-rose-600 ring-2 ring-rose-600/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = selectedStatus === card.id;

        return (
          <button
            key={card.id}
            onClick={() => onSelectStatus(card.id as EquipmentStatus | 'all')}
            className={`p-3.5 rounded-xl border text-left transition-all duration-200 ${
              card.bgColor
            } ${
              isSelected
                ? `${card.activeBorder} shadow-md`
                : `${card.borderColor} hover:border-slate-400 hover:shadow-sm`
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{card.label}</span>
              <Icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className={`text-2xl font-black tracking-tight ${card.color}`}>
                {card.count}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">件</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
