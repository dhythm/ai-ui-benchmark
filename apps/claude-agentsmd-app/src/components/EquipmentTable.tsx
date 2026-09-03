import type { Equipment } from '../types'
import { StatusBadge } from './StatusBadge'

type Props = {
  items: Equipment[]
  onReserve: (item: Equipment) => void
}

function formatDate(iso: string): string {
  const [, m, d] = iso.split('-')
  return `${Number(m)}/${Number(d)}`
}

function UsageDetail({ item }: { item: Equipment }) {
  if (item.status === 'in_use' && item.usage) {
    return (
      <span className="usage">
        {item.usage.user}（{item.usage.department}）・{formatDate(item.usage.until)} 返却予定
      </span>
    )
  }
  if (item.status === 'reserved' && item.usage) {
    return (
      <span className="usage">
        {item.usage.user}（{item.usage.department}）・{formatDate(item.usage.from)}〜
        {formatDate(item.usage.until)}
      </span>
    )
  }
  if (item.status === 'maintenance' && item.note) {
    return <span className="usage">{item.note}</span>
  }
  return null
}

export function EquipmentTable({ items, onReserve }: Props) {
  if (items.length === 0) {
    return (
      <div className="empty">
        <p className="empty__title">該当する備品がありません</p>
        <p className="empty__body">検索条件やカテゴリ・利用状況の絞り込みを変更してください。</p>
      </div>
    )
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th scope="col" className="col-name">
              備品
            </th>
            <th scope="col" className="col-category">
              カテゴリ
            </th>
            <th scope="col" className="col-location">
              保管場所
            </th>
            <th scope="col" className="col-status">
              利用状況
            </th>
            <th scope="col" className="col-action">
              <span className="visually-hidden">操作</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className={`row row--${item.status}`}>
              <td className="col-name" data-label="備品">
                <div className="item">
                  <span className="item__name">{item.name}</span>
                  <span className="item__meta">
                    <span className="item__tag">{item.assetTag}</span>
                    <span className="item__spec">{item.spec}</span>
                  </span>
                </div>
              </td>
              <td className="col-category" data-label="カテゴリ">
                {item.category}
              </td>
              <td className="col-location" data-label="保管場所">
                {item.location}
              </td>
              <td className="col-status" data-label="利用状況">
                <div className="status-cell">
                  <StatusBadge status={item.status} />
                  <UsageDetail item={item} />
                </div>
              </td>
              <td className="col-action">
                {item.status === 'available' ? (
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => onReserve(item)}
                  >
                    予約する
                  </button>
                ) : (
                  <button type="button" className="btn btn--primary" disabled>
                    予約する
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
