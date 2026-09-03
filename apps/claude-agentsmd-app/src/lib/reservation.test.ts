import { describe, expect, it } from 'vitest'
import type { Equipment } from '../types'
import { applyReservation, validateReservation } from './reservation'

const today = '2026-09-03'
const base: Equipment = {
  id: '1',
  assetTag: 'PC-001',
  name: 'MacBook Pro 14',
  category: 'ノートPC',
  spec: 'M4 / 16GB',
  location: '3F 備品庫',
  status: 'available',
}

describe('validateReservation', () => {
  it('正しい入力ならエラーなし', () => {
    expect(
      validateReservation({ from: '2026-09-04', until: '2026-09-05', purpose: '出張' }, today),
    ).toEqual({})
  })
  it('開始日が今日より前ならエラー', () => {
    const e = validateReservation({ from: '2026-09-02', until: '2026-09-05', purpose: 'x' }, today)
    expect(e.from).toBeDefined()
  })
  it('返却日が開始日より前ならエラー', () => {
    const e = validateReservation({ from: '2026-09-05', until: '2026-09-04', purpose: 'x' }, today)
    expect(e.until).toBeDefined()
  })
  it('日付未入力はエラー', () => {
    const e = validateReservation({ from: '', until: '', purpose: 'x' }, today)
    expect(e.from).toBeDefined()
    expect(e.until).toBeDefined()
  })
  it('用途は空白のみだとエラー', () => {
    const e = validateReservation({ from: '2026-09-04', until: '2026-09-05', purpose: '  ' }, today)
    expect(e.purpose).toBeDefined()
  })
  it('貸出期間は最長 30 日', () => {
    const e = validateReservation({ from: '2026-09-04', until: '2026-10-10', purpose: 'x' }, today)
    expect(e.until).toBeDefined()
  })
})

describe('applyReservation', () => {
  const input = { from: '2026-09-04', until: '2026-09-05', purpose: '客先デモ' }
  const me = { user: '岡田 裕太', department: '開発部' }

  it('対象の備品だけ予約済みに更新し、他は変更しない', () => {
    const other = { ...base, id: '2' }
    const result = applyReservation([base, other], '1', input, me)
    expect(result[0].status).toBe('reserved')
    expect(result[0].usage).toEqual({ ...me, from: input.from, until: input.until })
    expect(result[1]).toBe(other)
  })
  it('利用可能でない備品は更新しない', () => {
    const busy: Equipment = { ...base, status: 'in_use' }
    const result = applyReservation([busy], '1', input, me)
    expect(result[0]).toBe(busy)
  })
})
