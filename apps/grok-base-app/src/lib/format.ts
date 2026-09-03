const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'] as const

function parseIsoDate(iso: string): Date | null {
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) {
    return null
  }
  return date
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function addDaysIso(iso: string, days: number): string {
  const date = parseIsoDate(iso)
  if (!date) {
    return iso
  }
  date.setDate(date.getDate() + days)
  return toIsoDate(date)
}

export function formatDateJa(iso: string): string {
  const date = parseIsoDate(iso)
  if (!date) {
    return iso
  }
  return `${date.getMonth() + 1}月${date.getDate()}日（${WEEKDAYS[date.getDay()]}）`
}

export function formatTodayJa(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${WEEKDAYS[date.getDay()]}）`
}
