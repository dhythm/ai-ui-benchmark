import { useEffect, useRef, useState } from 'react'
import type { Equipment, ReservationInput } from '../types'
import { MAX_RENTAL_DAYS, validateReservation } from '../lib/reservation'
import type { ReservationErrors } from '../lib/reservation'

type Props = {
  item: Equipment | null
  today: string
  requester: { user: string; department: string }
  onSubmit: (item: Equipment, input: ReservationInput) => void
  onClose: () => void
}

export function ReserveDialog({ item, today, requester, onSubmit, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (item && !dialog.open) {
      dialog.showModal()
    } else if (!item && dialog.open) {
      dialog.close()
    }
  }, [item])

  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby="reserve-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
    >
      {item && (
        <ReserveForm
          key={item.id}
          item={item}
          today={today}
          requester={requester}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      )}
    </dialog>
  )
}

type FormProps = Omit<Props, 'item'> & { item: Equipment }

function ReserveForm({ item, today, requester, onSubmit, onClose }: FormProps) {
  const [input, setInput] = useState<ReservationInput>({
    from: today,
    until: today,
    purpose: '',
  })
  const [errors, setErrors] = useState<ReservationErrors>({})

  const update = (patch: Partial<ReservationInput>) => {
    setInput((prev) => ({ ...prev, ...patch }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const next = validateReservation(input, today)
    setErrors(next)
    if (Object.keys(next).length === 0) {
      onSubmit(item, input)
    }
  }

  return (
    <form className="dialog__body" onSubmit={handleSubmit} noValidate>
      <header className="dialog__header">
        <h2 id="reserve-title" className="dialog__title">
          備品を予約
        </h2>
        <button type="button" className="dialog__close" onClick={onClose} aria-label="閉じる">
          ×
        </button>
      </header>

      <dl className="summary">
        <div className="summary__row">
          <dt>備品</dt>
          <dd>
            <span className="summary__name">{item.name}</span>
            <span className="summary__meta">
              {item.assetTag} ・ {item.location}
            </span>
          </dd>
        </div>
        <div className="summary__row">
          <dt>予約者</dt>
          <dd>
            {requester.user}（{requester.department}）
          </dd>
        </div>
      </dl>

      <div className="field-grid">
        <div className={`field${errors.from ? ' field--error' : ''}`}>
          <label htmlFor="reserve-from">利用開始日</label>
          <input
            id="reserve-from"
            type="date"
            min={today}
            value={input.from}
            onChange={(e) => update({ from: e.target.value })}
            aria-invalid={Boolean(errors.from)}
            aria-describedby={errors.from ? 'reserve-from-error' : undefined}
          />
          {errors.from && (
            <p id="reserve-from-error" className="field__error">
              {errors.from}
            </p>
          )}
        </div>
        <div className={`field${errors.until ? ' field--error' : ''}`}>
          <label htmlFor="reserve-until">返却予定日</label>
          <input
            id="reserve-until"
            type="date"
            min={input.from || today}
            value={input.until}
            onChange={(e) => update({ until: e.target.value })}
            aria-invalid={Boolean(errors.until)}
            aria-describedby={errors.until ? 'reserve-until-error' : 'reserve-until-hint'}
          />
          {errors.until ? (
            <p id="reserve-until-error" className="field__error">
              {errors.until}
            </p>
          ) : (
            <p id="reserve-until-hint" className="field__hint">
              最長 {MAX_RENTAL_DAYS} 日
            </p>
          )}
        </div>
      </div>

      <div className={`field${errors.purpose ? ' field--error' : ''}`}>
        <label htmlFor="reserve-purpose">利用目的</label>
        <input
          id="reserve-purpose"
          type="text"
          placeholder="例：9/10 客先デモで使用"
          maxLength={100}
          value={input.purpose}
          onChange={(e) => update({ purpose: e.target.value })}
          aria-invalid={Boolean(errors.purpose)}
          aria-describedby={errors.purpose ? 'reserve-purpose-error' : undefined}
        />
        {errors.purpose && (
          <p id="reserve-purpose-error" className="field__error">
            {errors.purpose}
          </p>
        )}
      </div>

      <footer className="dialog__footer">
        <button type="button" className="btn" onClick={onClose}>
          キャンセル
        </button>
        <button type="submit" className="btn btn--primary">
          予約を確定
        </button>
      </footer>
    </form>
  )
}
