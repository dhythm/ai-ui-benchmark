import { STATUS_LABELS, type EquipmentStatus } from '../types/equipment'

export function StatusBadge({ status }: { status: EquipmentStatus }) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      <span className="status-badge__dot" aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  )
}
