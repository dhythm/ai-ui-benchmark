import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react'
import {
  CURRENT_DEPT,
  CURRENT_USER,
  createInitialEquipment,
} from './data/equipment.ts'
import {
  atTime,
  formatDueLabel,
  formatJaDate,
  parseDateInput,
  toDateInputValue,
} from './lib/datetime.ts'
import {
  countByCategory,
  countByStatus,
  filterEquipment,
  sortEquipment,
} from './lib/filter.ts'
import { CATEGORIES } from './types.ts'
import type { CategoryFilter, Equipment, Status, StatusFilter } from './types.ts'
import './App.css'

const STATUS_LABEL: Record<Status, string> = {
  available: '利用可能',
  in_use: '貸出中',
  maintenance: '点検中',
}

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'すべて' },
  { id: 'available', label: '利用可能' },
  { id: 'in_use', label: '貸出中' },
  { id: 'maintenance', label: '点検中' },
]

type DuePreset = 'today' | 'tomorrow' | 'custom'
type Toast = { id: number; text: string }

function App() {
  const [now] = useState(() => new Date())
  const [items, setItems] = useState(() => createInitialEquipment(now))
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [reserveTarget, setReserveTarget] = useState<Equipment | null>(null)
  const [toast, setToast] = useState<Toast | null>(null)
  const toastIdRef = useRef(0)

  const categoryCounts = useMemo(
    () => countByCategory(items, query, status),
    [items, query, status],
  )
  const statusCounts = useMemo(
    () => countByStatus(items, query, category),
    [items, query, category],
  )
  const visible = useMemo(
    () => sortEquipment(filterEquipment(items, query, category, status), CURRENT_USER),
    [items, query, category, status],
  )

  const availableCount = items.filter((item) => item.status === 'available').length
  const myCount = items.filter(
    (item) => item.status === 'in_use' && item.borrower === CURRENT_USER,
  ).length
  const filtersActive = query.trim() !== '' || category !== 'all' || status !== 'all'

  function showToast(text: string) {
    toastIdRef.current += 1
    setToast({ id: toastIdRef.current, text })
  }

  function clearFilters() {
    setQuery('')
    setCategory('all')
    setStatus('all')
  }

  function reserve(id: string, dueAt: string, purpose: string) {
    const target = items.find((item) => item.id === id)
    if (!target) {
      showToast('対象の備品が見つかりません')
      return
    }
    if (target.status !== 'available') {
      showToast('この備品は現在予約できません')
      return
    }

    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'in_use' as const,
              borrower: CURRENT_USER,
              dueAt,
              note: purpose.trim() === '' ? undefined : purpose.trim(),
            }
          : item,
      ),
    )
    setReserveTarget(null)
    showToast(`${target.name} を予約しました`)
  }

  function cancelReservation(id: string) {
    const target = items.find((item) => item.id === id)
    if (!target) {
      showToast('対象の備品が見つかりません')
      return
    }
    if (target.borrower !== CURRENT_USER) {
      showToast('自分の予約以外は取り消せません')
      return
    }

    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'available' as const,
              borrower: undefined,
              dueAt: undefined,
              note: undefined,
            }
          : item,
      ),
    )
    showToast(`${target.name} の予約を取り消しました`)
  }

  return (
    <div className="app">
      <header className="masthead">
        <div className="masthead-brand">
          <p className="masthead-mark">社内</p>
          <h1>備品予約</h1>
        </div>
        <p className="masthead-meta">
          <span>{formatJaDate(now)}</span>
          <span>
            {CURRENT_DEPT}　{CURRENT_USER}
          </span>
        </p>
      </header>

      <div className="shell">
        <aside className="rail" aria-label="絞り込み">
          <div className="search">
            <label htmlFor="equipment-search">検索</label>
            <input
              id="equipment-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="備品名、管理番号"
              autoComplete="off"
            />
          </div>

          <section className="facet">
            <h2>分類</h2>
            <ul>
              <li>
                <FilterButton
                  selected={category === 'all'}
                  count={categoryCounts.all}
                  onSelect={() => setCategory('all')}
                >
                  すべて
                </FilterButton>
              </li>
              {CATEGORIES.map((entry) => (
                <li key={entry}>
                  <FilterButton
                    selected={category === entry}
                    count={categoryCounts[entry]}
                    onSelect={() => setCategory(entry)}
                  >
                    {entry}
                  </FilterButton>
                </li>
              ))}
            </ul>
          </section>

          <section className="facet">
            <h2>利用状況</h2>
            <ul>
              {STATUS_FILTERS.map((entry) => (
                <li key={entry.id}>
                  <FilterButton
                    selected={status === entry.id}
                    count={statusCounts[entry.id]}
                    onSelect={() => setStatus(entry.id)}
                    tone={entry.id === 'all' ? undefined : entry.id}
                  >
                    {entry.label}
                  </FilterButton>
                </li>
              ))}
            </ul>
          </section>
        </aside>

        <main className="ledger">
          <div className="ledger-bar">
            <p className="ledger-summary">
              <strong>{visible.length}</strong>件
              <span>
                全体 {items.length}件 ／ 利用可能 {availableCount}件
                {myCount > 0 ? ` ／ 自分の貸出 ${myCount}件` : ''}
              </span>
            </p>
            {filtersActive ? (
              <button type="button" className="text-btn" onClick={clearFilters}>
                条件をクリア
              </button>
            ) : null}
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">管理番号</th>
                  <th scope="col">備品</th>
                  <th scope="col">保管場所</th>
                  <th scope="col">利用状況</th>
                  <th scope="col">返却予定</th>
                  <th scope="col" className="col-action">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr className="empty-row">
                    <td colSpan={6}>
                      <p>該当する備品はありません</p>
                      {filtersActive ? (
                        <button type="button" className="text-btn" onClick={clearFilters}>
                          条件をクリア
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ) : (
                  visible.map((item) => (
                    <EquipmentRow
                      key={item.id}
                      item={item}
                      now={now}
                      onReserve={() => setReserveTarget(item)}
                      onCancel={() => cancelReservation(item.id)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {reserveTarget ? (
        <ReserveDialog
          item={reserveTarget}
          now={now}
          onClose={() => setReserveTarget(null)}
          onConfirm={(dueAt, purpose) => reserve(reserveTarget.id, dueAt, purpose)}
        />
      ) : null}

      {toast ? <ToastBanner key={toast.id} text={toast.text} onDone={() => setToast(null)} /> : null}
    </div>
  )
}

function FilterButton({
  selected,
  count,
  onSelect,
  children,
  tone,
}: {
  selected: boolean
  count: number
  onSelect: () => void
  children: string
  tone?: Status
}) {
  return (
    <button
      type="button"
      className={`facet-btn${selected ? ' is-selected' : ''}${tone ? ` tone-${tone}` : ''}${count === 0 ? ' is-empty' : ''}`}
      aria-pressed={selected}
      onClick={onSelect}
    >
      <span>{children}</span>
      <span className="facet-count">{count}</span>
    </button>
  )
}

function EquipmentRow({
  item,
  now,
  onReserve,
  onCancel,
}: {
  item: Equipment
  now: Date
  onReserve: () => void
  onCancel: () => void
}) {
  const mine = item.status === 'in_use' && item.borrower === CURRENT_USER

  return (
    <tr className={`item-row is-${item.status}${mine ? ' is-mine' : ''}`}>
      <td className="col-asset">
        <span className="asset-tag">{item.assetNo}</span>
      </td>
      <td className="col-name">
        <p className="item-name">{item.name}</p>
        <p className="item-spec">{item.spec}</p>
      </td>
      <td className="col-place">{item.location}</td>
      <td className="col-status">
        <StatusMark status={item.status} mine={mine} />
        {item.status === 'in_use' && item.borrower ? (
          <p className="status-sub">{mine ? '自分' : item.borrower}</p>
        ) : null}
        {item.status === 'maintenance' && item.note ? (
          <p className="status-sub">{item.note}</p>
        ) : null}
      </td>
      <td
        className={`col-due${item.status === 'in_use' && item.dueAt ? '' : ' is-blank'}`}
      >
        {item.status === 'in_use' && item.dueAt ? formatDueLabel(item.dueAt, now) : '—'}
      </td>
      <td className="col-action">
        {item.status === 'available' ? (
          <button type="button" className="primary-btn" onClick={onReserve}>
            予約
          </button>
        ) : null}
        {mine ? (
          <button type="button" className="ghost-btn" onClick={onCancel}>
            取消
          </button>
        ) : null}
      </td>
    </tr>
  )
}

function StatusMark({ status, mine }: { status: Status; mine: boolean }) {
  const label = mine ? '貸出中' : STATUS_LABEL[status]
  return (
    <span className={`status-mark is-${status}${mine ? ' is-mine' : ''}`}>
      <span className="status-swatch" aria-hidden="true" />
      {label}
    </span>
  )
}

function ReserveDialog({
  item,
  now,
  onClose,
  onConfirm,
}: {
  item: Equipment
  now: Date
  onClose: () => void
  onConfirm: (dueAt: string, purpose: string) => void
}) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const todayDue = atTime(now, 0, 17)
  const tomorrowDue = atTime(now, 1, 12)
  const todayStillOpen = todayDue.getTime() > now.getTime()
  const [preset, setPreset] = useState<DuePreset>(todayStillOpen ? 'today' : 'tomorrow')
  const [customDate, setCustomDate] = useState(() => toDateInputValue(atTime(now, 1, 17)))
  const [purpose, setPurpose] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement
    panelRef.current?.focus()

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [onClose])

  function resolveDue(): Date | null {
    if (preset === 'today') return todayDue
    if (preset === 'tomorrow') return tomorrowDue
    return parseDateInput(customDate, 17, 0)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const due = resolveDue()
    if (!due) {
      setError('返却日を選択してください')
      return
    }
    if (due.getTime() <= now.getTime()) {
      setError('返却予定は現在より後の日時を指定してください')
      return
    }
    setError(null)
    onConfirm(due.toISOString(), purpose)
  }

  return (
    <div
      className="dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={panelRef}
        tabIndex={-1}
      >
        <form onSubmit={handleSubmit}>
          <header className="dialog-head">
            <h2 id={titleId}>予約</h2>
            <p>
              <span className="asset-tag">{item.assetNo}</span>
              <span className="dialog-name">{item.name}</span>
            </p>
            <p className="dialog-meta">
              {item.location}　{item.spec}
            </p>
          </header>

          <fieldset className="due-fieldset">
            <legend>返却予定</legend>
            {todayStillOpen ? (
              <label className="choice">
                <input
                  type="radio"
                  name="due-preset"
                  checked={preset === 'today'}
                  onChange={() => setPreset('today')}
                />
                <span>本日 17:00</span>
              </label>
            ) : null}
            <label className="choice">
              <input
                type="radio"
                name="due-preset"
                checked={preset === 'tomorrow'}
                onChange={() => setPreset('tomorrow')}
              />
              <span>翌日 12:00</span>
            </label>
            <label className="choice">
              <input
                type="radio"
                name="due-preset"
                checked={preset === 'custom'}
                onChange={() => setPreset('custom')}
              />
              <span>日付を指定</span>
            </label>
            {preset === 'custom' ? (
              <label className="date-field">
                <span className="sr-only">返却日</span>
                <input
                  type="date"
                  value={customDate}
                  min={toDateInputValue(now)}
                  onChange={(event) => setCustomDate(event.target.value)}
                />
              </label>
            ) : null}
          </fieldset>

          <label className="purpose-field">
            用途
            <input
              type="text"
              value={purpose}
              onChange={(event) => setPurpose(event.target.value)}
              maxLength={40}
            />
          </label>

          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="dialog-actions">
            <button type="button" className="ghost-btn" onClick={onClose}>
              閉じる
            </button>
            <button type="submit" className="primary-btn">
              予約する
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ToastBanner({ text, onDone }: { text: string; onDone: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 3200)
    return () => window.clearTimeout(timer)
  }, [onDone])

  return (
    <div className="toast" role="status" aria-live="polite">
      {text}
    </div>
  )
}

export default App
