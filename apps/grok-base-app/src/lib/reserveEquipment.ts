import type { Equipment, ReservationInput, ReservationResult } from '../types'

export function reserveEquipment(
  items: Equipment[],
  input: ReservationInput,
): ReservationResult {
  const target = items.find((item) => item.id === input.equipmentId)

  if (!target) {
    return { ok: false, error: '指定された備品が見つかりません。' }
  }

  if (target.status !== 'available') {
    return { ok: false, error: 'この備品は現在予約できません。' }
  }

  if (!input.startDate || !input.returnDate) {
    return { ok: false, error: '利用開始日と返却予定日を入力してください。' }
  }

  if (input.returnDate < input.startDate) {
    return { ok: false, error: '返却予定日は利用開始日以降を指定してください。' }
  }

  const purpose = input.purpose.trim()
  const itemsCopy = items.map((item) => {
    if (item.id !== input.equipmentId) {
      return item
    }

    return {
      ...item,
      status: 'reserved' as const,
      currentUser: input.reservedBy,
      returnDate: input.returnDate,
      note: purpose.length > 0 ? purpose : null,
    }
  })

  return { ok: true, items: itemsCopy }
}
