import { useCallback, useEffect, useState } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Estado del slider vertical del hero.
 * El autoplay se reinicia tras cada cambio manual y se pausa con `setPaused(true)`.
 */
export function useHeroSlider({ count, initialIndex = 0, autoplayMs = 0 }) {
  const [index, setIndex] = useState(initialIndex)
  const [paused, setPaused] = useState(false)

  const goTo = useCallback((i) => setIndex(((i % count) + count) % count), [count])
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count])
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count])

  useEffect(() => {
    if (!autoplayMs || paused || prefersReducedMotion()) return undefined
    const timer = setTimeout(next, autoplayMs)
    return () => clearTimeout(timer)
  }, [index, paused, autoplayMs, next])

  return { index, goTo, next, prev, setPaused }
}
