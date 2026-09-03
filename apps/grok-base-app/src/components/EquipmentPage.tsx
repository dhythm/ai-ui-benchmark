import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react'
import { EQUIPMENT_LIST } from '../data/equipment'
import {
  countByCategory,
  countByStatus,
  filterEquipment,
} from '../lib/filterEquipment'
import {
  addDaysIso,
  formatDateJa,
  formatTodayJa,
  toIsoDate,
} from '../lib/format'
import { CATEGORY_LABELS, CURRENT_USER, STATUS_LABELS } from '../lib/labels'
import { reserveEquipment } from '../lib/reserveEquipment'
import {
  EQUIPMENT_CATEGORIES,
  EQUIPMENT_STATUSES,
  type Equipment,
  type EquipmentCategory,
  type EquipmentStatus,
} from '../types'

const ALL = 'all' as const

export function EquipmentPage() {
  const [items, setItems] = useState<Equipment[]>(EQUIPMENT_LIST)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<EquipmentCategory | typeof ALL>(ALL)
  const [status, setStatus] = useState<EquipmentStatus | typeof ALL>(ALL)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [startDate, setStartDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [purpose, setPurpose] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const today = useMemo(() => new Date(), [])
  const todayIso = toIsoDate(today)
  const categoryCounts = countByCategory(items)
  const statusCounts = countByStatus(items)
  const visibleItems = filterEquipment(items, { query, category, status })
  const selected = items.find((item) => item.id === selectedId) ?? null
  const hasFilter =
    query.trim().length > 0 || category !== ALL || status !== ALL

  function resetFilters() {
    setQuery('')
    setCategory(ALL)
    setStatus(ALL)
  }

  function openReservation(id: string) {
    setSelectedId(id)
    setStartDate(todayIso)
    setReturnDate(addDaysIso(todayIso, 2))
    setPurpose('')
    setFormError(null)
  }

  function closeReservation() {
    setSelectedId(null)
    setFormError(null)
  }

  function handleReserve(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedId) {
      setFormError('備品が選択されていません。')
      return
    }

    const result = reserveEquipment(items, {
      equipmentId: selectedId,
      startDate,
      returnDate,
      purpose,
      reservedBy: CURRENT_USER,
    })

    if (!result.ok) {
      setFormError(result.error)
      return
    }

    const reservedItem = result.items.find((item) => item.id === selectedId)
    setItems(result.items)
    closeReservation()

    if (reservedItem?.returnDate) {
      setNotice(
        `${reservedItem.name} の予約を受け付けました。返却予定は ${formatDateJa(reservedItem.returnDate)} です。`,
      )
    } else {
      setNotice('予約を受け付けました。')
    }
  }

  return (
    <div className="desk">
      <header className="masthead">
        <div className="masthead-brand">
          <p className="masthead-kicker">総務部 ／ 本社ビル</p>
          <h1>共有備品デスク</h1>
        </div>
        <div className="masthead-meta">
          <p className="masthead-user">{CURRENT_USER}</p>
          <p className="masthead-date">{formatTodayJa(today)}</p>
        </div>
        <dl className="tally">
          <div>
            <dt>空き</dt>
            <dd>{statusCounts.available}</dd>
          </div>
          <div>
            <dt>貸出中</dt>
            <dd>{statusCounts.in_use}</dd>
          </div>
          <div>
            <dt>予約済</dt>
            <dd>{statusCounts.reserved}</dd>
          </div>
          <div>
            <dt>登録</dt>
            <dd>{items.length}</dd>
          </div>
        </dl>
      </header>

      <div className="workspace">
        <aside className="rail">
          <label className="search-field">
            <span>探す</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="例: ThinkPad、PJ-3301"
              aria-label="備品名または管理番号"
            />
          </label>

          <FilterGroup
            legend="分類"
            value={category}
            onChange={setCategory}
            options={[
              { value: ALL, label: 'すべて', count: items.length },
              ...EQUIPMENT_CATEGORIES.map((value) => ({
                value,
                label: CATEGORY_LABELS[value],
                count: categoryCounts[value],
              })),
            ]}
          />

          <FilterGroup
            legend="利用状況"
            value={status}
            onChange={setStatus}
            options={[
              { value: ALL, label: 'すべて', count: items.length },
              ...EQUIPMENT_STATUSES.map((value) => ({
                value,
                label: STATUS_LABELS[value],
                count: statusCounts[value],
              })),
            ]}
          />
        </aside>

        <main className="ledger">
          <div className="ledger-toolbar">
            <p className="result-count" aria-live="polite">
              {items.length}件中 {visibleItems.length}件
            </p>
            {hasFilter ? (
              <button type="button" className="text-button" onClick={resetFilters}>
                条件をクリア
              </button>
            ) : null}
          </div>

          {notice ? (
            <div className="notice" role="status">
              <p>{notice}</p>
              <button
                type="button"
                className="text-button"
                onClick={() => setNotice(null)}
              >
                閉じる
              </button>
            </div>
          ) : null}

          {visibleItems.length === 0 ? (
            <div className="empty">
              <p>該当する備品はありません。検索語や絞り込みを見直してください。</p>
              <button type="button" className="text-button" onClick={resetFilters}>
                条件をクリア
              </button>
            </div>
          ) : (
            <ul className="slip-list">
              {visibleItems.map((item) => (
                <EquipmentSlip
                  key={item.id}
                  item={item}
                  todayIso={todayIso}
                  onReserve={() => openReservation(item.id)}
                />
              ))}
            </ul>
          )}
        </main>
      </div>

      {selected ? (
        <ReservationDialog
          item={selected}
          startDate={startDate}
          returnDate={returnDate}
          purpose={purpose}
          minDate={todayIso}
          error={formError}
          onStartDateChange={setStartDate}
          onReturnDateChange={setReturnDate}
          onPurposeChange={setPurpose}
          onClose={closeReservation}
          onSubmit={handleReserve}
        />
      ) : null}
    </div>
  )
}

