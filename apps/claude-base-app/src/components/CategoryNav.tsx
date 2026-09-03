import { CATEGORY_LABELS, CATEGORY_ORDER, type EquipmentCategory } from '../types/equipment'
import type { CategoryFilter } from '../lib/filterEquipment'
import { CategoryIcon } from './Icons'

type Props = {
  value: CategoryFilter
  counts: Record<EquipmentCategory, number>
  total: number
  onChange: (value: CategoryFilter) => void
}

export function CategoryNav({ value, counts, total, onChange }: Props) {
  const entries: { key: CategoryFilter; label: string; count: number }[] = [
    { key: 'all', label: 'すべてのカテゴリ', count: total },
    ...CATEGORY_ORDER.map((key) => ({ key, label: CATEGORY_LABELS[key], count: counts[key] })),
  ]
  return (
    <nav className="category-nav" aria-label="カテゴリで絞り込む">
      <h2 className="category-nav__title">カテゴリ</h2>
      <ul className="category-nav__list">
        {entries.map((entry) => (
          <li key={entry.key}>
            <button
              type="button"
              className={`category-nav__item${value === entry.key ? ' is-active' : ''}`}
              aria-pressed={value === entry.key}
              onClick={() => onChange(entry.key)}
            >
              {entry.key !== 'all' && <CategoryIcon category={entry.key} size={18} className="category-nav__icon" />}
              <span className="category-nav__label">{entry.label}</span>
              <span className="category-nav__count">{entry.count}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
