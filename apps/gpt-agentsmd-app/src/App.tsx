import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

type Category = 'ノートPC' | 'モニター' | 'カメラ' | 'プロジェクター' | 'モバイルWi-Fi' | '周辺機器'
type Status = 'available' | 'inUse' | 'reserved'

type Equipment = {
  id: string
  name: string
  category: Category
  status: Status
  location: string
  detail: string
  availableAt?: string
  borrower?: string
}

const equipment: Equipment[] = [
  { id: 'PC-042', name: 'MacBook Pro 14インチ', category: 'ノートPC', status: 'available', location: '東京本社 8F', detail: 'M3 Pro / 18GB / 512GB' },
  { id: 'PC-038', name: 'ThinkPad X1 Carbon', category: 'ノートPC', status: 'inUse', location: '東京本社 8F', detail: 'Core i7 / 16GB / 512GB', availableAt: '9/5 返却予定', borrower: '営業企画部' },
  { id: 'DS-021', name: 'DELL 27インチ 4Kモニター', category: 'モニター', status: 'available', location: '東京本社 7F', detail: 'U2723QE / USB-C給電対応' },
  { id: 'CM-008', name: 'SONY α7 IV', category: 'カメラ', status: 'reserved', location: '東京本社 8F', detail: '標準ズームレンズ・予備バッテリー付', availableAt: '9/8 空き予定', borrower: '広報部' },
  { id: 'PJ-012', name: 'EPSON ビジネスプロジェクター', category: 'プロジェクター', status: 'available', location: '大阪支社 4F', detail: 'EB-L210SW / 4,000lm' },
  { id: 'WF-017', name: 'モバイルWi-Fi 5G', category: 'モバイルWi-Fi', status: 'inUse', location: '東京本社 8F', detail: 'docomo 5G / 無制限プラン', availableAt: '本日 17:00', borrower: '採用チーム' },
  { id: 'AC-026', name: 'USB-C ドッキングステーション', category: '周辺機器', status: 'available', location: '東京本社 7F', detail: 'Anker 675 / 12-in-1' },
  { id: 'DS-018', name: 'LG 34インチ ウルトラワイド', category: 'モニター', status: 'reserved', location: '大阪支社 4F', detail: '34WQ75C-B / USB-C対応', availableAt: '9/12 空き予定', borrower: '開発部' },
  { id: 'CM-011', name: 'DJI Osmo Pocket 3', category: 'カメラ', status: 'available', location: '東京本社 8F', detail: 'Creator Combo / microSD付' },
  { id: 'PC-051', name: 'Surface Laptop 6', category: 'ノートPC', status: 'available', location: '名古屋支社 3F', detail: 'Core Ultra 5 / 16GB / 256GB' },
  { id: 'PJ-009', name: 'Anker Nebula Capsule 3', category: 'プロジェクター', status: 'inUse', location: '東京本社 8F', detail: 'モバイルプロジェクター / HDMI対応', availableAt: '9/6 返却予定', borrower: '新規事業部' },
  { id: 'AC-034', name: 'Jabra 会議用スピーカー', category: '周辺機器', status: 'available', location: '大阪支社 4F', detail: 'Speak2 75 / Bluetooth対応' },
]

const categories: Array<'すべて' | Category> = ['すべて', 'ノートPC', 'モニター', 'カメラ', 'プロジェクター', 'モバイルWi-Fi', '周辺機器']

const iconPaths: Record<Category, React.ReactNode> = {
  'ノートPC': <><rect x="4" y="5" width="16" height="12" rx="2"/><path d="M2.5 20h19"/></>,
  'モニター': <><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></>,
  'カメラ': <><path d="M4 7h3l1.5-2h7L17 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"/><circle cx="12" cy="13" r="4"/></>,
  'プロジェクター': <><rect x="2" y="6" width="20" height="12" rx="3"/><circle cx="16.5" cy="12" r="3"/><path d="M6 18v2m12-2v2M6 10h3"/></>,
  'モバイルWi-Fi': <><rect x="5" y="2" width="14" height="20" rx="3"/><path d="M8.5 9.5a5 5 0 0 1 7 0M10.5 12a2.2 2.2 0 0 1 3 0"/><circle cx="12" cy="15" r=".7" fill="currentColor"/></>,
  '周辺機器': <><path d="M8 7V3m8 4V3M6 7h12v4a6 6 0 0 1-12 0V7Zm6 10v4"/></>,
}

function Icon({ name }: { name: Category }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true">{iconPaths[name]}</svg>
}

