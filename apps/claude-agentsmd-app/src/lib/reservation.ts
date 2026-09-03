import type { Equipment, ReservationInput } from '../types'

export const MAX_RENTAL_DAYS = 30

export type ReservationErrors = Partial<Record<keyof ReservationInput, string>>

const DAY_MS = 24 * 60 * 60 * 1000

function daysBetween(from: string, until: string): number {
  return Math.round((Date.parse(until) - Date.parse(from)) / DAY_MS)
}

export function validateReservation(input: ReservationInput, today: string): ReservationErrors {
  const errors: ReservationErrors = {}
  if (!input.from) {
    errors.from = '利用開始日を入力してください'
  } else if (input.from < today) {
    errors.from = '本日以降の日付を指定してください'
  }
  if (!input.until) {
    errors.until = '返却予定日を入力してください'
  } else if (input.from && input.until < input.from) {
    errors.until = '返却予定日は利用開始日以降にしてください'
  } else if (input.from && daysBetween(input.from, input.until) > MAX_RENTAL_DAYS) {
    errors.until = `貸出期間は最長 ${MAX_RENTAL_DAYS} 日です`
  }
  if (input.purpose.trim() === '') {
    errors.purpose = '利用目的を入力してください'
  }
  return errors
}

export function applyReservation(
  list: readonly Equipment[],
  id: string,
  input: ReservationInput,
  requester: { user: string; department: string },
): Equipment[] {
  return list.map((item) => {
    if (item.id !== id || item.status !== 'available') return item
    return {
      ...item,
      status: 'reserved',
      usage: { ...requester, from: input.from, until: input.until },
    }
  })
}

/** ローカル日付を YYYY-MM-DD 形式で返す */
export function toDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
