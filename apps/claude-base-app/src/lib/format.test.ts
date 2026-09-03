import { describe, expect, it } from 'vitest'
import { formatDate, formatLongDate } from './format'

describe('formatDate', () => {
  it('M/D 形式に変換する', () => {
    expect(formatDate('2026-09-03')).toBe('9/3')
    expect(formatDate('2026-12-25')).toBe('12/25')
  })
})

describe('formatLongDate', () => {
  it('曜日付きの日本語表記に変換する', () => {
    expect(formatLongDate('2026-09-03')).toBe('2026年9月3日（木）')
  })
})
