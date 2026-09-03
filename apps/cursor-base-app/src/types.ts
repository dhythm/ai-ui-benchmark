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
  name: string
  spec: string
  category: Category
  location: string
  status: Status
  holder: string | null
  dueAt: string | null
}

export const RETURN_PRESETS = [
  { id: 'today', label: '本日 18:00 まで', hours: 0, at: '18:00' },
  { id: 'tomorrow', label: '明日 18:00 まで', hours: 24, at: '18:00' },
  { id: '3days', label: '3日後 18:00 まで', hours: 72, at: '18:00' },
  { id: 'week', label: '1週間後 18:00 まで', hours: 168, at: '18:00' },
] as const

export type ReturnPresetId = (typeof RETURN_PRESETS)[number]['id']
