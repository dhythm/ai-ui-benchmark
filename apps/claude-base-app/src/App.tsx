import { useCallback, useMemo, useState } from 'react'
import { CATEGORY_ORDER, type Equipment, type EquipmentCategory } from './types/equipment'
import { CURRENT_USER, EQUIPMENT, TODAY } from './data/equipment'
import { countByStatus, filterEquipment, type CategoryFilter, type StatusFilter } from './lib/filterEquipment'
import { applyReservation, cancelReservation, type ReservationInput } from './lib/reservation'
import { formatDate, formatLongDate } from './lib/format'
import { CategoryNav } from './components/CategoryNav'
import { FilterBar } from './components/FilterBar'
import { EquipmentTable } from './components/EquipmentTable'
import { ReserveDialog } from './components/ReserveDialog'
import { Toast, type ToastMessage } from './components/Toast'
import './App.css'

function App() {
  const [items, setItems] = useState<Equipment[]>(EQUIPMENT)
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [reserving, setReserving] = useState<Equipment | null>(null)
  const [toast, setToast] = useState<ToastMessage | null>(null)

  const categoryCounts = useMemo(() => {
    const counts = Object.fromEntries(CATEGORY_ORDER.map((c) => [c, 0])) as Record<EquipmentCategory, number>
    for (const item of items) counts[item.category] += 1
    return counts
  }, [items])

  // 利用状況の件数は、検索・カテゴリ絞り込み後の母集団で数える
  const scoped = useMemo(() => filterEquipment(items, { keyword, category, status: 'all' }), [items, keyword, category])
  const statusCounts = useMemo(() => countByStatus(scoped), [scoped])
  const visible = useMemo(() => filterEquipment(scoped, { keyword: '', category: 'all', status }), [scoped, status])

  const showToast = (text: string) => setToast({ id: Date.now(), text })
  const dismissToast = useCallback((id: number) => setToast((t) => (t?.id === id ? null : t)), [])

  const handleReserve = (item: Equipment, input: ReservationInput) => {
    setItems((prev) => applyReservation(prev, { equipmentId: item.id, ...input }, CURRENT_USER))
    setReserving(null)
    showToast(`「${item.name}」を予約しました（${formatDate(input.startDate)} 〜 ${formatDate(input.endDate)}）`)
  }

  const handleCancel = (item: Equipment) => {
    if (!window.confirm(`「${item.name}」の予約を取り消しますか？`)) return
    setItems((prev) => cancelReservation(prev, item.id))
    showToast(`「${item.name}」の予約を取り消しました`)
  }

  const resetFilters = () => {
    setKeyword('')
    setCategory('all')
    setStatus('all')
  }

  const isFiltered = keyword !== '' || category !== 'all' || status !== 'all'

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-header__brand">
            <span className="app-header__mark" aria-hidden="true" />
            <span className="app-header__name">備品予約</span>
          </div>
          <div className="app-header__user">{CURRENT_USER}</div>
        </div>
      </header>

      <main className="page">
        <div className="page__head">
          <div>
            <h1 className="page__title">備品一覧</h1>
            <p className="page__lead">利用可能な備品を検索して、その場で予約できます。</p>
          </div>
          <p className="page__date">
            <span className="page__date-label">本日</span>
            {formatLongDate(TODAY)}
          </p>
        </div>

        <div className="page__layout">
          <aside className="page__side">
            <CategoryNav value={category} counts={categoryCounts} total={items.length} onChange={setCategory} />
          </aside>

          <section className="page__main" aria-label="備品一覧">
            <FilterBar
              keyword={keyword}
              status={status}
              statusCounts={statusCounts}
              total={scoped.length}
              onKeywordChange={setKeyword}
              onStatusChange={setStatus}
            />

            <div className="result-bar">
              <p className="result-bar__count" aria-live="polite">
                <strong>{visible.length}</strong> 件
                {isFiltered && <span className="result-bar__total">（全 {items.length} 件中）</span>}
              </p>
              {isFiltered && (
                <button type="button" className="link-button" onClick={resetFilters}>
                  条件をクリア
                </button>
              )}
            </div>

            <EquipmentTable
              items={visible}
              currentUser={CURRENT_USER}
              today={TODAY}
              onReserve={setReserving}
              onCancel={handleCancel}
              onReset={resetFilters}
            />
          </section>
        </div>
      </main>

      <ReserveDialog item={reserving} today={TODAY} currentUser={CURRENT_USER} onSubmit={handleReserve} onClose={() => setReserving(null)} />
      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  )
}

export default App
