import { LucideIcon } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const backgroundVariants = cva('rounded-full flex items-center justify-center', {
  variants: {
    variant: {
      default: 'bg-sky-100 dark:bg-slate-800',
      success: 'bg-emerald-100 dark:bg-emerald-800',
      warning: 'bg-amber-100 dark:bg-amber-800',
      danger: 'bg-rose-100 dark:bg-rose-800',
    },
    iconVariant: {
      default: 'text-sky-700 dark:text-slate-400',
      success: 'text-emerald-600 dark:text-emerald-400',
      warning: 'text-amber-600 dark:text-amber-400',
      danger: 'text-rose-600 dark:text-rose-400',
    },
    size: {
      default: 'p-2',
      sm: 'p-1',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

const iconVariants = cva('', {
  variants: {
    variant: {
      default: 'text-sky-700 dark:text-slate-400',
      success: 'text-emerald-600 dark:text-emerald-400',
      warning: 'text-amber-600 dark:text-amber-400',
      danger: 'text-rose-600 dark:text-rose-400',
    },
    size: {
      default: 'h-8 w-8',
      sm: 'h-4  w-4 ',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

type BackgroundVariantsProps = VariantProps<typeof backgroundVariants>
type IconVariantsProps = VariantProps<typeof iconVariants>

interface IconBadgeProps extends BackgroundVariantsProps, IconVariantsProps {
  icon: LucideIcon
}

export const IconBadge = ({ icon: Icon, variant, size }: IconBadgeProps) => {
  return (
    <div className={cn(backgroundVariants({ variant, size }))}>
      <Icon className={cn(iconVariants({ variant, size }))} />
    </div>
  )
}
