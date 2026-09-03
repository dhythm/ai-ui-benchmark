import { describe, expect, it } from 'vitest'
import type { Equipment } from '../types/equipment'
import { applyReservation, cancelReservation, validateReservation } from './reservation'

const base: Equipment = {
  id: '1',
  assetNo: 'NB-0001',
  name: 'MacBook Pro',
  model: 'M4',
  category: 'laptop',
  status: 'available',
  location: '本社 3F',
}

describe('validateReservation', () => {
  it('開始日・終了日が正しければエラーなし', () => {
    expect(validateReservation({ startDate: '2026-09-04', endDate: '2026-09-05', purpose: '客先訪問' }, '2026-09-03')).toEqual({})
  })
  it('開始日が空ならエラー', () => {
    expect(validateReservation({ startDate: '', endDate: '2026-09-05', purpose: '' }, '2026-09-03').startDate).toBeTruthy()
  })
  it('開始日が今日より前ならエラー', () => {
    expect(validateReservation({ startDate: '2026-09-02', endDate: '2026-09-05', purpose: '' }, '2026-09-03').startDate).toBeTruthy()
  })
  it('終了日が開始日より前ならエラー', () => {
    expect(validateReservation({ startDate: '2026-09-05', endDate: '2026-09-04', purpose: '' }, '2026-09-03').endDate).toBeTruthy()
  })
  it('開始日と終了日が同日は許可する', () => {
    expect(validateReservation({ startDate: '2026-09-05', endDate: '2026-09-05', purpose: '' }, '2026-09-03')).toEqual({})
  })
})

describe('applyReservation', () => {
  it('対象の備品だけを予約済にし、利用者と利用開始日を設定する', () => {
    const other: Equipment = { ...base, id: '2' }
    const result = applyReservation([base, other], { equipmentId: '1', startDate: '2026-09-04', endDate: '2026-09-05', purpose: '' }, '営業部 / 田中 太郎')
    expect(result[0]).toMatchObject({ status: 'reserved', holder: '営業部 / 田中 太郎', dueDate: '2026-09-04' })
    expect(result[1]).toEqual(other)
  })
  it('利用可能でない備品は変更しない', () => {
    const inUse: Equipment = { ...base, status: 'in-use', holder: '他人' }
    const result = applyReservation([inUse], { equipmentId: '1', startDate: '2026-09-04', endDate: '2026-09-05', purpose: '' }, '自分')
    expect(result[0]).toEqual(inUse)
  })
})

describe('cancelReservation', () => {
  it('予約を取り消すと利用可能に戻る', () => {
    const reserved: Equipment = { ...base, status: 'reserved', holder: '自分', dueDate: '2026-09-04' }
    const result = cancelReservation([reserved], '1')
    expect(result[0]).toEqual(base)
  })
})
