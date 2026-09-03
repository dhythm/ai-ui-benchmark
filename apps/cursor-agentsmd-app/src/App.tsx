import { useMemo, useRef, useState } from 'react'
import { CURRENT_USER, INITIAL_EQUIPMENT } from './data'
import { CATEGORIES, STATUS_LABEL, type Category, type Equipment, type Status } from './types'
import './App.css'

type CategoryFilter = 'all' | Category
type StatusFilter = 'all' | Status

const TODAY = '2026-09-03'

function formatDate(iso: string) {
  const [, m, d] = iso.split('-')
  return `${Number(m)}/${Number(d)}`
}

function App() {
  const [items, setItems] = useState<Equipment[]>(INITIAL_EQUIPMENT)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [pending, setPending] = useState<Equipment | null>(null)
  const [returnDate, setReturnDate] = useState(TODAY)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number>(0)

  const counts = useMemo(() => {
    const byStatus: Record<Status, number> = {
      available: 0,
      in_use: 0,
      reserved: 0,
      maintenance: 0,
    }
    const byCategory: Record<Category, number> = {
      ノートPC: 0,
      モニター: 0,
      カメラ: 0,
      プロジェクター: 0,
      'モバイルWi-Fi': 0,
      周辺機器: 0,
    }
    for (const item of items) {
      byStatus[item.status] += 1
      byCategory[item.category] += 1
    }
    return { byStatus, byCategory, total: items.length }
  }, [items])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((item) => {
      if (category !== 'all' && item.category !== category) return false
      if (status !== 'all' && item.status !== status) return false
      if (!q) return true
      return item.name.toLowerCase().includes(q) || item.code.toLowerCase().includes(q)
    })
  }, [items, query, category, status])

  function showToast(message: string) {
    window.clearTimeout(toastTimer.current)
    setToast(message)
    toastTimer.current = window.setTimeout(() => setToast(null), 2800)
  }

  function openReserve(item: Equipment) {
    setPending(item)
    setReturnDate(TODAY)
  }

  function confirmReserve() {
    if (!pending) return
    const code = pending.code
    const name = pending.name
    setItems((prev) =>
      prev.map((item) =>
        item.id === pending.id
          ? {
              ...item,
              status: 'reserved',
              holder: CURRENT_USER,
              returnDate,
            }
          : item,
      ),
    )
    setPending(null)
    showToast(`${code} ${name} を予約しました`)
  }

  return (
    <div className="app">
      <header className="masthead">
        <div className="masthead__mark">
          <span className="masthead__dept">総務部 備品係</span>
          <h1>備品一覧</h1>
        </div>
        <p className="masthead__user">
          <span>ログイン中</span>
          {CURRENT_USER}
        </p>
      </header>

      <div className="toolbar">
        <label className="search">
          <span className="search__label">備品名</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="名称または管理番号"
            autoComplete="off"
          />
        </label>
        <div className="toolbar__meta">
          <span>{filtered.length}件</span>
          <span className="toolbar__sep">/</span>
          <span>登録 {counts.total}</span>
        </div>
      </div>

      <nav className="cats" aria-label="カテゴリ">
        <button
          type="button"
          className={category === 'all' ? 'is-on' : undefined}
          onClick={() => setCategory('all')}
        >
          すべて
          <b>{counts.total}</b>
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={category === cat ? 'is-on' : undefined}
            onClick={() => setCategory(cat)}
          >
            {cat}
            <b>{counts.byCategory[cat]}</b>
          </button>
        ))}
      </nav>

      <div className="status-row" role="group" aria-label="利用状況">
        <button
          type="button"
          className={status === 'all' ? 'is-on' : undefined}
          onClick={() => setStatus('all')}
        >
          すべて
        </button>
        {(Object.keys(STATUS_LABEL) as Status[]).map((key) => (
          <button
            key={key}
            type="button"
            className={`${key}${status === key ? ' is-on' : ''}`}
            onClick={() => setStatus(key)}
          >
            {STATUS_LABEL[key]}
            <b>{counts.byStatus[key]}</b>
          </button>
        ))}
      </div>

      <div className="ledger">
        <table>
          <thead>
            <tr>
              <th className="col-code">管理番号</th>
              <th className="col-name">備品</th>
              <th className="col-loc">設置場所</th>
              <th className="col-st">状態</th>
              <th className="col-user">利用者 / 返却</th>
              <th className="col-act"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty">
                  該当する備品はありません
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} data-status={item.status}>
                  <td className="col-code">
                    <code>{item.code}</code>
                  </td>
                  <td className="col-name">
                    <strong>{item.name}</strong>
                    <span className="spec">
                      {item.category}　{item.spec}
                    </span>
                  </td>
                  <td className="col-loc">{item.location}</td>
                  <td className="col-st">
                    <span className={`pill ${item.status}`}>{STATUS_LABEL[item.status]}</span>
                  </td>
                  <td className="col-user">
                    {item.holder ? (
                      <>
                        <span>{item.holder}</span>
                        {item.returnDate ? (
                          <span className="until">{formatDate(item.returnDate)} 返却</span>
                        ) : null}
                      </>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td className="col-act">
                    {item.status === 'available' ? (
                      <button type="button" className="reserve" onClick={() => openReserve(item)}>
                        予約
                      </button>
                    ) : (
                      <span className="no-act">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pending ? (
        <div className="overlay" role="presentation" onClick={() => setPending(null)}>
          <div
            className="sheet"
            role="dialog"
            aria-labelledby="reserve-title"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="sheet__kicker">予約</p>
            <h2 id="reserve-title">{pending.name}</h2>
            <dl>
              <div>
                <dt>管理番号</dt>
                <dd>{pending.code}</dd>
              </div>
              <div>
                <dt>設置場所</dt>
                <dd>{pending.location}</dd>
              </div>
              <div>
                <dt>利用者</dt>
                <dd>{CURRENT_USER}</dd>
              </div>
            </dl>
            <label className="field">
              <span>返却予定日</span>
              <input
                type="date"
                min={TODAY}
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </label>
            <div className="sheet__actions">
              <button type="button" className="ghost" onClick={() => setPending(null)}>
                戻る
              </button>
              <button type="button" className="reserve" onClick={confirmReserve}>
                予約する
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? <div className="toast">{toast}</div> : null}
    </div>
  )
}

export default App
