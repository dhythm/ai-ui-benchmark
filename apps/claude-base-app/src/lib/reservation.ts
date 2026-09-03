import type { Equipment, Reservation } from '../types/equipment'

export type ReservationInput = Omit<Reservation, 'equipmentId'>
export type ReservationErrors = Partial<Record<keyof ReservationInput, string>>

export function validateReservation(input: ReservationInput, today: string): ReservationErrors {
  const errors: ReservationErrors = {}
  if (!input.startDate) {
    errors.startDate = '利用開始日を入力してください'
  } else if (input.startDate < today) {
    errors.startDate = '利用開始日は本日以降の日付を指定してください'
  }
  if (!input.endDate) {
    errors.endDate = '返却予定日を入力してください'
  } else if (input.startDate && input.endDate < input.startDate) {
    errors.endDate = '返却予定日は利用開始日以降の日付を指定してください'
  }
  return errors
}

export function applyReservation(items: Equipment[], reservation: Reservation, holder: string): Equipment[] {
  return items.map((item) => {
    if (item.id !== reservation.equipmentId || item.status !== 'available') return item
    return { ...item, status: 'reserved', holder, dueDate: reservation.startDate }
  })
}

export function cancelReservation(items: Equipment[], equipmentId: string): Equipment[] {
  return items.map((item) => {
    if (item.id !== equipmentId || item.status !== 'reserved') return item
    const { holder: _holder, dueDate: _dueDate, ...rest } = item
    return { ...rest, status: 'available' }
  })
}

/** ローカル日付を YYYY-MM-DD 形式で返す */
export function toDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addDays(dateString: string, days: number): string {
  const [y, m, d] = dateString.split('-').map(Number)
  const date = new Date(y, m - 1, d + days)
  return toDateString(date)
}
