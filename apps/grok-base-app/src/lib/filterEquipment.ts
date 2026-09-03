import {
  EQUIPMENT_CATEGORIES,
  EQUIPMENT_STATUSES,
  type Equipment,
  type EquipmentCategory,
  type EquipmentStatus,
  type FilterCondition,
} from '../types'
import { CATEGORY_LABELS } from './labels'

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

export function filterEquipment(
  items: Equipment[],
  condition: FilterCondition,
): Equipment[] {
  const query = normalize(condition.query)

  return items.filter((item) => {
    const matchesQuery =
      query.length === 0 ||
      normalize(item.name).includes(query) ||
      normalize(item.managementNumber).includes(query) ||
      normalize(CATEGORY_LABELS[item.category]).includes(query)
    const matchesCategory =
      condition.category === 'all' || item.category === condition.category
    const matchesStatus =
      condition.status === 'all' || item.status === condition.status

    return matchesQuery && matchesCategory && matchesStatus
  })
}

export function countByCategory(
  items: Equipment[],
): Record<EquipmentCategory, number> {
  const counts = Object.fromEntries(
    EQUIPMENT_CATEGORIES.map((category) => [category, 0]),
  ) as Record<EquipmentCategory, number>

  for (const item of items) {
    counts[item.category] += 1
  }

  return counts
}

export function countByStatus(
  items: Equipment[],
): Record<EquipmentStatus, number> {
  const counts = Object.fromEntries(
    EQUIPMENT_STATUSES.map((status) => [status, 0]),
  ) as Record<EquipmentStatus, number>

  for (const item of items) {
    counts[item.status] += 1
  }

  return counts
}
