import { describe, expect, it } from 'vitest'
import { formatDateJa, formatTodayJa } from './format'

describe('formatDateJa', () => {
  it('ISO日付を日本語表記にする', () => {
    expect(formatDateJa('2026-09-05')).toBe('9月5日（土）')
  })

  it('不正な日付はそのまま返す', () => {
    expect(formatDateJa('not-a-date')).toBe('not-a-date')
  })
})

describe('formatTodayJa', () => {
  it('年月日と曜日を返す', () => {
    expect(formatTodayJa(new Date('2026-09-03T12:00:00'))).toBe(
      '2026年9月3日（木）',
    )
  })
})
