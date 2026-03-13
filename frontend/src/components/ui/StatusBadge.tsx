import { STATUS_LABELS, STATUS_COLORS } from '@/types'
import type { StatusProcesso } from '@/types'
import { cn } from '@/utils/cn'

interface StatusBadgeProps {
  status: StatusProcesso
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        STATUS_COLORS[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
