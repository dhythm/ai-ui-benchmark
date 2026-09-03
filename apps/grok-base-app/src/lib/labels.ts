import type { EquipmentCategory, EquipmentStatus } from '../types'

export const CURRENT_USER = '山田 太郎'

export const CATEGORY_LABELS: Record<EquipmentCategory, string> = {
  laptop: 'ノートPC',
  monitor: 'モニター',
  camera: 'カメラ',
  projector: 'プロジェクター',
  wifi: 'モバイルWi-Fi',
  peripheral: '周辺機器',
}

export const STATUS_LABELS: Record<EquipmentStatus, string> = {
  available: '空き',
  in_use: '貸出中',
  reserved: '予約済',
}
