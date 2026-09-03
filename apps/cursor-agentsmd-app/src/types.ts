export const CATEGORIES = [
  'ノートPC',
  'モニター',
  'カメラ',
  'プロジェクター',
  'モバイルWi-Fi',
  '周辺機器',
] as const

export type Category = (typeof CATEGORIES)[number]

export const STATUSES = ['available', 'in_use', 'reserved', 'maintenance'] as const

export type Status = (typeof STATUSES)[number]

export const STATUS_LABEL: Record<Status, string> = {
  available: '利用可能',
  in_use: '貸出中',
  reserved: '予約済',
  maintenance: '点検中',
}

export type Equipment = {
  id: string
  code: string
  name: string
  category: Category
  location: string
  spec: string
  status: Status
  holder: string | null
  returnDate: string | null
}
