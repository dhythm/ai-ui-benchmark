import type { Status } from '../types'
import { STATUS_LABEL } from '../types'

type Props = { status: Status }

export function StatusBadge({ status }: Props) {
  return (
    <span className={`badge badge--${status}`}>
      <span className="badge__dot" aria-hidden="true" />
      {STATUS_LABEL[status]}
    </span>
  )
}
