import type { Equipment, Filters, Status } from '../types'
import { STATUS_ORDER } from '../types'

/** 全角英数字を半角に寄せ、小文字化・前後空白除去した比較用文字列を返す */
export function normalize(text: string): string {
  return text.normalize('NFKC').toLowerCase().trim()
}

export function matchesKeyword(item: Equipment, keyword: string): boolean {
  const q = normalize(keyword)
  if (q === '') return true
  return [item.name, item.assetTag, item.spec].some((field) => normalize(field).includes(q))
}

export function filterEquipment(list: readonly Equipment[], filters: Filters): Equipment[] {
  return list.filter(
    (item) =>
      matchesKeyword(item, filters.keyword) &&
      (filters.category === 'all' || item.category === filters.category) &&
      (filters.status === 'all' || item.status === filters.status),
  )
}

export function countByStatus(list: readonly Equipment[]): Record<Status, number> {
  const counts = Object.fromEntries(STATUS_ORDER.map((s) => [s, 0])) as Record<Status, number>
  for (const item of list) counts[item.status] += 1
  return counts
}
