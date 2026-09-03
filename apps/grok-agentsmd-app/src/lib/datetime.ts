const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'] as const

export function formatJaDate(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${WEEKDAYS[date.getDay()]}）`
}

export function formatClock(date: Date): string {
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function formatDueLabel(iso: string, now = new Date()): string {
  const due = new Date(iso)
  if (Number.isNaN(due.getTime())) return '—'

  const time = formatClock(due)
  if (isSameDay(due, now)) return `本日 ${time}`

  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)
  if (isSameDay(due, tomorrow)) return `翌日 ${time}`

  return `${due.getMonth() + 1}/${due.getDate()} ${time}`
}

export function toDateInputValue(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function atTime(base: Date, plusDays: number, hour: number, minute = 0): Date {
  const next = new Date(base)
  next.setDate(next.getDate() + plusDays)
  next.setHours(hour, minute, 0, 0)
  return next
}

export function parseDateInput(value: string, hour = 17, minute = 0): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [year, month, day] = value.split('-').map(Number)
  const parsed = new Date(year, month - 1, day, hour, minute, 0, 0)
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null
  }
  return parsed
}
