import type { CategoryFilter, Equipment, StatusFilter } from '../types.ts'

function matchesQuery(item: Equipment, query: string): boolean {
  const needle = query.trim().toLowerCase()
  if (needle === '') return true

  const haystack = [
    item.name,
    item.assetNo,
    item.spec,
    item.location,
    item.category,
    item.borrower ?? '',
    item.note ?? '',
  ]
    .join(' ')
    .toLowerCase()

  return haystack.includes(needle)
}

export function filterEquipment(
  items: Equipment[],
  query: string,
  category: CategoryFilter,
  status: StatusFilter,
): Equipment[] {
  return items.filter(
    (item) =>
      matchesQuery(item, query) &&
      (category === 'all' || item.category === category) &&
      (status === 'all' || item.status === status),
  )
}

function rankStatus(item: Equipment, currentUser: string): number {
  if (item.status === 'available') return 0
  if (item.status === 'in_use' && item.borrower === currentUser) return 1
  if (item.status === 'in_use') return 2
  return 3
}

export function sortEquipment(items: Equipment[], currentUser: string): Equipment[] {
  return [...items].sort((a, b) => {
    const rankDiff = rankStatus(a, currentUser) - rankStatus(b, currentUser)
    if (rankDiff !== 0) return rankDiff
    return a.assetNo.localeCompare(b.assetNo, 'ja')
  })
}

export function countByCategory(
  items: Equipment[],
  query: string,
  status: StatusFilter,
): Record<CategoryFilter, number> {
  const counts = {
    all: 0,
    ノートPC: 0,
    モニター: 0,
    カメラ: 0,
    プロジェクター: 0,
    'モバイルWi-Fi': 0,
    周辺機器: 0,
  } satisfies Record<CategoryFilter, number>

  for (const item of items) {
    if (!matchesQuery(item, query)) continue
    if (status !== 'all' && item.status !== status) continue
    counts.all += 1
    counts[item.category] += 1
  }

  return counts
}

export function countByStatus(
  items: Equipment[],
  query: string,
  category: CategoryFilter,
): Record<StatusFilter, number> {
  const counts = {
    all: 0,
    available: 0,
    in_use: 0,
    maintenance: 0,
  } satisfies Record<StatusFilter, number>

  for (const item of items) {
    if (!matchesQuery(item, query)) continue
    if (category !== 'all' && item.category !== category) continue
    counts.all += 1
    counts[item.status] += 1
  }

  return counts
}
