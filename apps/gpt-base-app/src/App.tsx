import { useMemo, useState } from 'react'
import './App.css'

type Category = 'ノートPC' | 'モニター' | 'カメラ' | 'プロジェクター' | 'モバイルWi-Fi' | '周辺機器'
type Status = 'available' | 'reserved' | 'inUse'

type Equipment = {
  id: string
  name: string
  category: Category
  location: string
  status: Status
  note: string
  availableAt?: string
  icon: 'laptop' | 'monitor' | 'camera' | 'projector' | 'wifi' | 'headset' | 'speaker' | 'tablet'
}

const equipment: Equipment[] = [
  { id: 'PC-024', name: 'MacBook Pro 14インチ', category: 'ノートPC', location: '東京本社・8F', status: 'available', note: 'M3 Pro / 18GB / 512GB', icon: 'laptop' },
  { id: 'MN-018', name: 'Dell 27インチ 4Kモニター', category: 'モニター', location: '東京本社・7F', status: 'available', note: 'USB-C給電 / U2723QE', icon: 'monitor' },
  { id: 'CM-007', name: 'SONY α7 IV', category: 'カメラ', location: '東京本社・総務', status: 'inUse', note: '標準ズームレンズ付属', availableAt: '9/5 返却予定', icon: 'camera' },
  { id: 'PJ-012', name: 'EPSON モバイルプロジェクター', category: 'プロジェクター', location: '大阪支社・4F', status: 'reserved', note: 'HDMI / 3,000lm', availableAt: '本日 17:30〜', icon: 'projector' },
  { id: 'WF-031', name: 'docomo 5G モバイルWi-Fi', category: 'モバイルWi-Fi', location: '東京本社・受付', status: 'available', note: '5G対応 / 無制限プラン', icon: 'wifi' },
  { id: 'AC-044', name: 'Jabra 会議用ヘッドセット', category: '周辺機器', location: '東京本社・8F', status: 'available', note: 'USB-C / ノイズキャンセル', icon: 'headset' },
  { id: 'PC-019', name: 'ThinkPad X1 Carbon', category: 'ノートPC', location: '名古屋支社・3F', status: 'inUse', note: 'Core i7 / 16GB / 512GB', availableAt: '9/6 返却予定', icon: 'laptop' },
  { id: 'CM-011', name: 'DJI Osmo Pocket 3', category: 'カメラ', location: '東京本社・総務', status: 'available', note: 'Creator Combo', icon: 'camera' },
  { id: 'AC-051', name: 'Anker 会議用スピーカー', category: '周辺機器', location: '大阪支社・4F', status: 'reserved', note: 'PowerConf S500', availableAt: '明日 10:00〜', icon: 'speaker' },
  { id: 'MN-022', name: 'LG 34インチ ウルトラワイド', category: 'モニター', location: '東京本社・6F', status: 'available', note: '3440×1440 / USB-C', icon: 'monitor' },
  { id: 'AC-063', name: 'iPad Air 11インチ', category: '周辺機器', location: '東京本社・企画部', status: 'inUse', note: 'Apple Pencil付属', availableAt: '9/9 返却予定', icon: 'tablet' },
  { id: 'PJ-016', name: 'Anker Nebula Capsule 3', category: 'プロジェクター', location: '福岡支社・2F', status: 'available', note: 'フルHD / バッテリー内蔵', icon: 'projector' },
]

