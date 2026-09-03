import { useEffect, useMemo, useState } from "react";
import {
  CATEGORIES,
  INITIAL_EQUIPMENT,
  STATUS_META,
  type Equipment,
  type EquipmentCategory,
  type EquipmentStatus,
} from "./data";
import "./App.css";

type StatusFilter = "all" | EquipmentStatus;
type SortKey = "priority" | "name" | "returnDate";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "priority", label: "利用可能を優先" },
  { value: "name", label: "名前順" },
  { value: "returnDate", label: "返却日が近い順" },
];

const STATUS_ORDER: Record<EquipmentStatus, number> = {
  available: 0,
  reserved: 1,
  rented: 2,
  maintenance: 3,
};

function todayInputValue(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function toShortDate(input: string): string {
  const [y, m, d] = input.split("-").map(Number);
  if (!y || !m || !d) return input;
  return `${m}/${d}`;
}

function parseReturnDate(e: Equipment): number {
  const m = e.returnDate?.match(/(\d{1,2})\/(\d{1,2})/);
  if (!m) return Number.MAX_SAFE_INTEGER;
  return Number(m[1]) * 100 + Number(m[2]);
}

function CategoryIcon({ category }: { category: EquipmentCategory }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  } as const;
  switch (category) {
    case "ノートPC":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="4" y="4" width="16" height="11" rx="1.5" />
          <path d="M2.5 19h19" />
        </svg>
      );
    case "モニター":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="3" y="4" width="18" height="12" rx="1.5" />
          <path d="M9 20h6M12 16v4" />
        </svg>
      );
    case "カメラ":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="3" y="7" width="13" height="11" rx="1.5" />
          <path d="M16 10.5l5-2.5v8l-5-2.5M8.5 7l1.5-2h4L15.5 7" />
        </svg>
      );
    case "プロジェクター":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="2.5" y="7" width="13" height="10" rx="1.5" />
          <path d="M15.5 10.5l6-2.5v8l-6-2.5M6 20h6" />
        </svg>
      );
    case "モバイルWi-Fi":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M4 10a12 12 0 0 1 16 0M7 13.5a7.5 7.5 0 0 1 10 0M9.8 16.8a3.2 3.2 0 0 1 4.4 0" />
          <circle cx="12" cy="19.4" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return (
        <svg {...common} aria-hidden="true">
          <path d="M4 13a8 8 0 0 1 16 0" />
          <rect x="3" y="13" width="4" height="7" rx="1.5" />
          <rect x="17" y="13" width="4" height="7" rx="1.5" />
        </svg>
      );
  }
}

function statusSubText(e: Equipment): string {
  if (e.status === "available") return e.nextAvailable === "即日" ? "即日貸出可" : `利用可 ${e.nextAvailable ?? ""}`;
  if (e.status === "maintenance") return e.nextAvailable ? `復旧目安 ${e.nextAvailable}` : "利用不可";
  const who = e.borrower ? `${e.borrower} ` : "";
  const when = e.returnDate ? `／ ${e.returnDate}` : "";
  return `${who}${when}`.trim() || "—";
}

