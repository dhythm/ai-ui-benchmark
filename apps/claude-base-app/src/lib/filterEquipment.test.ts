import { describe, expect, it } from 'vitest'
import type { Equipment } from '../types/equipment'
import { countByStatus, filterEquipment, normalizeKeyword } from './filterEquipment'

const item = (overrides: Partial<Equipment>): Equipment => ({
  id: 'x',
  assetNo: 'XX-0000',
  name: 'テスト備品',
  model: 'MODEL',
  category: 'laptop',
  status: 'available',
  location: '本社 3F',
  ...overrides,
})

const items: Equipment[] = [
  item({ id: '1', name: 'MacBook Pro 14インチ', model: 'M4 Pro', assetNo: 'NB-0001', category: 'laptop', status: 'available' }),
  item({ id: '2', name: 'ThinkPad X1 Carbon', model: 'Gen 12', assetNo: 'NB-0002', category: 'laptop', status: 'in-use' }),
  item({ id: '3', name: 'Dell 27インチ 4K', model: 'U2723QE', assetNo: 'MN-0001', category: 'monitor', status: 'reserved' }),
  item({ id: '4', name: 'Sony α7 IV', model: 'ILCE-7M4', assetNo: 'CM-0001', category: 'camera', status: 'maintenance' }),
]

describe('normalizeKeyword', () => {
  it('前後の空白を除去し、小文字化・全角英数を半角化する', () => {
    expect(normalizeKeyword('  ＭａｃＢｏｏｋ　Pro ')).toBe('macbook pro')
  })
})

describe('filterEquipment', () => {
  it('条件なしなら全件を返す', () => {
    expect(filterEquipment(items, { keyword: '', category: 'all', status: 'all' })).toHaveLength(4)
  })

  it('備品名で部分一致検索できる（大文字小文字を区別しない）', () => {
    const result = filterEquipment(items, { keyword: 'macbook', category: 'all', status: 'all' })
    expect(result.map((e) => e.id)).toEqual(['1'])
  })

  it('型番・管理番号でも検索できる', () => {
    expect(filterEquipment(items, { keyword: 'U2723', category: 'all', status: 'all' }).map((e) => e.id)).toEqual(['3'])
    expect(filterEquipment(items, { keyword: 'NB-0002', category: 'all', status: 'all' }).map((e) => e.id)).toEqual(['2'])
  })

  it('カテゴリで絞り込める', () => {
    expect(filterEquipment(items, { keyword: '', category: 'laptop', status: 'all' }).map((e) => e.id)).toEqual(['1', '2'])
  })

  it('利用状況で絞り込める', () => {
    expect(filterEquipment(items, { keyword: '', category: 'all', status: 'available' }).map((e) => e.id)).toEqual(['1'])
  })

  it('複数条件は AND で組み合わさる', () => {
    expect(filterEquipment(items, { keyword: 'think', category: 'laptop', status: 'in-use' }).map((e) => e.id)).toEqual(['2'])
    expect(filterEquipment(items, { keyword: 'think', category: 'laptop', status: 'available' })).toEqual([])
  })
})

describe('countByStatus', () => {
  it('利用状況ごとの件数を返す', () => {
    expect(countByStatus(items)).toEqual({ available: 1, 'in-use': 1, reserved: 1, maintenance: 1 })
  })
})