const categories: Array<'すべて' | Category> = ['すべて', 'ノートPC', 'モニター', 'カメラ', 'プロジェクター', 'モバイルWi-Fi', '周辺機器']
const statusLabels = { available: '利用可能', reserved: '予約あり', inUse: '利用中' }

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  const paths: Record<string, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    box: <><path d="m4 7 8-4 8 4v10l-8 4-8-4Z"/><path d="m4 7 8 4 8-4M12 11v10"/></>,
    laptop: <><rect x="5" y="4" width="14" height="10" rx="1"/><path d="M3 18h18l-2-4H5Z"/></>,
    monitor: <><rect x="3" y="3" width="18" height="13" rx="2"/><path d="M8 21h8M12 16v5"/></>,
    camera: <><path d="M14 5h-4L8 7H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4Z"/><circle cx="12" cy="13" r="4"/></>,
    projector: <><rect x="3" y="6" width="18" height="11" rx="2"/><circle cx="16" cy="11.5" r="3"/><path d="M7 17v3M17 17v3M7 10h2"/></>,
    wifi: <><path d="M5 10a11 11 0 0 1 14 0M8 14a6 6 0 0 1 8 0M11 18a2 2 0 0 1 2 0"/><circle cx="12" cy="20" r=".5" fill="currentColor"/></>,
    headset: <><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="13" width="4" height="7" rx="2"/><rect x="17" y="13" width="4" height="7" rx="2"/></>,
    speaker: <><rect x="4" y="3" width="16" height="18" rx="3"/><circle cx="12" cy="14" r="4"/><circle cx="12" cy="8" r="1"/></>,
    tablet: <><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M11 18h2"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    filter: <path d="M4 6h16M7 12h10M10 18h4"/>,
  }
  return <svg {...common}>{paths[name]}</svg>
}

