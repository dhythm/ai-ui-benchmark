import { useEffect, useMemo, useRef, useState } from 'react'
import { CURRENT_USER, INITIAL_EQUIPMENT } from './data/equipment'
import {
  CATEGORIES,
  RETURN_PRESETS,
  STATUS_LABEL,
  type Category,
  type Equipment,
  type ReturnPresetId,
  type Status,
} from './types'
import './App.css'

const PURPOSES = ['客先訪問', '社内会議', '撮影・収録', '在宅勤務', 'その他'] as const

type Purpose = (typeof PURPOSES)[number]

function formatDue(value: string | null) {
  if (!value) return '—'
  const [date, time] = value.split(' ')
  const [, month, day] = date.split('-')
  return `${Number(month)}/${Number(day)} ${time}`
}

function dueFromPreset(presetId: ReturnPresetId) {
  const preset = RETURN_PRESETS.find((item) => item.id === presetId)!
  const date = new Date(2026, 8, 3, 18, 0, 0)
  date.setHours(date.getHours() + preset.hours)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d} ${preset.at}`
}

function matchesQuery(item: Equipment, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return [item.id, item.name, item.spec, item.location, item.holder ?? '']
    .join(' ')
    .toLowerCase()
    .includes(q)
}

export default function App() {
  const [items, setItems] = useState<Equipment[]>(INITIAL_EQUIPMENT)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [status, setStatus] = useState<Status | 'all'>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [presetId, setPresetId] = useState<ReturnPresetId>('today')
  const [purpose, setPurpose] = useState<Purpose>('社内会議')
  const [notice, setNotice] = useState<string | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const selected = items.find((item) => item.id === selectedId) ?? null

  const counts = useMemo(() => {
    return {
      all: items.length,
      available: items.filter((item) => item.status === 'available').length,
      in_use: items.filter((item) => item.status === 'in_use').length,
      reserved: items.filter((item) => item.status === 'reserved').length,
      maintenance: items.filter((item) => item.status === 'maintenance').length,
    }
  }, [items])

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (!matchesQuery(item, query)) return false
      if (category !== 'all' && item.category !== category) return false
      if (status !== 'all' && item.status !== status) return false
      return true
    })
  }, [items, query, category, status])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(null), 4200)
    return () => window.clearTimeout(timer)
  }, [notice])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
      }
      if (event.key === 'Escape') setSelectedId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function reserve() {
    if (!selected) return
    const dueAt = dueFromPreset(presetId)
    const preset = RETURN_PRESETS.find((item) => item.id === presetId)!
    setItems((prev) =>
      prev.map((item) =>
        item.id === selected.id
          ? {
              ...item,
              status: 'reserved',
              holder: CURRENT_USER,
              dueAt,
            }
          : item,
      ),
    )
    setNotice(`${selected.name} を予約しました（${preset.label}／${purpose}）`)
    setSelectedId(null)
    setPresetId('today')
    setPurpose('社内会議')
  }

  function cancelOwn(id: string) {
    const target = items.find((item) => item.id === id)
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: 'available', holder: null, dueAt: null }
          : item,
      ),
    )
    setNotice(`${target?.name ?? '備品'} の予約を取り消しました`)
  }

  return (
    <div className="shell">
      <header className="masthead">
        <div className="brand">
          <p className="brand-kicker">総務部 ／ 備品管理</p>
          <h1>備品一覧</h1>
        </div>
        <div className="masthead-meta">
          <p>
            <span>日付</span>
            2026年9月3日（木）
          </p>
          <p>
            <span>利用者</span>
            {CURRENT_USER}
          </p>
        </div>
      </header>

      <section className="ledger" aria-label="備品の検索と一覧">
        <aside className="rail">
          <label className="search">
            <span>備品名で検索</span>
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="名称・管理番号・保管場所"
              autoComplete="off"
            />
            <kbd>⌘K</kbd>
          </label>

          <fieldset>
            <legend>カテゴリ</legend>
            <div className="chip-list">
              <FilterChip
                active={category === 'all'}
                onClick={() => setCategory('all')}
                count={counts.all}
              >
                すべて
              </FilterChip>
              {CATEGORIES.map((item) => (
                <FilterChip
                  key={item}
                  active={category === item}
                  onClick={() => setCategory(item)}
                  count={items.filter((row) => row.category === item).length}
                >
                  {item}
                </FilterChip>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>利用状況</legend>
            <div className="chip-list">
              <FilterChip
                active={status === 'all'}
                onClick={() => setStatus('all')}
                count={counts.all}
              >
                すべて
              </FilterChip>
              {(
                [
                  ['available', counts.available],
                  ['in_use', counts.in_use],
                  ['reserved', counts.reserved],
                  ['maintenance', counts.maintenance],
                ] as const
              ).map(([key, count]) => (
                <FilterChip
                  key={key}
                  active={status === key}
                  onClick={() => setStatus(key)}
                  count={count}
                  tone={key}
                >
                  {STATUS_LABEL[key]}
                </FilterChip>
              ))}
            </div>
          </fieldset>

          <dl className="tally">
            <div>
              <dt>いま借りられる</dt>
              <dd>{counts.available}</dd>
            </div>
            <div>
              <dt>貸出・予約中</dt>
              <dd>{counts.in_use + counts.reserved}</dd>
            </div>
          </dl>
        </aside>

        <div className="main">
          {notice ? (
            <p className="notice" role="status">
              {notice}
            </p>
          ) : null}

          <div className="result-bar">
            <p>
              {filtered.length}件
              {query || category !== 'all' || status !== 'all' ? '（絞り込み中）' : ''}
            </p>
            {(query || category !== 'all' || status !== 'all') && (
              <button
                type="button"
                className="text-btn"
                onClick={() => {
                  setQuery('')
                  setCategory('all')
                  setStatus('all')
                }}
              >
                条件をクリア
              </button>
            )}
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">管理番号</th>
                  <th scope="col">備品</th>
                  <th scope="col">保管場所</th>
                  <th scope="col">利用状況</th>
                  <th scope="col">操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty">
                      条件に合う備品はありません。検索語や絞り込みを変えてください。
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.id}>
                      <td className="mono">{item.id}</td>
                      <td>
                        <div className="item-name">
                          <strong>{item.name}</strong>
                          <span>
                            {item.category} ／ {item.spec}
                          </span>
                        </div>
                      </td>
                      <td className="place">{item.location}</td>
                      <td>
                        <StatusCell item={item} />
                      </td>
                      <td className="actions">
                        {item.status === 'available' ? (
                          <button
                            type="button"
                            className="primary"
                            onClick={() => setSelectedId(item.id)}
                          >
                            予約する
                          </button>
                        ) : item.status === 'reserved' &&
                          item.holder === CURRENT_USER ? (
                          <button
                            type="button"
                            className="ghost"
                            onClick={() => cancelOwn(item.id)}
                          >
                            予約取消
                          </button>
                        ) : (
                          <span className="muted">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {selected ? (
        <div className="dialog-root">
          <button
            type="button"
            className="backdrop"
            aria-label="閉じる"
            onClick={() => setSelectedId(null)}
          />
          <div
            className="dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reserve-title"
          >
            <p className="dialog-kicker">貸出予約</p>
            <h2 id="reserve-title">{selected.name}</h2>
            <p className="dialog-meta">
              {selected.id} ／ {selected.spec}
              <br />
              受取場所：{selected.location}
            </p>

            <fieldset className="stack">
              <legend>返却予定</legend>
              {RETURN_PRESETS.map((preset) => (
                <label key={preset.id} className="choice">
                  <input
                    type="radio"
                    name="preset"
                    checked={presetId === preset.id}
                    onChange={() => setPresetId(preset.id)}
                  />
                  {preset.label}
                </label>
              ))}
            </fieldset>

            <fieldset className="stack">
              <legend>利用目的</legend>
              <div className="purpose">
                {PURPOSES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={purpose === item ? 'is-on' : ''}
                    onClick={() => setPurpose(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </fieldset>

            <p className="hint">
              予約後、総務棚または各拠点受付で管理番号を伝えて受け取ってください。延長が必要な場合は総務部まで。
            </p>

            <div className="dialog-actions">
              <button type="button" className="ghost" onClick={() => setSelectedId(null)}>
                やめる
              </button>
              <button type="button" className="primary" onClick={reserve}>
                この内容で予約する
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  count,
  children,
  tone,
}: {
  active: boolean
  onClick: () => void
  count: number
  children: string
  tone?: Status
}) {
  return (
    <button
      type="button"
      className={`chip${active ? ' is-on' : ''}${tone ? ` tone-${tone}` : ''}`}
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
      <em>{count}</em>
    </button>
  )
}

function StatusCell({ item }: { item: Equipment }) {
  return (
    <div className={`status status-${item.status}`}>
      <span>{STATUS_LABEL[item.status]}</span>
      {item.holder ? (
        <small>
          {item.holder}
          {item.dueAt ? ` ・${formatDue(item.dueAt)} まで` : ''}
        </small>
      ) : item.status === 'maintenance' ? (
        <small>総務で点検中</small>
      ) : (
        <small>すぐ受け取れます</small>
      )}
    </div>
  )
}
