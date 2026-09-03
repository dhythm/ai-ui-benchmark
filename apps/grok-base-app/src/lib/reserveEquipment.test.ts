import { describe, expect, it } from 'vitest'
import type { Equipment } from '../types'
import { reserveEquipment } from './reserveEquipment'

const items: Equipment[] = [
  {
    id: 'eq-1',
    managementNumber: 'LP-0101',
    name: 'ThinkPad X1 Carbon',
    category: 'laptop',
    location: '本社3F 備品室',
    spec: 'i7 / 16GB',
    status: 'available',
    currentUser: null,
    returnDate: null,
    note: null,
  },
  {
    id: 'eq-2',
    managementNumber: 'CM-0401',
    name: 'ミラーレスカメラ',
    category: 'camera',
    location: '本社3F 備品室',
    spec: 'レンズキット',
    status: 'in_use',
    currentUser: '鈴木 陽太',
    returnDate: '2026-09-04',
    note: null,
  },
]

describe('reserveEquipment', () => {
  it('空き備品を予約済みに更新する', () => {
    const result = reserveEquipment(items, {
      equipmentId: 'eq-1',
      startDate: '2026-09-03',
      returnDate: '2026-09-05',
      purpose: '客先説明',
      reservedBy: '山田 太郎',
    })

    expect(result.ok).toBe(true)
    if (!result.ok) return

    const reserved = result.items.find((item) => item.id === 'eq-1')
    expect(reserved).toMatchObject({
      status: 'reserved',
      currentUser: '山田 太郎',
      returnDate: '2026-09-05',
      note: '客先説明',
    })
    expect(result.items.find((item) => item.id === 'eq-2')).toEqual(items[1])
  })

  it('元の配列は変更しない', () => {
    const snapshot = structuredClone(items)
    reserveEquipment(items, {
      equipmentId: 'eq-1',
      startDate: '2026-09-03',
      returnDate: '2026-09-05',
      purpose: '',
      reservedBy: '山田 太郎',
    })
    expect(items).toEqual(snapshot)
  })

  it('存在しない備品は予約できない', () => {
    const result = reserveEquipment(items, {
      equipmentId: 'missing',
      startDate: '2026-09-03',
      returnDate: '2026-09-05',
      purpose: '',
      reservedBy: '山田 太郎',
    })
    expect(result).toEqual({
      ok: false,
      error: '指定された備品が見つかりません。',
    })
  })

  it('貸出中の備品は予約できない', () => {
    const result = reserveEquipment(items, {
      equipmentId: 'eq-2',
      startDate: '2026-09-03',
      returnDate: '2026-09-05',
      purpose: '',
      reservedBy: '山田 太郎',
    })
    expect(result).toEqual({
      ok: false,
      error: 'この備品は現在予約できません。',
    })
  })

  it('日付が未入力ならエラーにする', () => {
    const result = reserveEquipment(items, {
      equipmentId: 'eq-1',
      startDate: '',
      returnDate: '2026-09-05',
      purpose: '',
      reservedBy: '山田 太郎',
    })
    expect(result).toEqual({
      ok: false,
      error: '利用開始日と返却予定日を入力してください。',
    })
  })

  it('返却予定日が利用開始日より前ならエラーにする', () => {
    const result = reserveEquipment(items, {
      equipmentId: 'eq-1',
      startDate: '2026-09-05',
      returnDate: '2026-09-04',
      purpose: '',
      reservedBy: '山田 太郎',
    })
    expect(result).toEqual({
      ok: false,
      error: '返却予定日は利用開始日以降を指定してください。',
    })
  })
})