function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'すべて' | Category>('すべて')
  const [status, setStatus] = useState<'すべて' | Status>('すべて')
  const [items, setItems] = useState(equipment)
  const [selected, setSelected] = useState<Equipment | null>(null)
  const [toast, setToast] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
      }
      if (event.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filtered = useMemo(() => items.filter((item) => {
    const term = query.trim().toLowerCase()
    const matchesQuery = !term || `${item.name} ${item.id} ${item.detail}`.toLowerCase().includes(term)
    return matchesQuery && (category === 'すべて' || item.category === category) && (status === 'すべて' || item.status === status)
  }), [items, query, category, status])

  const availableCount = items.filter((item) => item.status === 'available').length

  const reserve = () => {
    if (!selected) return
    setItems((current) => current.map((item) => item.id === selected.id ? { ...item, status: 'reserved', borrower: 'あなた', availableAt: '予約済み' } : item))
    setSelected(null)
    setToast(`${selected.name}を予約しました`)
    window.setTimeout(() => setToast(''), 3600)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-mark"><span>R</span></div>
        <div className="brand-copy"><strong>Reserve Hub</strong><small>社内備品予約</small></div>
        <nav aria-label="メインナビゲーション">
          <a className="active" href="#equipment">備品を探す</a>
          <a href="#reservations">予約履歴</a>
        </nav>
        <div className="user-area">
          <button className="notification" aria-label="通知"><span></span>⌁</button>
          <div className="avatar">佐</div>
          <div><strong>佐藤 花子</strong><small>プロダクト開発部</small></div>
          <span className="chevron">⌄</span>
        </div>
      </header>

      <main id="equipment">
        <section className="page-intro">
          <div>
            <p className="eyebrow">EQUIPMENT</p>
            <h1>備品を探す</h1>
            <p className="lead">必要な備品の空き状況を確認し、そのまま予約できます。</p>
          </div>
          <div className="availability-summary">
            <span className="pulse"></span>
            <div><strong>{availableCount}</strong><small>点が現在利用可能</small></div>
          </div>
        </section>

        <section className="search-panel" aria-label="備品を絞り込む">
          <div className="search-row">
            <label className="search-box">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
              <input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="備品名・管理番号で検索" aria-label="備品名・管理番号で検索" />
              <kbd>⌘ K</kbd>
            </label>
            <div className="status-select-wrap">
              <span>利用状況</span>
              <select value={status} onChange={(e) => setStatus(e.target.value as 'すべて' | Status)} aria-label="利用状況">
                <option value="すべて">すべて</option>
                <option value="available">利用可能</option>
                <option value="inUse">貸出中</option>
                <option value="reserved">予約済み</option>
              </select>
            </div>
          </div>
          <div className="category-tabs" role="group" aria-label="カテゴリ">
            {categories.map((item) => <button key={item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)}>{item}</button>)}
          </div>
        </section>

        <div className="result-heading">
          <h2>備品一覧 <span>{filtered.length}</span></h2>
          {(query || category !== 'すべて' || status !== 'すべて') && <button className="clear-button" onClick={() => { setQuery(''); setCategory('すべて'); setStatus('すべて') }}>条件をクリア</button>}
        </div>

        {filtered.length > 0 ? <section className="equipment-grid" aria-live="polite">
          {filtered.map((item, index) => (
            <article className="equipment-card" key={item.id} style={{ animationDelay: `${index * 35}ms` }}>
              <div className={`equipment-visual visual-${item.category}`}>
                <Icon name={item.category} />
                <span className="asset-id">{item.id}</span>
                <span className={`status-badge ${item.status}`}><i></i>{item.status === 'available' ? '利用可能' : item.status === 'inUse' ? '貸出中' : '予約済み'}</span>
              </div>
              <div className="card-body">
                <p className="category-label">{item.category}</p>
                <h3>{item.name}</h3>
                <p className="spec">{item.detail}</p>
                <div className="meta-row"><svg viewBox="0 0 24 24"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>{item.location}</div>
                {item.status !== 'available' && <div className="return-info"><span>{item.borrower}</span><strong>{item.availableAt}</strong></div>}
              </div>
              <div className="card-action">
                {item.status === 'available' ? <button onClick={() => setSelected(item)}>この備品を予約 <span>→</span></button> : <button className="disabled" disabled>現在予約できません</button>}
              </div>
            </article>
          ))}
        </section> : <div className="empty-state"><div>⌕</div><h3>該当する備品がありません</h3><p>検索条件を変えてお試しください。</p><button onClick={() => { setQuery(''); setCategory('すべて'); setStatus('すべて') }}>すべての備品を表示</button></div>}
      </main>

      <footer><span>Reserve Hub</span><p>備品に関するお問い合わせ：総務部 内線 2401</p></footer>

      {selected && <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}>
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <button className="modal-close" onClick={() => setSelected(null)} aria-label="閉じる">×</button>
          <div className="modal-icon"><Icon name={selected.category} /></div>
          <p className="eyebrow">RESERVATION</p>
          <h2 id="modal-title">備品を予約</h2>
          <div className="selected-item"><div><small>{selected.id} ・ {selected.category}</small><strong>{selected.name}</strong></div><span>利用可能</span></div>
          <div className="date-fields">
            <label>利用開始日<input type="date" defaultValue="2026-09-03" /></label>
            <span>→</span>
            <label>返却予定日<input type="date" defaultValue="2026-09-04" /></label>
          </div>
          <label className="purpose-field">利用目的<input type="text" placeholder="例：社外プレゼンで使用" /></label>
          <div className="modal-actions"><button className="cancel" onClick={() => setSelected(null)}>キャンセル</button><button className="confirm" onClick={reserve}>予約を確定する</button></div>
        </div>
      </div>}

      {toast && <div className="toast" role="status"><span>✓</span><div><strong>予約が完了しました</strong><p>{toast}</p></div><button onClick={() => setToast('')}>×</button></div>}
    </div>
  )
}

export default App
