import React from 'react';
import type { Equipment } from '../types/equipment';
import { CATEGORY_LABELS } from '../data/mockEquipment';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Star,
  User,
  ShieldCheck,
  Tag,
  FileText
} from 'lucide-react';

interface EquipmentDetailModalProps {
  item: Equipment | null;
  onClose: () => void;
  onReserve: (item: Equipment) => void;
  onToggleFavorite: (id: string) => void;
}

export const EquipmentDetailModal: React.FC<EquipmentDetailModalProps> = ({
  item,
  onClose,
  onReserve,
  onToggleFavorite,
}) => {
  if (!item) return null;

  const categoryConfig = CATEGORY_LABELS[item.category];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Modal Header Bar */}
        <div className="relative h-48 sm:h-56 bg-slate-900 flex-shrink-0">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-slate-300 hover:text-white flex items-center justify-center transition border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Favorite & Code (Top Left) */}
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${categoryConfig.color}`}>
              {categoryConfig.label}
            </span>
            <span className="font-mono text-xs text-slate-300 bg-slate-950/80 px-2 py-1 rounded border border-slate-800">
              {item.code}
            </span>
          </div>

          {/* Modal Header Titles */}
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                {item.name}
              </h2>
              <div className="flex items-center space-x-2 text-xs text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>{item.location}</span>
              </div>
            </div>

            <button
              onClick={() => onToggleFavorite(item.id)}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-700 text-amber-400 transition"
              title="お気に入り切替"
            >
              <Star className={`w-5 h-5 ${item.isFavorite ? 'fill-amber-400' : 'text-slate-400'}`} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
              <FileText className="w-3.5 h-3.5 mr-1 text-indigo-500" />
              備品概要
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              {item.description}
            </p>
          </div>

          {/* Current Status Banner */}
          {item.status === 'in_use' && item.currentBorrower && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-1 text-xs text-amber-900">
              <div className="font-bold text-sm flex items-center text-amber-800">
                <Clock className="w-4 h-4 mr-1.5 text-amber-600" />
                現在利用中のユーザー情報
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-amber-700 font-medium">利用者:</span> {item.currentBorrower.name} ({item.currentBorrower.department})
                </div>
                <div>
                  <span className="text-amber-700 font-medium">返却予定:</span> {item.currentBorrower.until}
                </div>
                <div className="col-span-2">
                  <span className="text-amber-700 font-medium">利用目的:</span> {item.currentBorrower.purpose}
                </div>
              </div>
            </div>
          )}

          {/* Detailed Specs Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-indigo-500" />
              仕様・スペック情報
            </h4>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs">
              <table className="w-full">
                <tbody>
                  {item.specs.map((spec, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'}
                    >
                      <td className="py-2.5 px-4 font-semibold text-slate-500 w-1/3 border-r border-slate-100">
                        {spec.label}
                      </td>
                      <td className="py-2.5 px-4 text-slate-800 font-medium">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 items-center">
              <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
              {item.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Upcoming Reservations List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-indigo-500" />
              今後の予約スケジュール ({item.reservations.length})
            </h4>
            {item.reservations.length === 0 ? (
              <div className="text-xs text-slate-400 p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                今後の予約はありません。ご希望の日時でご予約いただけます。
              </div>
            ) : (
              <div className="space-y-2">
                {item.reservations.map((res) => (
                  <div
                    key={res.id}
                    className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center">
                        <User className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                        {res.userName} <span className="text-slate-500 font-normal ml-1">({res.department})</span>
                      </div>
                      <div className="text-slate-600 text-[11px] mt-0.5">
                        目的: {res.purpose}
                      </div>
                    </div>
                    <div className="font-mono text-indigo-700 bg-white px-2.5 py-1 rounded border border-indigo-200 text-right whitespace-nowrap">
                      {res.startDate} 〜 {res.endDate}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition"
          >
            閉じる
          </button>

          <button
            onClick={() => {
              onClose();
              onReserve(item);
            }}
            disabled={item.status === 'maintenance'}
            className={`px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-md transition flex items-center space-x-1.5 ${
              item.status === 'maintenance'
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>この備品を予約する</span>
          </button>
        </div>
      </div>
    </div>
  );
};
