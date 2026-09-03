import { CATEGORY_LABELS, type Equipment } from '../types/equipment'
import { formatDate } from '../lib/format'
import { CategoryIcon } from './Icons'
import { StatusBadge } from './StatusBadge'

type Props = {
  items: Equipment[]
  currentUser: string
  today: string
  onReserve: (item: Equipment) => void
  onCancel: (item: Equipment) => void
  onReset: () => void
}


function StatusDetail({ item, currentUser, today }: { item: Equipment; currentUser: string; today: string }) {
  switch (item.status) {
    case 'in-use': {
      const overdue = item.dueDate !== undefined && item.dueDate < today
      return (
        <div className="status-detail">
          <span>{item.holder}</span>
          <span className={overdue ? 'status-detail__overdue' : undefined}>
            返却予定 {item.dueDate ? formatDate(item.dueDate) : '未定'}
            {overdue && '（返却遅れ）'}
          </span>
        </div>
      )
    }
    case 'reserved':
      return (
        <div className="status-detail">
          <span>{item.holder === currentUser ? 'あなたの予約' : item.holder}</span>
          <span>利用開始 {item.dueDate ? formatDate(item.dueDate) : '未定'}</span>
        </div>
      )
    case 'maintenance':
      return item.note ? <div className="status-detail"><span>{item.note}</span></div> : null
    default:
      return null
  }
}

function RowAction({ item, currentUser, onReserve, onCancel }: Pick<Props, 'currentUser' | 'onReserve' | 'onCancel'> & { item: Equipment }) {
  if (item.status === 'available') {
    return (
      <button type="button" className="btn btn--primary" onClick={() => onReserve(item)}>
        予約する
      </button>
    )
  }
  if (item.status === 'reserved' && item.holder === currentUser) {
    return (
      <button type="button" className="btn btn--ghost" onClick={() => onCancel(item)}>
        予約を取り消す
      </button>
    )
  }
  return (
    <button type="button" className="btn btn--primary" disabled>
      予約する
    </button>
  )
}

export function EquipmentTable({ items, currentUser, today, onReserve, onCancel, onReset }: Props) {
  if (items.length === 0) {
    return (
      <div className="empty-state" role="status">
        <p className="empty-state__title">条件に一致する備品がありません</p>
        <p className="empty-state__desc">検索キーワードや絞り込み条件を変更してお試しください。</p>
        <button type="button" className="btn btn--ghost" onClick={onReset}>
          条件をクリア
        </button>
      </div>
    )
  }
  return (
    <div className="table-wrap">
      <table className="equipment-table">
        <thead>
          <tr>
            <th scope="col" className="col-name">備品</th>
            <th scope="col" className="col-category">カテゴリ</th>
            <th scope="col" className="col-location">保管場所</th>
            <th scope="col" className="col-status">利用状況</th>
            <th scope="col" className="col-action"><span className="visually-hidden">操作</span></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className={`row row--${item.status}`}>
              <td className="col-name">
                <div className="item-cell">
                  <span className="item-cell__icon" aria-hidden="true">
                    <CategoryIcon category={item.category} />
                  </span>
                  <div className="item-cell__text">
                    <span className="item-cell__name">{item.name}</span>
                    <span className="item-cell__meta">
                      <span className="item-cell__asset">{item.assetNo}</span>
                      <span className="item-cell__model">{item.model}</span>
                    </span>
                    {item.status !== 'maintenance' && item.note && <span className="item-cell__note">{item.note}</span>}
                  </div>
                </div>
              </td>
              <td className="col-category" data-label="カテゴリ">{CATEGORY_LABELS[item.category]}</td>
              <td className="col-location" data-label="保管場所">{item.location}</td>
              <td className="col-status" data-label="利用状況">
                <StatusBadge status={item.status} />
                <StatusDetail item={item} currentUser={currentUser} today={today} />
              </td>
              <td className="col-action">
                <RowAction item={item} currentUser={currentUser} onReserve={onReserve} onCancel={onCancel} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
