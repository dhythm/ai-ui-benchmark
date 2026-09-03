import React from 'react';
import type { Equipment } from '../types/equipment';
import { CURRENT_USER } from '../data/mockEquipment';
import { X, Calendar, Clock, MapPin, RotateCcw, Package } from 'lucide-react';

interface MyReservationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Equipment[];
  onCancelReservation: (equipmentId: string, reservationId: string) => void;
  onReturnEquipment: (equipmentId: string) => void;
}

export const MyReservationsDrawer: React.FC<MyReservationsDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onCancelReservation,
  onReturnEquipment,
}) => {
  if (!isOpen) return null;

  // Filter items borrowed or reserved by current user
  const myBorrowedItems = items.filter(
    (item) => item.status === 'in_use' && item.currentBorrower?.name === CURRENT_USER.name
  );

  const myUpcomingReservations: Array<{ item: Equipment; reservationId: string; startDate: string; endDate: string; purpose: string }> = [];

  items.forEach((item) => {
    item.reservations.forEach((res) => {
      if (res.userName === CURRENT_USER.name || res.isCurrentUser) {
        myUpcomingReservations.push({
          item,
          reservationId: res.id,
          startDate: res.startDate,
          endDate: res.endDate,
          purpose: res.purpose,
        });
      }
    });
  });

  const totalActive = myBorrowedItems.length + myUpcomingReservations.length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          {/* Header */}
          <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">マイ予約・貸出管理</h3>
                <p className="text-xs text-slate-400">{CURRENT_USER.name} さんの利用状況</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body Scroll */}
          <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
            {totalActive === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Package className="w-6 h-6" />
                </div>
                <div className="font-semibold text-slate-700">現在予約・貸出中の備品はありません</div>
                <p className="text-slate-400 text-xs max-w-xs mx-auto">
                  備品一覧から必要な機器を探して「予約する」ボタンを押してください。
                </p>
              </div>
            ) : (
              <>
                {/* Currently Borrowed Section */}
                {myBorrowedItems.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center text-amber-700">
                      <Clock className="w-4 h-4 mr-1.5" />
                      現在利用中の備品 ({myBorrowedItems.length})
                    </h4>

                    {myBorrowedItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 space-y-3"
                      >
                        <div className="flex items-start space-x-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="font-mono text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                              {item.code}
                            </span>
                            <div className="font-bold text-slate-900 text-sm truncate mt-0.5">
                              {item.name}
                            </div>
                            <div className="text-[11px] text-slate-600 flex items-center mt-0.5">
                              <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                              <span>{item.location}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl p-2.5 border border-amber-200/60 text-slate-700 space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">返却予定:</span>
                            <span className="font-bold text-amber-900">{item.currentBorrower?.until}</span>
                          </div>
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">目的:</span>
                            <span className="font-medium text-slate-800">{item.currentBorrower?.purpose}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => onReturnEquipment(item.id)}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center justify-center space-x-1.5 shadow-sm"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>返却手続きを完了する</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upcoming Reservations Section */}
                {myUpcomingReservations.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center text-indigo-700">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      今後の予約予定 ({myUpcomingReservations.length})
                    </h4>

                    {myUpcomingReservations.map(({ item, reservationId, startDate, endDate, purpose }) => (
                      <div
                        key={reservationId}
                        className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 space-y-3"
                      >
                        <div className="flex items-start space-x-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="font-mono text-[10px] text-indigo-800 bg-indigo-100 px-1.5 py-0.5 rounded">
                              {item.code}
                            </span>
                            <div className="font-bold text-slate-900 text-sm truncate mt-0.5">
                              {item.name}
                            </div>
                            <div className="text-[11px] text-slate-600 flex items-center mt-0.5">
                              <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                              <span>{item.location}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl p-2.5 border border-indigo-100 text-slate-700 space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">利用期間:</span>
                            <span className="font-mono font-bold text-indigo-900">{startDate} 〜 {endDate}</span>
                          </div>
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">目的:</span>
                            <span className="font-medium text-slate-800">{purpose}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => onCancelReservation(item.id, reservationId)}
                          className="w-full py-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-semibold rounded-xl border border-slate-200 hover:border-rose-200 transition flex items-center justify-center space-x-1.5"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>予約をキャンセル</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
            困ったときは ITサポート (内線: 4400 / slack: #it-support)
          </div>
        </div>
      </div>
    </div>
  );
};
