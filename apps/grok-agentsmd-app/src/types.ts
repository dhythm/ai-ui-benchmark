export const CATEGORIES = [
  'ノートPC',
  'モニター',
  'カメラ',
  'プロジェクター',
  'モバイルWi-Fi',
  '周辺機器',
] as const

export type Category = (typeof CATEGORIES)[number]

export const STATUSES = ['available', 'in_use', 'maintenance'] as const

export type Status = (typeof STATUSES)[number]

export type Equipment = {
  id: string
  assetNo: string
  name: string
  category: Category
  status: Status
  location: string
  spec: string
  borrower?: string
  dueAt?: string
  note?: string
}

export type CategoryFilter = Category | 'all'
export type StatusFilter = Status | 'all'
