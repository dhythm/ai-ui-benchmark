import type { Equipment, EquipmentCategory, EquipmentStatus } from '../types/equipment'

export type CategoryFilter = EquipmentCategory | 'all'
export type StatusFilter = EquipmentStatus | 'all'

export type EquipmentFilter = {
  keyword: string
  category: CategoryFilter
  status: StatusFilter
}

/** 全角英数・全角スペースを半角に寄せ、小文字化する */
export function normalizeKeyword(raw: string): string {
  return raw
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
    .replace(/　/g, ' ')
    .trim()
    .toLowerCase()
}

export function filterEquipment(items: Equipment[], filter: EquipmentFilter): Equipment[] {
  const keyword = normalizeKeyword(filter.keyword)
  return items.filter((item) => {
    if (filter.category !== 'all' && item.category !== filter.category) return false
    if (filter.status !== 'all' && item.status !== filter.status) return false
    if (keyword === '') return true
    const haystack = normalizeKeyword(`${item.name} ${item.model} ${item.assetNo}`)
    return haystack.includes(keyword)
  })
}

export function countByStatus(items: Equipment[]): Record<EquipmentStatus, number> {
  const counts: Record<EquipmentStatus, number> = { available: 0, 'in-use': 0, reserved: 0, maintenance: 0 }
  for (const item of items) counts[item.status] += 1
  return counts
}
