import { STATUS_LABELS, STATUS_ORDER, type EquipmentStatus } from '../types/equipment'
import type { StatusFilter } from '../lib/filterEquipment'
import { CloseIcon, SearchIcon } from './Icons'

type Props = {
  keyword: string
  status: StatusFilter
  statusCounts: Record<EquipmentStatus, number>
  total: number
  onKeywordChange: (value: string) => void
  onStatusChange: (value: StatusFilter) => void
}

export function FilterBar({ keyword, status, statusCounts, total, onKeywordChange, onStatusChange }: Props) {
  const options: { key: StatusFilter; label: string; count: number }[] = [
    { key: 'all', label: 'すべて', count: total },
    ...STATUS_ORDER.map((key) => ({ key, label: STATUS_LABELS[key], count: statusCounts[key] })),
  ]
  return (
    <div className="filter-bar">
      <div className="search-field">
        <SearchIcon className="search-field__icon" />
        <input
          type="search"
          className="search-field__input"
          placeholder="備品名・型番・管理番号で検索"
          aria-label="備品名・型番・管理番号で検索"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
        />
        {keyword !== '' && (
          <button type="button" className="search-field__clear" aria-label="検索条件をクリア" onClick={() => onKeywordChange('')}>
            <CloseIcon size={16} />
          </button>
        )}
      </div>
      <div className="status-filter" role="group" aria-label="利用状況で絞り込む">
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            className={`status-filter__chip${status === option.key ? ' is-active' : ''}${option.key !== 'all' ? ` status-filter__chip--${option.key}` : ''}`}
            aria-pressed={status === option.key}
            onClick={() => onStatusChange(option.key)}
          >
            {option.key !== 'all' && <span className="status-filter__dot" aria-hidden="true" />}
            {option.label}
            <span className="status-filter__count">{option.count}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
