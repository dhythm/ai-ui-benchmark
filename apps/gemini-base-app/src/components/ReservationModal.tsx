import React, { useState } from 'react';
import type { Equipment } from '../types/equipment';
import { CURRENT_USER } from '../data/mockEquipment';
import { X, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

interface ReservationModalProps {
  item: Equipment | null;
  onClose: () => void;
  onConfirm: (reservationData: {
    equipmentId: string;
    startDate: string;
    endDate: string;
    purpose: string;
  }) => void;
}

const PURPOSE_PRESETS = [
  '社内会議・プレゼンテーション',
  '在宅勤務・リモートワーク',
  '客先訪問・外回り商談',
  '開発・動作検証・テスト',
  '動画撮影・イベント配信',
  '出張対応',
];

export const ReservationModal: React.FC<ReservationModalProps> = ({
  item,
  onClose,
  onConfirm,
}) => {
  if (!item) return null;

  // Set default dates
  const todayStr = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(`${todayStr}T10:00`);
  const [endDate, setEndDate] = useState(`${todayStr}T18:00`);
  const [selectedPreset, setSelectedPreset] = useState(PURPOSE_PRESETS[0]);
  const [customPurpose, setCustomPurpose] = useState('');
  const [agreed, setAgreed] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const purposeText = customPurpose.trim()
      ? `${selectedPreset} (${customPurpose.trim()})`
      : selectedPreset;

    const formattedStart = startDate.replace('T', ' ');
    const formattedEnd = endDate.replace('T', ' ');

    onConfirm({
      equipmentId: item.id,
      startDate: formattedStart,
      endDate: formattedEnd,
      purpose: purposeText,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">備品の予約申請</h3>
              <p className="text-xs text-slate-400">利用条件を確認して申請してください</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Equipment Banner */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center space-x-3">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="font-mono text-[11px] text-slate-500">{item.code}</div>
            <div className="font-bold text-sm text-slate-900 truncate">{item.name}</div>
            <div className="text-xs text-slate-500 flex items-center mt-0.5">
              <MapPin className="w-3 h-3 mr-1 text-slate-400" />
              <span className="truncate">{item.location}</span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Applicant Info */}
          <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-100 flex items-center justify-between text-indigo-950">
            <span className="text-slate-600 font-medium">予約申請者:</span>
            <span className="font-bold">{CURRENT_USER.name} ({CURRENT_USER.department})</span>
          </div>

          {/* Date Picker Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">利用開始日時</label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">返却予定日時</label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Purpose Presets */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">利用目的の分類</label>
            <div className="grid grid-cols-2 gap-1.5">
              {PURPOSE_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setSelectedPreset(preset)}
                  className={`p-2 rounded-xl text-left font-medium border transition ${
                    selectedPreset === preset
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Detail Note */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">補足・詳細目的 (任意)</label>
            <textarea
              value={customPurpose}
              onChange={(e) => setCustomPurpose(e.target.value)}
              placeholder="会議室名やプロジェクト名、特記事項など..."
              rows={2}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Checkbox agreement */}
          <div className="flex items-start space-x-2 pt-1">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="agree" className="text-slate-600 text-[11px] leading-tight">
              利用完了後は指定の返却場所に速やかに戻し、破損・紛失のないよう取り扱います。
            </label>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={!agreed}
              className={`px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-md transition flex items-center space-x-1.5 ${
                agreed
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>予約を確定する</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
