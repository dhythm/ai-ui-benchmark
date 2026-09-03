export type EquipmentCategory = 
  | 'pc' 
  | 'monitor' 
  | 'camera' 
  | 'projector' 
  | 'wifi' 
  | 'accessory';

export type EquipmentStatus = 
  | 'available'   // 利用可能
  | 'in_use'      // 貸出中
  | 'reserved'    // 予約あり（指定時間に予約入っているが今はフリー、または近々予約）
  | 'maintenance';// メンテナンス中

export interface Reservation {
  id: string;
  userName: string;
  department: string;
  purpose: string;
  startDate: string; // ISO format or display string
  endDate: string;
  isCurrentUser?: boolean;
}

export interface SpecItem {
  label: string;
  value: string;
}

export interface CurrentBorrower {
  name: string;
  department: string;
  until: string;
  purpose: string;
}

export interface Equipment {
  id: string;
  code: string; // 管理ID 例: EQ-PC-001
  name: string;
  category: EquipmentCategory;
  status: EquipmentStatus;
  imageUrl: string;
  location: string; // 保管場所 例: 本社4F 備品キャビネットA
  specs: SpecItem[];
  description: string;
  currentBorrower?: CurrentBorrower;
  reservations: Reservation[];
  isFavorite?: boolean;
  tags: string[];
  lastMaintenanceDate?: string;
}

export type ViewMode = 'grid' | 'table';

export type SortOption = 'name-asc' | 'code-asc' | 'status-asc';
