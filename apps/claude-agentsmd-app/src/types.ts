export const CATEGORIES = [
  'ノートPC',
  'モニター',
  'カメラ',
  'プロジェクター',
  'モバイルWi-Fi',
  'その他周辺機器',
] as const

export type Category = (typeof CATEGORIES)[number]

export type Status = 'available' | 'in_use' | 'reserved' | 'maintenance'

export const STATUS_LABEL: Record<Status, string> = {
  available: '利用可能',
  in_use: '貸出中',
  reserved: '予約済み',
  maintenance: '点検中',
}

export const STATUS_ORDER: readonly Status[] = ['available', 'in_use', 'reserved', 'maintenance']

export type Usage = {
  /** 利用者または予約者 */
  user: string
  department: string
  /** 利用開始日 (YYYY-MM-DD) */
  from: string
  /** 返却予定日 (YYYY-MM-DD) */
  until: string
}

export type Equipment = {
  id: string
  /** 管理番号 */
  assetTag: string
  name: string
  category: Category
  /** 型番・仕様の短い説明 */
  spec: string
  /** 保管場所 */
  location: string
  status: Status
  usage?: Usage
  /** 点検中の理由など */
  note?: string
}

export type Filters = {
  keyword: string
  category: Category | 'all'
  status: Status | 'all'
}

export type ReservationInput = {
  from: string
  until: string
  purpose: string
}
