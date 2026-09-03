export type EquipmentCategory =
  | 'laptop'
  | 'monitor'
  | 'camera'
  | 'projector'
  | 'mobile-wifi'
  | 'peripheral'

export type EquipmentStatus = 'available' | 'in-use' | 'reserved' | 'maintenance'

export type Equipment = {
  id: string
  /** 管理番号（例: NB-0012） */
  assetNo: string
  name: string
  model: string
  category: EquipmentCategory
  status: EquipmentStatus
  /** 保管場所 */
  location: string
  /** 貸出中・予約済のときの利用者（部署 / 氏名） */
  holder?: string
  /** 貸出中の返却予定日、または予約の利用開始日（YYYY-MM-DD） */
  dueDate?: string
  note?: string
}

export type Reservation = {
  equipmentId: string
  startDate: string
  endDate: string
  purpose: string
}

export const CATEGORY_LABELS: Record<EquipmentCategory, string> = {
  laptop: 'ノートPC',
  monitor: 'モニター',
  camera: 'カメラ',
  projector: 'プロジェクター',
  'mobile-wifi': 'モバイルWi-Fi',
  peripheral: 'その他周辺機器',
}

export const STATUS_LABELS: Record<EquipmentStatus, string> = {
  available: '利用可能',
  'in-use': '貸出中',
  reserved: '予約済',
  maintenance: 'メンテナンス中',
}

export const CATEGORY_ORDER: EquipmentCategory[] = [
  'laptop',
  'monitor',
  'camera',
  'projector',
  'mobile-wifi',
  'peripheral',
]

export const STATUS_ORDER: EquipmentStatus[] = [
  'available',
  'in-use',
  'reserved',
  'maintenance',
]
