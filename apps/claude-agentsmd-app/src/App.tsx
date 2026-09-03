import { useCallback, useMemo, useState } from 'react'
import { EquipmentTable } from './components/EquipmentTable'
import { FilterBar } from './components/FilterBar'
import { ReserveDialog } from './components/ReserveDialog'
import { Toast } from './components/Toast'
import type { ToastMessage } from './components/Toast'
import { CURRENT_USER, EQUIPMENT } from './data/equipment'
import { countByStatus, filterEquipment } from './lib/filter'
import { applyReservation, toDateString } from './lib/reservation'
import type { Equipment, Filters, ReservationInput, Status } from './types'
import { STATUS_LABEL, STATUS_ORDER } from './types'
import './App.css'

const INITIAL_FILTERS: Filters = { keyword: '', category: 'all', status: 'all' }

function App() {
  const [items, setItems] = useState<Equipment[]>(EQUIPMENT)
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS)
  const [reserving, setReserving] = useState<Equipment | null>(null)
  const [toast, setToast] = useState<ToastMessage | null>(null)

  const today = useMemo(() => toDateString(new Date()), [])
  const visible = useMemo(() => filterEquipment(items, filters), [items, filters])
  const counts = useMemo(() => countByStatus(items), [items])

  const toggleStatus = (status: Status) => {
    setFilters((prev) => ({ ...prev, status: prev.status === status ? 'all' : status }))
  }

  const handleReserve = (item: Equipment, input: ReservationInput) => {
    setItems((prev) => applyReservation(prev, item.id, input, CURRENT_USER))
    setReserving(null)
    setToast({ id: Date.now(), text: `「${item.name}」を予約しました` })
  }

  const dismissToast = useCallback(() => setToast(null), [])

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="brand">
            <span className="brand__mark" aria-hidden="true" />
            <span className="brand__name">備品予約</span>
          </div>
          <div className="user">
            <span className="user__name">{CURRENT_USER.user}</span>
            <span className="user__dept">{CURRENT_USER.department}</span>
          </div>
        </div>
      </header>

      <main className="page">
        <div className="page__head">
          <h1 className="page__title">備品一覧</h1>
          <p className="page__lead">
            社内で共有している備品の利用状況を確認し、利用可能なものはこのページから予約できます。
          </p>
        </div>

        <section className="stats" aria-label="利用状況の内訳">
          {STATUS_ORDER.map((status) => (
            <button
              key={status}
              type="button"
              className={`stat stat--${status}${filters.status === status ? ' stat--active' : ''}`}
              aria-pressed={filters.status === status}
              onClick={() => toggleStatus(status)}
            >
              <span className="stat__label">{STATUS_LABEL[status]}</span>
              <span className="stat__value">
                {counts[status]}
                <span className="stat__unit">件</span>
              </span>
            </button>
          ))}
        </section>

        <section className="list" aria-label="備品一覧">
          <FilterBar
            filters={filters}
            onChange={setFilters}
            resultCount={visible.length}
            totalCount={items.length}
          />
          <EquipmentTable items={visible} onReserve={setReserving} />
        </section>
      </main>

      <ReserveDialog
        item={reserving}
        today={today}
        requester={CURRENT_USER}
        onSubmit={handleReserve}
        onClose={() => setReserving(null)}
      />
      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  )
}

export default App
