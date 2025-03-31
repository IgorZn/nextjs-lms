import React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'
import { AlertTriangle, CheckCircleIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const bannerVariants = cva('border text-center p-4 text-sm flex items-center w-full', {
  variants: {
    variant: {
      default: 'border-slate-200 bg-slate-50 text-slate-900',
      warning: 'bg-yellow-200/80 border-yellow-30 bg-amber-100 text-primary',
      success: 'bg-green-200/80 border-emerald-800 bg-emerald-100 text-secondary',
    },
    defaultVariants: {
      variant: 'warning',
    },
  },
})

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircleIcon,
}

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string
}

function Banner({ label, variant }: BannerProps) {
  const Icon = iconMap[variant || 'warning']
  return (
    <div className={cn(bannerVariants({ variant }))}>
      <Icon className={'mr-2 h-4 w-4'} />
      {label}
    </div>
  )
}

export default Banner
