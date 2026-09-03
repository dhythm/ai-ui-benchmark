import type { Category, Filters, Status } from '../types'
import { CATEGORIES, STATUS_LABEL, STATUS_ORDER } from '../types'

type Props = {
  filters: Filters
  onChange: (next: Filters) => void
  resultCount: number
  totalCount: number
}

export function FilterBar({ filters, onChange, resultCount, totalCount }: Props) {
  const isFiltered =
    filters.keyword !== '' || filters.category !== 'all' || filters.status !== 'all'

  return (
    <div className="filter-bar">
      <div className="filter-bar__row">
        <label className="search">
          <svg className="search__icon" viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path
              d="M12.5 12.5L17 17"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="search"
            className="search__input"
            placeholder="備品名・管理番号で検索"
            value={filters.keyword}
            onChange={(e) => onChange({ ...filters, keyword: e.target.value })}
            aria-label="備品名・管理番号で検索"
          />
        </label>

        <label className="select">
          <span className="select__label">利用状況</span>
          <select
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value as Status | 'all' })}
          >
            <option value="all">すべて</option>
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="filter-bar__row filter-bar__row--bottom">
        <div className="chips" role="group" aria-label="カテゴリで絞り込む">
          <CategoryChip
            label="すべて"
            active={filters.category === 'all'}
            onClick={() => onChange({ ...filters, category: 'all' })}
          />
          {CATEGORIES.map((c) => (
            <CategoryChip
              key={c}
              label={c}
              active={filters.category === c}
              onClick={() => onChange({ ...filters, category: c })}
            />
          ))}
        </div>
        <div className="filter-bar__meta">
          <span className="result-count" aria-live="polite">
            {isFiltered ? (
              <>
                <strong>{resultCount}</strong> / {totalCount} 件
              </>
            ) : (
              <>
                全 <strong>{totalCount}</strong> 件
              </>
            )}
          </span>
          {isFiltered && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => onChange({ keyword: '', category: 'all', status: 'all' })}
            >
              条件をクリア
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

type ChipProps = { label: string; active: boolean; onClick: () => void }

function CategoryChip({ label, active, onClick }: ChipProps) {
  return (
    <button
      type="button"
      className={`chip${active ? ' chip--active' : ''}`}
      aria-pressed={active}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

export type { Category }
