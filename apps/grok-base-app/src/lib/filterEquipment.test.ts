import { describe, expect, it } from 'vitest'
import type { Equipment } from '../types'
import { countByCategory, countByStatus, filterEquipment } from './filterEquipment'

const items: Equipment[] = [
  {
    id: '1',
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
    id: '2',
    managementNumber: 'MN-0201',
    name: 'Dell 27インチ モニター',
    category: 'monitor',
    location: '本社4F 会議室A',
    spec: 'USB-C 90W',
    status: 'in_use',
    currentUser: '田中 美咲',
    returnDate: '2026-09-05',
    note: null,
  },
  {
    id: '3',
    managementNumber: 'WF-0301',
    name: 'ポケットWi-Fi',
    category: 'wifi',
    location: '本社1F 受付',
    spec: '無制限',
    status: 'reserved',
    currentUser: '佐藤 健',
    returnDate: '2026-09-08',
    note: '出張',
  },
]

describe('filterEquipment', () => {
  it('備品名の部分一致で絞り込む', () => {
    const result = filterEquipment(items, {
      query: 'thinkpad',
      category: 'all',
      status: 'all',
    })
    expect(result.map((item) => item.id)).toEqual(['1'])
  })

  it('カテゴリ名でも検索できる', () => {
    const result = filterEquipment(items, {
      query: 'ノートpc',
      category: 'all',
      status: 'all',
    })
    expect(result.map((item) => item.id)).toEqual(['1'])
  })

  it('管理番号でも検索できる', () => {
    const result = filterEquipment(items, {
      query: 'mn-0201',
      category: 'all',
      status: 'all',
    })
    expect(result.map((item) => item.id)).toEqual(['2'])
  })

  it('前後の空白は無視する', () => {
    const result = filterEquipment(items, {
      query: '  モニター  ',
      category: 'all',
      status: 'all',
    })
    expect(result.map((item) => item.id)).toEqual(['2'])
  })

  it('カテゴリで絞り込む', () => {
    const result = filterEquipment(items, {
      query: '',
      category: 'wifi',
      status: 'all',
    })
    expect(result.map((item) => item.id)).toEqual(['3'])
  })

  it('利用状況で絞り込む', () => {
    const result = filterEquipment(items, {
      query: '',
      category: 'all',
      status: 'available',
    })
    expect(result.map((item) => item.id)).toEqual(['1'])
  })

  it('検索とカテゴリと利用状況を組み合わせる', () => {
    const result = filterEquipment(items, {
      query: 'dell',
      category: 'monitor',
      status: 'in_use',
    })
    expect(result.map((item) => item.id)).toEqual(['2'])
  })

  it('条件に一致しない場合は空配列を返す', () => {
    const result = filterEquipment(items, {
      query: '存在しない備品',
      category: 'all',
      status: 'all',
    })
    expect(result).toEqual([])
  })
})

describe('countByCategory / countByStatus', () => {
  it('カテゴリ件数を集計する', () => {
    expect(countByCategory(items)).toEqual({
      laptop: 1,
      monitor: 1,
      camera: 0,
      projector: 0,
      wifi: 1,
      peripheral: 0,
    })
  })

  it('利用状況件数を集計する', () => {
    expect(countByStatus(items)).toEqual({
      available: 1,
      in_use: 1,
      reserved: 1,
    })
  })
})
