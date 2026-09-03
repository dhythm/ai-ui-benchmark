/** YYYY-MM-DD → M/D */
export function formatDate(dateString: string): string {
  const [, m, d] = dateString.split('-').map(Number)
  return `${m}/${d}`
}

/** YYYY-MM-DD → YYYY年M月D日（曜） */
export function formatLongDate(dateString: string): string {
  const [y, m, d] = dateString.split('-').map(Number)
  const weekday = ['日', '月', '火', '水', '木', '金', '土'][new Date(y, m - 1, d).getDay()]
  return `${y}年${m}月${d}日（${weekday}）`
}
