import { useState, useMemo } from 'react';
import type { Equipment, EquipmentCategory, EquipmentStatus, ViewMode, SortOption } from './types/equipment';
import { INITIAL_EQUIPMENT_LIST, CURRENT_USER } from './data/mockEquipment';
import { Header } from './components/Header';
import { MetricsBar } from './components/MetricsBar';
import { FilterToolbar } from './components/FilterToolbar';
import { EquipmentCard } from './components/EquipmentCard';
import { EquipmentTableRow } from './components/EquipmentTableRow';
import { EquipmentDetailModal } from './components/EquipmentDetailModal';
import { ReservationModal } from './components/ReservationModal';
import { MyReservationsDrawer } from './components/MyReservationsDrawer';
import { Toast } from './components/Toast';
import type { ToastMessage } from './components/Toast';
import { PackageSearch, RotateCcw, Sparkles } from 'lucide-react';

export function App() {
  // Main State
  const [items, setItems] = useState<Equipment[]>(INITIAL_EQUIPMENT_LIST);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EquipmentCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<EquipmentStatus | 'all'>('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');

  // Modals & Drawers State
  const [detailItem, setDetailItem] = useState<Equipment | null>(null);
  const [reservingItem, setReservingItem] = useState<Equipment | null>(null);
  const [isMyReservationsOpen, setIsMyReservationsOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Count my active reservations and borrowings
  const myReservationsCount = useMemo(() => {
    let count = 0;
    items.forEach((item) => {
      if (item.status === 'in_use' && item.currentBorrower?.name === CURRENT_USER.name) {
        count++;
      }
      item.reservations.forEach((r) => {
        if (r.userName === CURRENT_USER.name || r.isCurrentUser) {
          count++;
        }
      });
    });
    return count;
  }, [items]);

  // Reset Filters handler
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setFavoritesOnly(false);
  };

  // Toggle Favorite
  const handleToggleFavorite = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextFav = !item.isFavorite;
          setToast({
            id: Date.now().toString(),
            type: 'info',
            title: nextFav ? 'お気に入りに追加' : 'お気に入りから削除',
            message: `「${item.name}」をお気に入り${nextFav ? 'に登録しました' : 'から外しました'}。`,
          });
          return { ...item, isFavorite: nextFav };
        }
        return item;
      })
    );
  };

  // Confirm Reservation Logic
  const handleConfirmReservation = (resData: {
    equipmentId: string;
    startDate: string;
    endDate: string;
    purpose: string;
  }) => {
    const targetItem = items.find((i) => i.id === resData.equipmentId);
    if (!targetItem) return;

    const newReservation = {
      id: `res-${Date.now()}`,
      userName: CURRENT_USER.name,
      department: CURRENT_USER.department,
      purpose: resData.purpose,
      startDate: resData.startDate,
      endDate: resData.endDate,
      isCurrentUser: true,
    };

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === resData.equipmentId) {
          return {
            ...item,
            status: item.status === 'available' ? 'reserved' : item.status,
            reservations: [...item.reservations, newReservation],
          };
        }
        return item;
      })
    );

    setReservingItem(null);
    setToast({
      id: Date.now().toString(),
      type: 'success',
      title: '予約が完了しました',
      message: `「${targetItem.name}」の予約申請を完了しました。マイ予約画面からいつでも確認できます。`,
    });
  };

  // Return Equipment Logic
  const handleReturnEquipment = (equipmentId: string) => {
    const targetItem = items.find((i) => i.id === equipmentId);
    if (!targetItem) return;

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === equipmentId) {
          return {
            ...item,
            status: item.reservations.length > 0 ? 'reserved' : 'available',
            currentBorrower: undefined,
          };
        }
        return item;
      })
    );

    setToast({
      id: Date.now().toString(),
      type: 'success',
      title: '返却完了',
      message: `「${targetItem.name}」の返却手続きが完了しました。ご協力ありがとうございました。`,
    });
  };

  // Cancel Reservation Logic
  const handleCancelReservation = (equipmentId: string, reservationId: string) => {
    const targetItem = items.find((i) => i.id === equipmentId);

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === equipmentId) {
          const nextRes = item.reservations.filter((r) => r.id !== reservationId);
          return {
            ...item,
            status: nextRes.length === 0 && item.status === 'reserved' ? 'available' : item.status,
            reservations: nextRes,
          };
        }
        return item;
      })
    );

    setToast({
      id: Date.now().toString(),
      type: 'info',
      title: '予約キャンセル',
      message: `「${targetItem?.name || '備品'}」の予約を取り消しました。`,
    });
  };

  // Filter & Sort Logic
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Category Filter
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }

        // Status Filter
        if (selectedStatus !== 'all' && item.status !== selectedStatus) {
          return false;
        }

        // Favorites Only Filter
        if (favoritesOnly && !item.isFavorite) {
          return false;
        }

        // Free Word Search Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = item.name.toLowerCase().includes(q);
          const matchCode = item.code.toLowerCase().includes(q);
          const matchLocation = item.location.toLowerCase().includes(q);
          const matchTag = item.tags.some((t) => t.toLowerCase().includes(q));
          const matchSpec = item.specs.some(
            (s) => s.label.toLowerCase().includes(q) || s.value.toLowerCase().includes(q)
          );
          if (!matchName && !matchCode && !matchLocation && !matchTag && !matchSpec) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'name-asc') {
          return a.name.localeCompare(b.name, 'ja');
        }
        if (sortOption === 'code-asc') {
          return a.code.localeCompare(b.code);
        }
        if (sortOption === 'status-asc') {
          const order: Record<EquipmentStatus, number> = {
            available: 1,
            reserved: 2,
            in_use: 3,
            maintenance: 4,
          };
          return order[a.status] - order[b.status];
        }
        return 0;
      });
  }, [items, selectedCategory, selectedStatus, favoritesOnly, searchQuery, sortOption]);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        myReservationsCount={myReservationsCount}
        onOpenMyReservations={() => setIsMyReservationsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Banner Announcement */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-5 text-white shadow-md border border-indigo-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>社内お知らせ・ルール</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              備品予約ポータルへようこそ
            </h1>
            <p className="text-xs text-indigo-100/90 leading-relaxed max-w-2xl">
              ノートPC・モニター・撮影機材・Wi-Fiルーター等をその場でリアルタイム予約・受取できます。
              利用後は指定の保管ラックへご返却をお願いいたします。
            </p>
          </div>

          <button
            onClick={() => setIsMyReservationsOpen(true)}
            className="px-4 py-2 bg-white text-indigo-950 font-bold text-xs rounded-xl hover:bg-indigo-50 transition shadow-sm whitespace-nowrap"
          >
            現在の自分の貸出・予約を確認 ({myReservationsCount})
          </button>
        </div>

        {/* Metrics Summary Bar */}
        <MetricsBar
          items={items}
          selectedStatus={selectedStatus}
          onSelectStatus={(status) => setSelectedStatus(status)}
        />

        {/* Search & Filter Toolbar */}
        <FilterToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          favoritesOnly={favoritesOnly}
          onFavoritesOnlyToggle={() => setFavoritesOnly(!favoritesOnly)}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortOption={sortOption}
          onSortChange={setSortOption}
          totalFiltered={filteredItems.length}
          totalCount={items.length}
          onResetFilters={handleResetFilters}
        />

        {/* Equipment Content Section */}
        {filteredItems.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <PackageSearch className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">
                条件に一致する備品が見つかりませんでした
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                検索キーワードの表記揺れを確認するか、設定しているフィルター条件をクリアしてください。
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>フィルターを初期化</span>
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredItems.map((item) => (
              <EquipmentCard
                key={item.id}
                item={item}
                onReserve={(i) => setReservingItem(i)}
                onViewDetails={(i) => setDetailItem(i)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-3 text-center w-10">★</th>
                    <th className="py-3 px-3">管理ID</th>
                    <th className="py-3 px-3">備品名 / カテゴリ</th>
                    <th className="py-3 px-3">保管場所</th>
                    <th className="py-3 px-3 hidden lg:table-cell">主要仕様</th>
                    <th className="py-3 px-3">ステータス</th>
                    <th className="py-3 px-3 hidden md:table-cell">次回予定 / 利用者</th>
                    <th className="py-3 px-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <EquipmentTableRow
                      key={item.id}
                      item={item}
                      onReserve={(i) => setReservingItem(i)}
                      onViewDetails={(i) => setDetailItem(i)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Detail Modal */}
      <EquipmentDetailModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onReserve={(i) => setReservingItem(i)}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Reserve Form Modal */}
      <ReservationModal
        item={reservingItem}
        onClose={() => setReservingItem(null)}
        onConfirm={handleConfirmReservation}
      />

      {/* My Reservations Drawer */}
      <MyReservationsDrawer
        isOpen={isMyReservationsOpen}
        onClose={() => setIsMyReservationsOpen(false)}
        items={items}
        onCancelReservation={handleCancelReservation}
        onReturnEquipment={handleReturnEquipment}
      />

      {/* Global Toast Feedback */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500 space-y-1">
        <div className="font-semibold text-slate-700">BizStock 社内備品予約システム</div>
        <p className="text-[11px] text-slate-400">
          © 2026 社内システム開発部・総務部 All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
export default App;
