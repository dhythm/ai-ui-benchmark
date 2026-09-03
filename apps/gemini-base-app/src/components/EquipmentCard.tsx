import React from 'react';
import type { Equipment, EquipmentStatus } from '../types/equipment';
import { CATEGORY_LABELS } from '../data/mockEquipment';
import {
  MapPin,
  Calendar,
  Clock,
  Star,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight,
  User,
  Laptop,
  Monitor,
  Camera,
  Projector,
  Wifi,
  Cpu
} from 'lucide-react';

interface EquipmentCardProps {
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

export const EquipmentCard: React.FC<EquipmentCardProps> = ({
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
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
            利用可能
          </span>
        );
      case 'in_use':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 mr-1 text-amber-600" />
            貸出中
          </span>
        );
      case 'reserved':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Calendar className="w-3 h-3 mr-1 text-indigo-600" />
            予約あり
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-300">
            <AlertTriangle className="w-3 h-3 mr-1 text-rose-500" />
            メンテナンス中
          </span>
        );
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Top Image & Overlay Header */}
      <div>
        <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20" />

          {/* Category Tag (Top Left) */}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium backdrop-blur-md ${categoryConfig.color}`}>
              <CategoryIcon className="w-3.5 h-3.5" />
              <span>{categoryConfig.label}</span>
            </span>
          </div>

          {/* Favorite Star (Top Right) */}
          <button
            onClick={() => onToggleFavorite(item.id)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white backdrop-blur-md flex items-center justify-center transition shadow-sm"
            title={item.isFavorite ? 'お気に入りから外す' : 'お気に入りに追加'}
          >
            <Star
              className={`w-4 h-4 ${
                item.isFavorite
                  ? 'fill-amber-400 text-amber-500'
                  : 'text-slate-400 hover:text-amber-500'
              }`}
            />
          </button>

          {/* Management Code (Bottom Left overlay) */}
          <div className="absolute bottom-2.5 left-3 text-[11px] font-mono text-slate-200 bg-slate-900/60 backdrop-blur-sm px-2 py-0.5 rounded border border-slate-700/50">
            {item.code}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 sm:p-5 space-y-3.5">
          {/* Title & Status */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3
                onClick={() => onViewDetails(item)}
                className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition cursor-pointer line-clamp-2"
              >
                {item.name}
              </h3>
            </div>
            <div>{renderStatusBadge(item.status)}</div>
          </div>

          {/* Location */}
          <div className="flex items-center text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1.5 flex-shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>

          {/* Key Specs */}
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-xs space-y-1">
            {item.specs.slice(0, 2).map((spec, idx) => (
              <div key={idx} className="flex justify-between items-center text-slate-600">
                <span className="text-slate-400 font-normal">{spec.label}:</span>
                <span className="font-medium text-slate-800 truncate ml-2 max-w-[170px]">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>

          {/* Current Status Message / Next Reservation info */}
          <div className="text-xs rounded-lg p-2.5 border">
            {item.status === 'in_use' && item.currentBorrower ? (
              <div className="bg-amber-50/70 border-amber-200/60 text-amber-900 space-y-0.5">
                <div className="flex items-center font-semibold text-[11px]">
                  <User className="w-3 h-3 mr-1 text-amber-700" />
                  <span>{item.currentBorrower.name} ({item.currentBorrower.department})</span>
                </div>
                <div className="text-[11px] text-amber-800/80">
                  返却予定: <span className="font-bold">{item.currentBorrower.until}</span>
                </div>
              </div>
            ) : item.reservations.length > 0 ? (
              <div className="bg-indigo-50/70 border-indigo-200/60 text-indigo-900 space-y-0.5">
                <div className="text-[11px] font-semibold flex items-center">
                  <Calendar className="w-3 h-3 mr-1 text-indigo-600" />
                  <span>次回予約: {item.reservations[0].userName}</span>
                </div>
                <div className="text-[11px] text-indigo-700">
                  {item.reservations[0].startDate} 〜
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border-slate-200/60 text-slate-500 text-[11px] flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" />
                <span>直近の予約なし (即時利用可能)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 flex items-center gap-2">
        <button
          onClick={() => onViewDetails(item)}
          className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center justify-center space-x-1"
        >
          <Info className="w-3.5 h-3.5 text-slate-500" />
          <span>詳細</span>
        </button>

        <button
          onClick={() => onReserve(item)}
          disabled={item.status === 'maintenance'}
          className={`flex-1 px-3 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1 shadow-sm ${
            item.status === 'maintenance'
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : item.status === 'in_use'
              ? 'bg-amber-600 hover:bg-amber-700 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          <span>{item.status === 'in_use' ? '次回の予約' : '予約する'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
