import { describe, expect, it } from 'vitest'
import type { Equipment } from '../types'
import { countByStatus, filterEquipment, matchesKeyword } from './filter'

const item = (over: Partial<Equipment>): Equipment => ({
  id: 'x',
  assetTag: 'PC-001',
  name: 'MacBook Pro 14',
  category: 'ノートPC',
  spec: 'M4 / 16GB',
  location: '3F 備品庫',
  status: 'available',
  ...over,
})

const list: Equipment[] = [
  item({ id: '1', name: 'MacBook Pro 14', category: 'ノートPC', status: 'available' }),
  item({
    id: '2',
    name: 'ThinkPad X1',
    category: 'ノートPC',
    status: 'in_use',
    assetTag: 'PC-002',
  }),
  item({
    id: '3',
    name: 'Dell U2723QE',
    category: 'モニター',
    status: 'reserved',
    assetTag: 'MN-001',
  }),
  item({
    id: '4',
    name: 'Sony α7 IV',
    category: 'カメラ',
    status: 'maintenance',
    assetTag: 'CM-001',
  }),
]

describe('matchesKeyword', () => {
  it('空文字は常に一致する', () => {
    expect(matchesKeyword(list[0], '')).toBe(true)
    expect(matchesKeyword(list[0], '   ')).toBe(true)
  })
  it('備品名に部分一致する（大文字小文字を無視）', () => {
    expect(matchesKeyword(list[0], 'macbook')).toBe(true)
    expect(matchesKeyword(list[0], 'thinkpad')).toBe(false)
  })
  it('管理番号にも一致する', () => {
    expect(matchesKeyword(list[2], 'mn-001')).toBe(true)
  })
  it('全角英数字・前後の空白を正規化して一致する', () => {
    expect(matchesKeyword(list[0], ' ＭａｃＢｏｏｋ ')).toBe(true)
  })
})

describe('filterEquipment', () => {
  it('条件なしなら全件返す', () => {
    expect(filterEquipment(list, { keyword: '', category: 'all', status: 'all' })).toHaveLength(4)
  })
  it('カテゴリで絞り込む', () => {
    const r = filterEquipment(list, { keyword: '', category: 'ノートPC', status: 'all' })
    expect(r.map((e) => e.id)).toEqual(['1', '2'])
  })
  it('利用状況で絞り込む', () => {
    const r = filterEquipment(list, { keyword: '', category: 'all', status: 'reserved' })
    expect(r.map((e) => e.id)).toEqual(['3'])
  })
  it('検索・カテゴリ・状況を AND で組み合わせる', () => {
    const r = filterEquipment(list, { keyword: 'think', category: 'ノートPC', status: 'in_use' })
    expect(r.map((e) => e.id)).toEqual(['2'])
    expect(
      filterEquipment(list, { keyword: 'think', category: 'ノートPC', status: 'available' }),
    ).toHaveLength(0)
  })
})

describe('countByStatus', () => {
  it('状況ごとの件数を返す（0 件も含む）', () => {
    expect(countByStatus(list)).toEqual({ available: 1, in_use: 1, reserved: 1, maintenance: 1 })
    expect(countByStatus([])).toEqual({ available: 0, in_use: 0, reserved: 0, maintenance: 0 })
  })
})