function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<(typeof categories)[number]>('すべて')
  const [status, setStatus] = useState<'all' | Status>('all')
  const [selected, setSelected] = useState<Equipment | null>(null)
  const [reservedIds, setReservedIds] = useState<string[]>([])
  const [toast, setToast] = useState('')

  const items = useMemo(() => equipment.filter((item) => {
    const currentStatus = reservedIds.includes(item.id) ? 'reserved' : item.status
    const q = query.trim().toLowerCase()
    return (!q || `${item.name} ${item.id} ${item.note}`.toLowerCase().includes(q)) &&
      (category === 'すべて' || item.category === category) &&
      (status === 'all' || currentStatus === status)
  }), [query, category, status, reservedIds])

  const availableCount = equipment.filter((item) => item.status === 'available' && !reservedIds.includes(item.id)).length

  function reserve(item: Equipment) {
    setReservedIds((ids) => [...ids, item.id])
    setSelected(null)
    setToast(`${item.name} を予約しました`)
    window.setTimeout(() => setToast(''), 3600)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark"><Icon name="box" size={19}/></span><span>備品管理</span></div>
        <nav aria-label="メインナビゲーション"><a className="active" href="#equipment">備品を探す</a><a href="#reservations">予約履歴</a></nav>
        <button className="profile" aria-label="アカウントメニュー"><span className="avatar">岡</span><span className="profile-name">岡田 裕太</span><Icon name="chevron" size={14}/></button>
      </header>

      <main>
        <section className="page-heading">
          <div><p className="eyebrow">EQUIPMENT</p><h1>備品を探す</h1><p className="lead">社内の共有備品を検索して、必要な時間に予約できます。</p></div>
          <div className="summary-card"><span className="summary-icon"><Icon name="check" size={18}/></span><div><strong>{availableCount}</strong><span>点が現在利用可能</span></div><small>全 {equipment.length} 点</small></div>
        </section>

        <section className="workspace" id="equipment">
          <aside className="category-panel">
            <div className="panel-label"><span>カテゴリ</span><small>全 {equipment.length} 点</small></div>
            <div className="category-list">
              {categories.map((item) => {
                const count = item === 'すべて' ? equipment.length : equipment.filter((e) => e.category === item).length
                return <button key={item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)}><span>{item}</span><em>{count}</em></button>
              })}
            </div>
            <div className="help-box"><span><Icon name="calendar" size={17}/></span><p><strong>長期利用について</strong>5営業日を超える利用は、総務部へご相談ください。</p></div>
          </aside>

          <div className="content-panel">
            <div className="tools">
              <label className="search"><Icon name="search" size={19}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="備品名・管理番号で検索"/><kbd>⌘ K</kbd></label>
              <label className="status-filter"><Icon name="filter" size={17}/><select value={status} onChange={(e) => setStatus(e.target.value as 'all' | Status)}><option value="all">すべての利用状況</option><option value="available">利用可能</option><option value="reserved">予約あり</option><option value="inUse">利用中</option></select></label>
            </div>
            <div className="results-meta"><p><strong>{items.length}</strong> 件の備品</p>{(query || category !== 'すべて' || status !== 'all') && <button onClick={() => { setQuery(''); setCategory('すべて'); setStatus('all') }}>条件をクリア</button>}</div>

            <div className="equipment-list">
              {items.map((item, index) => {
                const itemStatus: Status = reservedIds.includes(item.id) ? 'reserved' : item.status
                return <article className="equipment-row" key={item.id} style={{ animationDelay: `${index * 35}ms` }}>
                  <div className={`equipment-visual visual-${item.icon}`}><Icon name={item.icon} size={30}/></div>
                  <div className="equipment-main"><div className="name-line"><h2>{item.name}</h2><span className={`status ${itemStatus}`}><i/>{statusLabels[itemStatus]}</span></div><p>{item.note}</p><div className="meta"><span>{item.id}</span><i/><span>{item.location}</span></div></div>
                  <div className="availability">{itemStatus === 'available' ? <><strong>今すぐ利用できます</strong><span>予約枠に空きあり</span></> : <><strong>{item.availableAt || '予約済み'}</strong><span>{itemStatus === 'inUse' ? '現在貸出中' : '次回利用可能'}</span></>}</div>
                  <button className={itemStatus === 'available' ? 'reserve-button' : 'disabled-button'} disabled={itemStatus !== 'available'} onClick={() => setSelected(item)}>{itemStatus === 'available' ? '予約する' : '予約不可'}{itemStatus === 'available' && <Icon name="chevron" size={15}/>}</button>
                </article>
              })}
              {items.length === 0 && <div className="empty"><span><Icon name="search" size={28}/></span><h2>該当する備品がありません</h2><p>検索語や絞り込み条件を変えてお試しください。</p><button onClick={() => { setQuery(''); setCategory('すべて'); setStatus('all') }}>条件をクリア</button></div>}
            </div>
          </div>
        </section>
      </main>

      {selected && <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}>
        <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <button className="modal-close" onClick={() => setSelected(null)} aria-label="閉じる"><Icon name="close"/></button>
          <p className="modal-kicker">予約内容の確認</p><h2 id="modal-title">{selected.name}</h2><p className="modal-id">{selected.id} ・ {selected.location}</p>
          <div className="booking-fields"><label><span>利用日</span><div><Icon name="calendar" size={18}/><input type="date" defaultValue="2026-09-04"/></div></label><label><span>利用時間</span><div><Icon name="clock" size={18}/><select defaultValue="10:00 - 17:00"><option>09:00 - 12:00</option><option>10:00 - 17:00</option><option>13:00 - 18:00</option><option>終日</option></select></div></label></div>
          <label className="purpose"><span>利用目的 <small>任意</small></span><input placeholder="例：取引先でのプレゼンテーション"/></label>
          <div className="modal-note"><Icon name="check" size={18}/><span>選択した日時は予約可能です</span></div>
          <div className="modal-actions"><button className="cancel" onClick={() => setSelected(null)}>キャンセル</button><button className="confirm" onClick={() => reserve(selected)}>この内容で予約する</button></div>
        </section>
      </div>}

      {toast && <div className="toast"><span><Icon name="check" size={16}/></span><div><strong>予約が完了しました</strong><p>{toast}</p></div><button onClick={() => setToast('')} aria-label="閉じる"><Icon name="close" size={16}/></button></div>}
    </div>
  )
}

export default App