export default function App() {
  const [items, setItems] = useState<Equipment[]>(INITIAL_EQUIPMENT);
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<EquipmentCategory[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [placeFilter, setPlaceFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("priority");
  const [myReservations, setMyReservations] = useState<string[]>([]);
  const [modalTarget, setModalTarget] = useState<Equipment | null>(null);
  const [startDate, setStartDate] = useState(todayInputValue());
  const [endDate, setEndDate] = useState(todayInputValue());
  const [purpose, setPurpose] = useState("会議・打ち合わせ");
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!modalTarget) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") setModalTarget(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalTarget]);

  const places = useMemo(
    () => Array.from(new Set(items.map((i) => i.location))).sort(),
    [items],
  );

  const counts = useMemo(() => {
    const c: Record<EquipmentStatus, number> = {
      available: 0,
      rented: 0,
      reserved: 0,
      maintenance: 0,
    };
    for (const i of items) c[i.status] += 1;
    return c;
  }, [items]);

  const categoryCounts = useMemo(() => {
    const map = new Map<EquipmentCategory, number>();
    for (const i of items) map.set(i.category, (map.get(i.category) ?? 0) + 1);
    return map;
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = items.filter((i) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(i.category)) return false;
      if (statusFilter !== "all" && i.status !== statusFilter) return false;
      if (placeFilter !== "all" && i.location !== placeFilter) return false;
      if (q) {
        const hay = `${i.name} ${i.id} ${i.spec} ${i.location}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    const sorted = [...list];
    if (sortKey === "name") sorted.sort((a, b) => a.name.localeCompare(b.name, "ja"));
    else if (sortKey === "returnDate") sorted.sort((a, b) => parseReturnDate(a) - parseReturnDate(b));
    else sorted.sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || a.name.localeCompare(b.name, "ja"));
    return sorted;
  }, [items, query, selectedCategories, statusFilter, placeFilter, sortKey]);

  const hasFilter =
    query.trim() !== "" ||
    selectedCategories.length > 0 ||
    statusFilter !== "all" ||
    placeFilter !== "all";

  function toggleCategory(c: EquipmentCategory) {
    setSelectedCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  }

  function resetFilters() {
    setQuery("");
    setSelectedCategories([]);
    setStatusFilter("all");
    setPlaceFilter("all");
  }

  function openModal(e: Equipment) {
    const t = todayInputValue();
    setStartDate(t);
    setEndDate(t);
    setPurpose("会議・打ち合わせ");
    setFormError("");
    setModalTarget(e);
  }

  function confirmReservation() {
    if (!modalTarget) return;
    if (!startDate || !endDate) {
      setFormError("利用開始日と返却予定日を入力してください。");
      return;
    }
    if (startDate > endDate) {
      setFormError("返却予定日は利用開始日以降の日付を指定してください。");
      return;
    }
    const range =
      startDate === endDate
        ? toShortDate(startDate)
        : `${toShortDate(startDate)}〜${toShortDate(endDate)}`;
    setItems((prev) =>
      prev.map((i) =>
        i.id === modalTarget.id
          ? { ...i, status: "reserved", borrower: "自分", returnDate: `${range} 予約` }
          : i,
      ),
    );
    setMyReservations((prev) => [...prev, modalTarget.id]);
    setModalTarget(null);
    setToast(`${modalTarget.name}（${modalTarget.id}）を予約しました。${range} の利用です。`);
  }

  function cancelReservation(id: string) {
    const target = items.find((i) => i.id === id);
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: "available", borrower: undefined, returnDate: undefined, nextAvailable: "即日" }
          : i,
      ),
    );
    setMyReservations((prev) => prev.filter((x) => x !== id));
    setToast(`${target?.name ?? id} の予約を取り消しました。`);
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">備</span>
            <div>
              <p className="brand-title">社内備品予約</p>
              <p className="brand-sub">東京本社・大阪支社 共通</p>
            </div>
          </div>
          <nav className="topnav" aria-label="ページ">
            <span className="topnav-current">備品一覧</span>
          </nav>
          <div className="userbox">
            <span className="mycount" title="自分が予約中の件数">
              自分の予約 <strong>{myReservations.length}</strong> 件
            </span>
            <span className="avatar" aria-hidden="true">山</span>
            <span className="username">開発部・山田</span>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="pagehead">
          <div>
            <h1>備品一覧</h1>
            <p className="lede">利用したい備品を探して、その場で予約できます。貸出中の備品は返却予定日を確認してください。</p>
          </div>
          <dl className="stats">
            <div className="stat stat-available">
              <dt>利用可能</dt>
              <dd>{counts.available}</dd>
            </div>
            <div className="stat">
              <dt>貸出中</dt>
              <dd>{counts.rented}</dd>
            </div>
            <div className="stat">
              <dt>予約中</dt>
              <dd>{counts.reserved}</dd>
            </div>
            <div className="stat">
              <dt>点検中</dt>
              <dd>{counts.maintenance}</dd>
            </div>
          </dl>
        </div>

        <div className="layout">
          <aside className="filters" aria-label="検索・絞り込み">
            <div className="filter-block">
              <label className="filter-label" htmlFor="search">備品名・型番で検索</label>
              <div className="searchbox">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>
                <input
                  id="search"
                  type="search"
                  placeholder="例）MacBook、4K、EQ-014"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                  <button type="button" className="clear" onClick={() => setQuery("")} aria-label="検索をクリア">×</button>
                )}
              </div>
            </div>

            <div className="filter-block">
              <p className="filter-label" id="cat-label">カテゴリ</p>
              <ul className="checklist" aria-labelledby="cat-label">
                {CATEGORIES.map((c) => (
                  <li key={c}>
                    <label className="check">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(c)}
                        onChange={() => toggleCategory(c)}
                      />
                      <span className="check-text">{c}</span>
                      <span className="count">{categoryCounts.get(c) ?? 0}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-block">
              <p className="filter-label" id="status-label">利用状況</p>
              <div className="radiolist" role="radiogroup" aria-labelledby="status-label">
                {(
                  [
                    ["all", "すべて"],
                    ["available", STATUS_META.available.label],
                    ["rented", STATUS_META.rented.label],
                    ["reserved", STATUS_META.reserved.label],
                    ["maintenance", STATUS_META.maintenance.label],
                  ] as [StatusFilter, string][]
                ).map(([v, label]) => (
                  <label key={v} className="radio">
                    <input
                      type="radio"
                      name="status"
                      checked={statusFilter === v}
                      onChange={() => setStatusFilter(v)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-block">
              <label className="filter-label" htmlFor="place">保管場所</label>
              <select
                id="place"
                value={placeFilter}
                onChange={(e) => setPlaceFilter(e.target.value)}
              >
                <option value="all">すべての場所</option>
                {places.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <button type="button" className="reset" onClick={resetFilters} disabled={!hasFilter}>
              条件をリセット
            </button>
          </aside>

          <section className="results" aria-live="polite">
            <div className="toolbar">
              <p className="hitcount">
                <strong>{filtered.length}</strong> 件
                <span className="hit-sub">／ 全{items.length}件</span>
              </p>
              <label className="sort">
                並び替え
                <select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}>
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>
            </div>

            {filtered.length === 0 ? (
              <div className="empty">
                <p className="empty-title">条件に合う備品が見つかりません</p>
                <p className="empty-text">検索キーワードや絞り込み条件を変更してください。</p>
                <button type="button" className="reset" onClick={resetFilters}>条件をリセット</button>
              </div>
            ) : (
              <div className="tablewrap">
                <table className="eqtable">
                  <thead>
                    <tr>
                      <th scope="col">備品</th>
                      <th scope="col">カテゴリ</th>
                      <th scope="col">保管場所</th>
                      <th scope="col">利用状況</th>
                      <th scope="col"><span className="sr">操作</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((e) => {
                      const mine = myReservations.includes(e.id);
                      return (
                        <tr key={e.id}>
                          <td className="cell-main">
                            <span className={`thumb thumb-${e.status}`} aria-hidden="true">
                              <CategoryIcon category={e.category} />
                            </span>
                            <span className="main-text">
                              <span className="eqname">{e.name}</span>
                              <span className="eqmeta">{e.id}・{e.spec}</span>
                              {e.note && <span className="eqnote">{e.note}</span>}
                            </span>
                          </td>
                          <td><span className="catpill">{e.category}</span></td>
                          <td className="cell-place">{e.location}</td>
                          <td>
                            <span className={`badge badge-${e.status}`}>{STATUS_META[e.status].label}</span>
                            <span className="substatus">{statusSubText(e)}</span>
                          </td>
                          <td className="cell-action">
                            {e.status === "available" && (
                              <button type="button" className="btn-primary" onClick={() => openModal(e)}>
                                予約する
                              </button>
                            )}
                            {e.status !== "available" && mine && (
                              <button type="button" className="btn-ghost" onClick={() => cancelReservation(e.id)}>
                                取消する
                              </button>
                            )}
                            {e.status !== "available" && !mine && (
                              <span className="unavailable">
                                {e.status === "maintenance" ? "予約不可" : "予約不可"}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>

      {modalTarget && (
        <div className="overlay" onClick={() => setModalTarget(null)}>
          <div
            className="dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dialog-head">
              <div>
                <p className="dialog-kicker">{modalTarget.id}・{modalTarget.category}</p>
                <h2 id="dialog-title">{modalTarget.name}</h2>
              </div>
              <button type="button" className="iconbtn" onClick={() => setModalTarget(null)} aria-label="閉じる">×</button>
            </div>
            <p className="dialog-meta">{modalTarget.spec}／{modalTarget.location}</p>
            <div className="dialog-grid">
              <label>
                利用開始日
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </label>
              <label>
                返却予定日
                <input type="date" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)} />
              </label>
            </div>
            <label className="dialog-purpose">
              用途
              <select value={purpose} onChange={(e) => setPurpose(e.target.value)}>
                <option>会議・打ち合わせ</option>
                <option>出張</option>
                <option>イベント・撮影</option>
                <option>テレワーク</option>
                <option>その他</option>
              </select>
            </label>
            {formError && <p className="form-error" role="alert">{formError}</p>}
            <div className="dialog-actions">
              <button type="button" className="btn-ghost" onClick={() => setModalTarget(null)}>戻る</button>
              <button type="button" className="btn-primary" onClick={confirmReservation}>
                {purpose}で予約を確定する
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast" role="status">
          <span className="toast-check" aria-hidden="true">✓</span>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
