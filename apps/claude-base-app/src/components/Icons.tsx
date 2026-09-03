import type { EquipmentCategory } from '../types/equipment'

type IconProps = { size?: number; className?: string }

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
})

export function SearchIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

export function CloseIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

export function CheckIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  )
}

export function CategoryIcon({ category, size = 20, className }: IconProps & { category: EquipmentCategory }) {
  const p = { ...base(size), className }
  switch (category) {
    case 'laptop':
      return (
        <svg {...p}>
          <rect x="4" y="5" width="16" height="11" rx="1.5" />
          <path d="M2 19h20" />
        </svg>
      )
    case 'monitor':
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="12" rx="1.5" />
          <path d="M12 16v4M8 20h8" />
        </svg>
      )
    case 'camera':
      return (
        <svg {...p}>
          <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
          <circle cx="12" cy="13" r="3.5" />
        </svg>
      )
    case 'projector':
      return (
        <svg {...p}>
          <rect x="3" y="8" width="18" height="9" rx="1.5" />
          <circle cx="15" cy="12.5" r="2.5" />
          <path d="M7 12.5h3M7 17v2M17 17v2" />
        </svg>
      )
    case 'mobile-wifi':
      return (
        <svg {...p}>
          <path d="M5 11a10 10 0 0 1 14 0M8 14a6 6 0 0 1 8 0" />
          <circle cx="12" cy="17.5" r="1.25" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'peripheral':
      return (
        <svg {...p}>
          <path d="M9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4" />
          <rect x="7" y="7" width="10" height="10" rx="1.5" />
        </svg>
      )
  }
}
