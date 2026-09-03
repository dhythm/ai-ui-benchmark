import { useEffect, useRef, useState, type FormEvent } from 'react'
import { CATEGORY_LABELS, type Equipment } from '../types/equipment'
import { addDays, validateReservation, type ReservationErrors, type ReservationInput } from '../lib/reservation'
import { CloseIcon } from './Icons'

type Props = {
  item: Equipment | null
  today: string
  currentUser: string
  onSubmit: (item: Equipment, input: ReservationInput) => void
  onClose: () => void
}

export function ReserveDialog({ item, today, currentUser, onSubmit, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  // <dialog> の開閉は DOM API に同期させる（外部システムとの同期のみを effect で行う）
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (item && !dialog.open) dialog.showModal()
    if (!item && dialog.open) dialog.close()
  }, [item])

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      aria-labelledby="reserve-dialog-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose()
      }}
    >
      {item && (
        // key で備品ごとにフォーム状態を初期化する
        <ReserveForm key={item.id} item={item} today={today} currentUser={currentUser} onSubmit={onSubmit} onClose={onClose} />
      )}
    </dialog>
  )
}

type FormProps = Omit<Props, 'item'> & { item: Equipment }

function ReserveForm({ item, today, currentUser, onSubmit, onClose }: FormProps) {
  const [input, setInput] = useState<ReservationInput>({ startDate: today, endDate: addDays(today, 1), purpose: '' })
  const [errors, setErrors] = useState<ReservationErrors>({})

  const update = (patch: Partial<ReservationInput>) => {
    setInput((prev) => ({ ...prev, ...patch }))
    setErrors({})
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const nextErrors = validateReservation(input, today)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }
    onSubmit(item, input)
  }

  return (
    <form className="dialog__body" onSubmit={handleSubmit} noValidate>
      <header className="dialog__header">
        <h2 id="reserve-dialog-title" className="dialog__title">備品を予約する</h2>
        <button type="button" className="icon-button" aria-label="閉じる" onClick={onClose}>
          <CloseIcon />
        </button>
      </header>

      <dl className="dialog__summary">
        <div>
          <dt>備品</dt>
          <dd>
            <strong>{item.name}</strong>
            <span className="dialog__sub">{item.assetNo} ・ {item.model}</span>
          </dd>
        </div>
        <div>
          <dt>カテゴリ</dt>
          <dd>{CATEGORY_LABELS[item.category]}</dd>
        </div>
        <div>
          <dt>保管場所</dt>
          <dd>{item.location}</dd>
        </div>
        <div>
          <dt>予約者</dt>
          <dd>{currentUser}</dd>
        </div>
      </dl>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="reserve-start">
            利用開始日 <span className="form-field__required">必須</span>
          </label>
          <input
            id="reserve-start"
            type="date"
            min={today}
            value={input.startDate}
            aria-invalid={Boolean(errors.startDate)}
            aria-describedby={errors.startDate ? 'reserve-start-error' : undefined}
            onChange={(e) => update({ startDate: e.target.value })}
          />
          {errors.startDate && <p id="reserve-start-error" className="form-field__error">{errors.startDate}</p>}
        </div>
        <div className="form-field">
          <label htmlFor="reserve-end">
            返却予定日 <span className="form-field__required">必須</span>
          </label>
          <input
            id="reserve-end"
            type="date"
            min={input.startDate || today}
            value={input.endDate}
            aria-invalid={Boolean(errors.endDate)}
            aria-describedby={errors.endDate ? 'reserve-end-error' : undefined}
            onChange={(e) => update({ endDate: e.target.value })}
          />
          {errors.endDate && <p id="reserve-end-error" className="form-field__error">{errors.endDate}</p>}
        </div>
        <div className="form-field form-field--full">
          <label htmlFor="reserve-purpose">利用目的</label>
          <input
            id="reserve-purpose"
            type="text"
            placeholder="例：〇〇社 訪問時のデモ用"
            maxLength={100}
            value={input.purpose}
            onChange={(e) => update({ purpose: e.target.value })}
          />
        </div>
      </div>

      <p className="dialog__hint">受け取りは保管場所にて、利用開始日の 9:00 以降にお願いします。</p>

      <footer className="dialog__footer">
        <button type="button" className="btn btn--ghost" onClick={onClose}>
          キャンセル
        </button>
        <button type="submit" className="btn btn--primary">
          予約を確定する
        </button>
      </footer>
    </form>
  )
}
