import { useMemo, useState } from 'react';
import {
  CATEGORIES,
  INITIAL_EQUIPMENT,
  STATUS_LABEL,
  plusDaysISO,
  todayISO,
  type Category,
  type Equipment,
  type EquipmentStatus,
} from './data';
import './App.css';

type StatusFilter = 'all' | EquipmentStatus;
type SortKey = 'recommended' | 'name' | 'returnSoon';
type Toast = { message: string; id: number } | null;

interface ReservationForm {
  start: string;
  end: string;
  purpose: string;
}

const CATEGORY_ICON: Record<Category, string> = {
  'ノートPC': '💻',
  'モニター': '🖥️',
  'カメラ': '📷',
  'プロジェクター': '📽️',
  'モバイルWi-Fi': '📶',
  '周辺機器': '🎧',
};

function statusRank(s: EquipmentStatus): number {
  if (s === 'available') return 0;
  if (s === 'on-loan') return 1;
  return 2;
}

function formatPeriod(start: string, end: string): string {
  const f = (iso: string) => {
    const [, m, d] = iso.split('-');
    return `${Number(m)}/${Number(d)}`;
  };
  return `${f(start)} 〜 ${f(end)}`;
}

function App() {
  const [items, setItems] = useState<Equipment[]>(INITIAL_EQUIPMENT);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | Category>('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [sort, setSort] = useState<SortKey>('recommended');
  const [onlyStock, setOnlyStock] = useState(false);
  const [target, setTarget] = useState<Equipment | null>(null);
  const [form, setForm] = useState<ReservationForm>({ start: todayISO(), end: plusDaysISO(3), purpose: '' });
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState<Toast>(null);
  const [myIds, setMyIds] = useState<string[]>([]);

  function showToast(message: string) {
    const id = Date.now();
    setToast({ message, id });
    window.setTimeout(() => {
      setToast((t) => (t && t.id === id ? null : t));
    }, 3200);
  }

  const counts = useMemo(() => {
    return {
      all: items.length,
      available: items.filter((i) => i.status === 'available').length,
      onLoan: items.filter((i) => i.status === 'on-loan').length,
      maintenance: items.filter((i) => i.status === 'maintenance').length,
      returnSoon: items.filter((i) => i.status === 'on-loan').length,
    };
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = items.filter((item) => {
      if (category !== 'all' && item.category !== category) return false;
      if (status !== 'all' && item.status !== status) return false;
      if (onlyStock && item.status !== 'available') return false;
      if (q) {
        const hay = `${item.name} ${item.model} ${item.id} ${item.spec} ${item.location}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name, 'ja');
      if (sort === 'returnSoon') {
        if (a.status !== b.status) return statusRank(a.status) - statusRank(b.status);
        return (a.returnDate ?? 'zzzz').localeCompare(b.returnDate ?? 'zzzz');
      }
      if (statusRank(a.status) !== statusRank(b.status)) return statusRank(a.status) - statusRank(b.status);
      return a.id.localeCompare(b.id);
    });
    return list;
  }, [items, query, category, status, sort, onlyStock]);

  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) map.set(item.category, (map.get(item.category) ?? 0) + 1);
    return map;
  }, [items]);

  function openReserve(item: Equipment) {
    setTarget(item);
    setForm({ start: todayISO(), end: plusDaysISO(3), purpose: '' });
    setFormError('');
  }

  function closeModal() {
    setTarget(null);
    setFormError('');
  }

  function submitReserve() {
    if (!target) return;
    if (!form.start || !form.end) {
      setFormError('利用開始日と返却予定日を入力してください。');
      return;
    }
    if (form.end < form.start) {
      setFormError('返却予定日は利用開始日以降の日付を指定してください。');
      return;
    }
    if (!form.purpose.trim()) {
      setFormError('利用目的を入力してください。（例： 9/12 採用説明会の撮影のため）');
      return;
    }
    const period = formatPeriod(form.start, form.end);
    setItems((prev) =>
      prev.map((it) =>
        it.id === target.id
          ? { ...it, status: 'on-loan' as EquipmentStatus, borrower: '自分（予約済み）', returnDate: `${period} 返却予定`, nextAvailable: '予約成立' }
          : it,
      ),
    );
    setMyIds((prev) => (prev.includes(target.id) ? prev : [...prev, target.id]));
    closeModal();
    showToast(`「${target.name}」の予約を受け付けました（${period}）`);
  }

  function cancelReserve(item: Equipment) {
    setItems((prev) =>
      prev.map((it) =>
        it.id === item.id
          ? { ...it, status: 'available' as EquipmentStatus, borrower: null, returnDate: null, nextAvailable: '即時利用可' }
          : it,
      ),
    );
    setMyIds((prev) => prev.filter((id) => id !== item.id));
    showToast(`「${item.name}」の予約をキャンセルしました`);
  }

  function clearFilters() {
    setQuery('');
    setCategory('all');
    setStatus('all');
    setOnlyStock(false);
    setSort('recommended');
  }

  const hasFilter = query.trim() !== '' || category !== 'all' || status !== 'all' || onlyStock;

  return (
    <div className="page">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">備</span>
            <div>
              <p className="brand-title">備品予約システム</p>
              <p className="brand-sub">株式会社サンプル商事 ・ 総務部管理</p>
            </div>
          </div>
          <div className="userbox">
            <span className="my-chip" title="自分が予約中の件数">
              あなたの予約 <strong>{myIds.length}件</strong>
            </span>
            <span className="user">
              <span className="avatar" aria-hidden="true">山</span>
              山田 太郎（営業部）
            </span>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="page-head">
          <div>
            <p className="breadcrumb">ホーム / 備品管理 / <span>備品一覧</span></p>
            <h1>備品一覧</h1>
            <p className="lead">
              社内で利用できる備品の在庫と利用状況を確認し、その場で予約できます。
              返却期限は厳守し、破損・紛失時は総務部（内線 3102）まで連絡してください。
            </p>
          </div>
          <div className="head-actions">
            <div className="rule-box">
              <p>貸出ルール</p>
              <ul>
                <li>貸出期間は原則 <strong>14日以内</strong></li>
                <li>受取場所は各備品の保管場所</li>
                <li>カメラ類は講習受講者のみ</li>
              </ul>
            </div>
          </div>
        </div>

        <section className="stats" aria-label="利用状況サマリー">
          <button type="button" className={`stat ${status === 'all' ? 'active' : ''}`} onClick={() => setStatus('all')}>
            <span className="stat-label">登録備品</span>
            <span className="stat-num">{counts.all}<small>件</small></span>
            <span className="stat-hint">すべて表示</span>
          </button>
          <button type="button" className={`stat ok ${status === 'available' ? 'active' : ''}`} onClick={() => setStatus(status === 'available' ? 'all' : 'available')}>
            <span className="stat-label"><i className="dot green" />利用可能</span>
            <span className="stat-num">{counts.available}<small>件</small></span>
            <span className="stat-hint">今すぐ予約できます</span>
          </button>
          <button type="button" className={`stat warn ${status === 'on-loan' ? 'active' : ''}`} onClick={() => setStatus(status === 'on-loan' ? 'all' : 'on-loan')}>
            <span className="stat-label"><i className="dot amber" />貸出中</span>
            <span className="stat-num">{counts.onLoan}<small>件</small></span>
            <span className="stat-hint">返却予定日を確認</span>
          </button>
          <button type="button" className={`stat mute ${status === 'maintenance' ? 'active' : ''}`} onClick={() => setStatus(status === 'maintenance' ? 'all' : 'maintenance')}>
            <span className="stat-label"><i className="dot gray" />メンテナンス中</span>
            <span className="stat-num">{counts.maintenance}<small>件</small></span>
            <span className="stat-hint">予約不可</span>
          </button>
        </section>

        <section className="toolbar" aria-label="検索・絞り込み">
          <div className="toolbar-row">
            <label className="search">
              <span aria-hidden="true">🔍</span>
              <input
                type="search"
                placeholder="備品名・型番・管理番号で検索（例： MacBook、PJ-001、4K ）"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="備品名を検索"
              />
              {query && (
                <button type="button" className="clear-q" onClick={() => setQuery('')} aria-label="検索をクリア">
                  ✕
                </button>
              )}
            </label>
            <div className="toolbar-side">
              <label className="sort">
                並び替え
                <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                  <option value="recommended">おすすめ順（利用可→貸出中）</option>
                  <option value="returnSoon">返却が近い順</option>
                  <option value="name">名前順</option>
                </select>
              </label>
            </div>
          </div>

          <div className="toolbar-row wrap">
            <div className="chip-group" role="group" aria-label="カテゴリで絞り込む">
              <button type="button" className={`chip ${category === 'all' ? 'active' : ''}`} onClick={() => setCategory('all')}>
                すべて <em>{counts.all}</em>
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`chip ${category === c ? 'active' : ''}`}
                  onClick={() => setCategory(category === c ? 'all' : c)}
                >
                  <span aria-hidden="true">{CATEGORY_ICON[c]}</span> {c} <em>{categoryCounts.get(c) ?? 0}</em>
                </button>
              ))}
            </div>
          </div>

          <div className="toolbar-row wrap sub">
            <div className="seg" role="group" aria-label="利用状況で絞り込む">
              {(['all', 'available', 'on-loan', 'maintenance'] as StatusFilter[]).map((s) => (
                <button key={s} type="button" className={`seg-btn ${status === s ? 'active' : ''}`} onClick={() => setStatus(s)}>
                  {s === 'all' ? 'すべての状況' : STATUS_LABEL[s]}
                </button>
              ))}
            </div>
            <label className="check">
              <input type="checkbox" checked={onlyStock} onChange={(e) => setOnlyStock(e.target.checked)} />
              今すぐ予約できるものだけ表示
            </label>
            <span className="result-count" aria-live="polite">
              <strong>{filtered.length}</strong> 件ヒット
              {hasFilter && (
                <button type="button" className="link" onClick={clearFilters}>
                  条件をクリア
                </button>
              )}
            </span>
          </div>
        </section>

        {filtered.length === 0 ? (
          <div className="empty">
            <p className="empty-title">条件に一致する備品がありません</p>
            <p className="empty-desc">検索キーワードや絞り込み条件を変更してお試しください。</p>
            <button type="button" className="btn secondary" onClick={clearFilters}>
              条件をクリアして全件表示
            </button>
          </div>
        ) : (
          <section className="list-head" aria-hidden="true">
            <span className="col-main">備品</span>
            <span className="col-cat">カテゴリ</span>
            <span className="col-place">保管場所</span>
            <span className="col-status">利用状況</span>
            <span className="col-action">予約</span>
          </section>
        )}

        <section className="cards" aria-label="備品リスト">
          {filtered.map((item) => {
            const isMine = myIds.includes(item.id);
            return (
              <article key={item.id} className={`card status-${item.status}`}>
                <div className="col-main">
                  <div className="icon" aria-hidden="true">{CATEGORY_ICON[item.category]}</div>
                  <div className="main-text">
                    <div className="name-row">
                      <h2>{item.name}</h2>
                      {isMine && <span className="mine">予約中</span>}
                    </div>
                    <p className="meta">{item.id} ・ {item.model}</p>
                    <p className="spec">{item.spec}</p>
                    <p className="stock">{item.stock}</p>
                  </div>
                </div>
                <div className="col-cat">
                  <span className="cat-badge">{item.category}</span>
                </div>
                <div className="col-place">
                  <span className="place">{item.location}</span>
                </div>
                <div className="col-status">
                  <span className={`badge ${item.status}`}>
                    <i className="dot" aria-hidden="true" />
                    {STATUS_LABEL[item.status]}
                  </span>
                  <span className="status-sub">
                    {item.status === 'available' && item.nextAvailable}
                    {item.status === 'on-loan' && (
                      <>
                        <span className="borrower">{item.borrower}</span>
                        <span className="return">{item.returnDate}</span>
                      </>
                    )}
                    {item.status === 'maintenance' && `${item.nextAvailable} 復旧見込み`}
                  </span>
                </div>
                <div className="col-action">
                  {item.status === 'available' && (
                    <button type="button" className="btn primary" onClick={() => openReserve(item)}>
                      予約する
                    </button>
                  )}
                  {item.status === 'on-loan' && isMine && (
                    <button type="button" className="btn secondary" onClick={() => cancelReserve(item)}>
                      キャンセル
                    </button>
                  )}
                  {item.status === 'on-loan' && !isMine && (
                    <button type="button" className="btn disabled" disabled title="貸出中のため予約できません">
                      貸出中
                    </button>
                  )}
                  {item.status === 'maintenance' && (
                    <button type="button" className="btn disabled" disabled title="メンテナンス中のため予約できません">
                      予約不可
                    </button>
                  )}
                  <span className="next">{item.status === 'available' ? '最短 即日受取可' : `次回 ${item.nextAvailable}`}</span>
                </div>
              </article>
            );
          })}
        </section>

        <footer className="foot">
          <p>備品の追加・廃棄・故障報告は 総務部 備品管理担当（内線 3102 / soumu-bihin@example.co.jp）まで。返却時は保管場所へ直接返却し、受付簿に記入してください。</p>
        </footer>
      </main>

      {target && (
        <div className="overlay" onClick={closeModal} role="presentation">
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <p className="modal-kicker">{target.id} ・ {target.category}</p>
                <h2 id="modal-title">{target.name}</h2>
                <p className="modal-meta">{target.model} ／ 保管場所：{target.location}</p>
              </div>
              <button type="button" className="modal-close" onClick={closeModal} aria-label="閉じる">
                ✕
              </button>
            </div>
            <div className="modal-status">
              <span className={`badge ${target.status}`}>
                <i className="dot" aria-hidden="true" />
                {STATUS_LABEL[target.status]}
              </span>
              <span className="modal-stock">{target.stock} ・ {target.spec}</span>
            </div>
            <div className="form-grid">
              <label>
                利用開始日 <span className="req">必須</span>
                <input type="date" value={form.start} min={todayISO()} onChange={(e) => setForm({ ...form, start: e.target.value })} />
              </label>
              <label>
                返却予定日 <span className="req">必須</span>
                <input type="date" value={form.end} min={form.start || todayISO()} onChange={(e) => setForm({ ...form, end: e.target.value })} />
              </label>
            </div>
            <label className="purpose">
              利用目的 <span className="req">必須</span>
              <input
                type="text"
                placeholder="例： 9/12 採用説明会の会場撮影のため"
                value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              />
            </label>
            <p className="receive">受取場所：{target.location}（開室時間 9:00–18:00）・ 返却時は受付簿に記入してください</p>
            {form.start && form.end && form.end >= form.start && (
              <p className="period">予約期間：{formatPeriod(form.start, form.end)}（受取は利用開始日の開室時間以降）</p>
            )}
            {formError && <p className="error" role="alert">{formError}</p>}
            <div className="modal-actions">
              <button type="button" className="btn secondary" onClick={closeModal}>
                戻る
              </button>
              <button type="button" className="btn primary large" onClick={submitReserve}>
                この内容で予約する
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast" role="status" aria-live="polite">
          <span aria-hidden="true">✅</span> {toast.message}
        </div>
      )}
    </div>
  );
}

export default App;
