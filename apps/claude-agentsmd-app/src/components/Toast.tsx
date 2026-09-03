import { useEffect } from 'react'

export type ToastMessage = { id: number; text: string }

type Props = {
  toast: ToastMessage | null
  onDismiss: () => void
}

export function Toast({ toast, onDismiss }: Props) {
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(onDismiss, 4000)
    return () => window.clearTimeout(timer)
  }, [toast, onDismiss])

  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast && (
        <div className="toast" key={toast.id}>
          <svg className="toast__icon" viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.15" />
            <path
              d="M6 10.5l2.5 2.5L14 7.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{toast.text}</span>
          <button type="button" className="toast__close" onClick={onDismiss} aria-label="閉じる">
            ×
          </button>
        </div>
      )}
    </div>
  )
}
