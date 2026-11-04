import { cn } from '@/utils'
import './Badge.css'

/** Etiqueta de estado. tone: neutral | success | warning | danger | info | primary */
export function Badge({ tone = 'neutral', children, className }) {
  return <span className={cn('badge', `badge--${tone}`, className)}>{children}</span>
}
