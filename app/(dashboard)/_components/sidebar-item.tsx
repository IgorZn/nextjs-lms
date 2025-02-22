import React from 'react'
import { LucideIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface SidebarItemProps {
  icon: LucideIcon
  label: string
  href: string
}

/**
 * isActive
 *
 * Проверяет, выполняются ли определенные условия для текущего пути и переданного значения href.
 *
 * @param {string} pathname - Текущий путь приложения.
 * @param {string} href - Значение для проверки.
 *
 * @returns {boolean} - Возвращает true в следующих случаях:
 * - Если и pathname, и href находятся на корневом пути ('/'), что определяет, что мы на главной странице.
 * - Если текущий путь (pathname) совпадает с переданным значением href, что используется для определения активного пути.
 * - Если текущий путь (pathname) начинается с переданного значения href, за которым следует '/', что полезно для вложенных путей.
 *
 * Оператор опциональной цепочки (?.) используется для безопасного вызова метода startsWith. Если pathname равен null или undefined,
 * код не вызовет ошибку, а просто вернет false.
 */
function SidebarItem({ icon: Icon, label, href }: SidebarItemProps) {
  const pathname = usePathname()
  const router = useRouter()
  const onClick = () => {
    router.push(href)
  }

  const isActive = (pathname === '/' && href === '/') || pathname === href || pathname?.startsWith(`${href}/`)

  return (
    <button
      onClick={onClick}
      type={'button'}
      className={cn(
        'flex w-full items-center gap-x-2 pl-6 text-sm font-[500] text-slate-500 transition-all hover:bg-slate-300/20 hover:text-slate-600',
        isActive && 'bg-sky-200/20 text-sky-700 hover:bg-sky-200/20 hover:text-sky-700'
      )}>
      <div className={'flex items-center gap-x-2 py-4'}>
        <Icon size={22} className={cn('text-slate-500', isActive && 'text-sky-700')} />
        {label}
      </div>
      <div
        className={cn(
          'ml-auto h-14 rounded-full border-2 border-orange-600 opacity-0 transition-all',
          isActive && 'opacity-100'
        )}
      />
    </button>
  )
}

export default SidebarItem
