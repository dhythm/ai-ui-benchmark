import { useEffect } from 'react'
import { CheckIcon } from './Icons'

export type ToastMessage = { id: number; text: string }

type Props = { toast: ToastMessage | null; onDismiss: (id: number) => void }

export function Toast({ toast, onDismiss }: Props) {
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => onDismiss(toast.id), 4000)
    return () => window.clearTimeout(timer)
  }, [toast, onDismiss])

  return (
    <div className="toast-region" aria-live="polite">
      {toast && (
        <div className="toast" key={toast.id}>
          <CheckIcon className="toast__icon" />
          <span>{toast.text}</span>
        </div>
      )}
    </div>
  )
}