type FilterOption<T extends string> = {
  value: T
  label: string
  count: number
}

function FilterGroup<T extends string>({
  legend,
  value,
  onChange,
  options,
}: {
  legend: string
  value: T
  onChange: (value: T) => void
  options: FilterOption<T>[]
}) {
  return (
    <div className="filter-group" role="group" aria-label={legend}>
      <p className="filter-legend">{legend}</p>
      <div className="filter-options">
        {options.map((option) => {
          const pressed = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              className={pressed ? 'filter-option is-active' : 'filter-option'}
              aria-pressed={pressed}
              onClick={() => onChange(option.value)}
            >
              <span>{option.label}</span>
              <span className="filter-count">{option.count}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function EquipmentSlip({
  item,
  todayIso,
  onReserve,
}: {
  item: Equipment
  todayIso: string
  onReserve: () => void
}) {
  const dueToday = item.returnDate === todayIso
  const statusLabel = STATUS_LABELS[item.status]

  return (
    <li
      className={`slip is-${item.status}`}
      aria-label={`${item.name}（${statusLabel}）`}
    >
      <p className="slip-status">{statusLabel}</p>
      <div className="slip-body">
        <p className="slip-code">{item.managementNumber}</p>
        <p className="slip-name">{item.name}</p>
        <p className="slip-meta">
          {CATEGORY_LABELS[item.category]}
          <span className="slip-sep" />
          {item.location}
          <span className="slip-sep" />
          {item.spec}
        </p>
        <UsageLine item={item} dueToday={dueToday} />
      </div>
      <div className="slip-action">
        {item.status === 'available' ? (
          <button
            type="button"
            className="reserve-button"
            onClick={onReserve}
            aria-label={`${item.name} を予約する`}
          >
            予約する
          </button>
        ) : (
          <p className="slip-wait">予約不可</p>
        )}
      </div>
    </li>
  )
}

function UsageLine({
  item,
  dueToday,
}: {
  item: Equipment
  dueToday: boolean
}) {
  if (item.status === 'available') {
    return <p className="slip-usage">今すぐ予約できます</p>
  }

  const person = item.currentUser ?? '担当者未設定'
  const date = item.returnDate ? formatDateJa(item.returnDate) : '未定'
  const verb = item.status === 'in_use' ? 'が利用中' : 'が予約'

  return (
    <p className="slip-usage">
      <strong>{person}</strong> {verb} ／ 返却 {date}
      {dueToday ? ' 本日返却' : ''}
    </p>
  )
}

function ReservationDialog({
  item,
  startDate,
  returnDate,
  purpose,
  minDate,
  error,
  onStartDateChange,
  onReturnDateChange,
  onPurposeChange,
  onClose,
  onSubmit,
}: {
  item: Equipment
  startDate: string
  returnDate: string
  purpose: string
  minDate: string
  error: string | null
  onStartDateChange: (value: string) => void
  onReturnDateChange: (value: string) => void
  onPurposeChange: (value: string) => void
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  const titleId = useId()
  const errorId = useId()
  const startRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    startRef.current?.focus()
  }, [])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="dialog-layer">
      <button
        type="button"
        className="dialog-backdrop"
        aria-label="予約をやめる"
        onClick={onClose}
      />
      <div
        className="loan-slip"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <form onSubmit={onSubmit} noValidate>
          <p className="loan-kicker">貸出票</p>
          <h2 id={titleId}>{item.name}</h2>
          <p className="loan-code">
            {item.managementNumber}
            <span className="slip-sep" aria-hidden="true" />
            {item.location}
          </p>

          <label className="field">
            <span>利用開始日</span>
            <input
              ref={startRef}
              type="date"
              value={startDate}
              min={minDate}
              onChange={(event) => onStartDateChange(event.target.value)}
            />
          </label>

          <label className="field">
            <span>返却予定日</span>
            <input
              type="date"
              value={returnDate}
              min={startDate || minDate}
              onChange={(event) => onReturnDateChange(event.target.value)}
            />
          </label>

          <label className="field">
            <span>
              用途 <em>任意</em>
            </span>
            <input
              type="text"
              value={purpose}
              maxLength={80}
              placeholder="例: 客先説明、出張"
              aria-label="用途"
              onChange={(event) => onPurposeChange(event.target.value)}
            />
          </label>

          {error ? (
            <p className="form-error" role="alert" id={errorId}>
              {error}
            </p>
          ) : null}

          <div className="loan-actions">
            <button type="button" className="ghost-button" onClick={onClose}>
              やめる
            </button>
            <button type="submit" className="reserve-button">
              この備品を予約する
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
