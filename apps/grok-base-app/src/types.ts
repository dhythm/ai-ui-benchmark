export const EQUIPMENT_CATEGORIES = [
  'laptop',
  'monitor',
  'camera',
  'projector',
  'wifi',
  'peripheral',
] as const

export type EquipmentCategory = (typeof EQUIPMENT_CATEGORIES)[number]

export const EQUIPMENT_STATUSES = ['available', 'in_use', 'reserved'] as const

export type EquipmentStatus = (typeof EQUIPMENT_STATUSES)[number]

export type Equipment = {
  id: string
  managementNumber: string
  name: string
  category: EquipmentCategory
  location: string
  spec: string
  status: EquipmentStatus
  currentUser: string | null
  returnDate: string | null
  note: string | null
}

export type FilterCondition = {
  query: string
  category: EquipmentCategory | 'all'
  status: EquipmentStatus | 'all'
}

export type ReservationInput = {
  equipmentId: string
  startDate: string
  returnDate: string
  purpose: string
  reservedBy: string
}

export type ReservationResult =
  | { ok: true; items: Equipment[] }
  | { ok: false; error: string }
