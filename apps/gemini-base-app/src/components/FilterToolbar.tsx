import React from 'react';
import type { EquipmentCategory, EquipmentStatus, ViewMode, SortOption } from '../types/equipment';
import { CATEGORY_LABELS } from '../data/mockEquipment';
import {
  Search,
  X,
  Star,
  LayoutGrid,
  List,
  RotateCcw,
  Laptop,
  Monitor,
  Camera,
  Projector,
  Wifi,
  Cpu,
  Grid
} from 'lucide-react';

interface FilterToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: EquipmentCategory | 'all';
  onCategoryChange: (cat: EquipmentCategory | 'all') => void;
  selectedStatus: EquipmentStatus | 'all';
  onStatusChange: (status: EquipmentStatus | 'all') => void;
  favoritesOnly: boolean;
  onFavoritesOnlyToggle: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalFiltered: number;
  totalCount: number;
  onResetFilters: () => void;
}

const CATEGORY_ICONS: Record<EquipmentCategory, React.ComponentType<{ className?: string }>> = {
  pc: Laptop,
  monitor: Monitor,
  camera: Camera,
  projector: Projector,
  wifi: Wifi,
  accessory: Cpu,
};

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  favoritesOnly,
  onFavoritesOnlyToggle,
  viewMode,
  onViewModeChange,
  sortOption,
  onSortChange,
  totalFiltered,
  totalCount,
  onResetFilters,
}) => {
  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    selectedStatus !== 'all' ||
    favoritesOnly;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5 space-y-4">
      {/* Upper Row: Search input + View Mode + Favorites Toggle + Sort */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="備品名、管理番号 (例: PC-2024)、スペック、保管場所で検索..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Favorites Only Toggle */}
          <button
            onClick={onFavoritesOnlyToggle}
            className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition ${
              favoritesOnly
                ? 'bg-amber-50 text-amber-700 border-amber-300 font-semibold'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Star
              className={`w-3.5 h-3.5 ${
                favoritesOnly ? 'fill-amber-400 text-amber-500' : 'text-slate-400'
              }`}
            />
            <span>お気に入り</span>
          </button>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value as EquipmentStatus | 'all')}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="all">ステータス: すべて</option>
              <option value="available">利用可能</option>
              <option value="in_use">貸出中</option>
              <option value="reserved">予約あり</option>
              <option value="maintenance">メンテナンス中</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="name-asc">並び順: 名称順 (A-Z)</option>
              <option value="code-asc">並び順: 管理番号順</option>
              <option value="status-asc">並び順: ステータス順</option>
            </select>
          </div>

          {/* View Mode Toggle Switch */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="カード表示"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="リスト表示"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition border ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm font-semibold'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          全カテゴリ ({totalCount})
        </button>

        {(Object.keys(CATEGORY_LABELS) as EquipmentCategory[]).map((cat) => {
          const config = CATEGORY_LABELS[cat];
          const Icon = CATEGORY_ICONS[cat] || Grid;
          const isSelected = selectedCategory === cat;

          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-semibold'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
              <span>{config.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Filter Info & Reset Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
        <div>
          該当件数: <span className="font-bold text-slate-900">{totalFiltered}</span> 件
          <span className="text-slate-400 ml-1">/ 全 {totalCount} 件</span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 font-medium transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>フィルターをクリア</span>
          </button>
        )}
      </div>
    </div>
  );
};
