import React from 'react';
import type { Equipment, EquipmentStatus } from '../types/equipment';
import { CATEGORY_LABELS } from '../data/mockEquipment';
import {
  MapPin,
  Calendar,
  Clock,
  Star,
  AlertTriangle,
  Info,
  ChevronRight,
  Laptop,
  Monitor,
  Camera,
  Projector,
  Wifi,
  Cpu
} from 'lucide-react';

interface EquipmentTableRowProps {
  item: Equipment;
  onReserve: (item: Equipment) => void;
  onViewDetails: (item: Equipment) => void;
  onToggleFavorite: (id: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  pc: Laptop,
  monitor: Monitor,
  camera: Camera,
  projector: Projector,
  wifi: Wifi,
  accessory: Cpu,
};

export const EquipmentTableRow: React.FC<EquipmentTableRowProps> = ({
  item,
  onReserve,
  onViewDetails,
  onToggleFavorite,
}) => {
  const categoryConfig = CATEGORY_LABELS[item.category];
  const CategoryIcon = CATEGORY_ICONS[item.category] || Cpu;

  const renderStatusBadge = (status: EquipmentStatus) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
            利用可能
          </span>
        );
      case 'in_use':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 mr-1 text-amber-600" />
            貸出中
          </span>
        );
      case 'reserved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Calendar className="w-3 h-3 mr-1 text-indigo-600" />
            予約あり
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-300">
            <AlertTriangle className="w-3 h-3 mr-1 text-rose-500" />
            点検中
          </span>
        );
    }
  };

  return (
    <tr className="hover:bg-slate-50/80 transition-colors border-b border-slate-100 text-sm">
      {/* Favorite */}
      <td className="py-3 px-3 text-center">
        <button
          onClick={() => onToggleFavorite(item.id)}
          className="p-1 rounded hover:bg-slate-200/50 transition"
        >
          <Star
            className={`w-4 h-4 ${
              item.isFavorite
                ? 'fill-amber-400 text-amber-500'
                : 'text-slate-300 hover:text-amber-400'
            }`}
          />
        </button>
      </td>

      {/* Code & Image */}
      <td className="py-3 px-3">
        <div className="flex items-center space-x-3">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-10 h-10 rounded-lg object-cover border border-slate-200 flex-shrink-0"
          />
          <div>
            <span className="font-mono text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              {item.code}
            </span>
          </div>
        </div>
      </td>

      {/* Name & Category */}
      <td className="py-3 px-3 max-w-xs">
        <div className="flex items-center space-x-2">
          <span className={`p-1 rounded ${categoryConfig.color}`}>
            <CategoryIcon className="w-3.5 h-3.5" />
          </span>
          <span
            onClick={() => onViewDetails(item)}
            className="font-bold text-slate-900 hover:text-indigo-600 transition cursor-pointer truncate"
          >
            {item.name}
          </span>
        </div>
      </td>

      {/* Location */}
      <td className="py-3 px-3 text-slate-600 text-xs">
        <div className="flex items-center">
          <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1 flex-shrink-0" />
          <span className="truncate max-w-[160px]">{item.location}</span>
        </div>
      </td>

      {/* Specs summary */}
      <td className="py-3 px-3 text-slate-500 text-xs hidden lg:table-cell">
        <div className="truncate max-w-[200px]">
          {item.specs.map(s => `${s.label}:${s.value}`).join(' / ')}
        </div>
      </td>

      {/* Status */}
      <td className="py-3 px-3">{renderStatusBadge(item.status)}</td>

      {/* Current borrower / Reservation info */}
      <td className="py-3 px-3 text-xs text-slate-600 hidden md:table-cell">
        {item.status === 'in_use' && item.currentBorrower ? (
          <span className="text-amber-800">
            {item.currentBorrower.name} ({item.currentBorrower.until}まで)
          </span>
        ) : item.reservations.length > 0 ? (
          <span className="text-indigo-700">
            次回: {item.reservations[0].userName}
          </span>
        ) : (
          <span className="text-slate-400">なし</span>
        )}
      </td>

      {/* Action Buttons */}
      <td className="py-3 px-3 text-right whitespace-nowrap">
        <div className="flex items-center justify-end space-x-1.5">
          <button
            onClick={() => onViewDetails(item)}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            title="詳細を表示"
          >
            <Info className="w-4 h-4" />
          </button>
          <button
            onClick={() => onReserve(item)}
            disabled={item.status === 'maintenance'}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center space-x-1 ${
              item.status === 'maintenance'
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            <span>予約</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </td>
    </tr>
  );
};
