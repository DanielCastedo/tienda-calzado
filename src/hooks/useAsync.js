import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Ejecuta una función asíncrona y expone { data, error, isLoading, execute }.
 * - immediate: true  -> se ejecuta automáticamente al montar el componente.
 * - immediate: false -> se ejecuta manualmente llamando a `execute(...args)`.
 */
export function useAsync(asyncFn, { immediate = true } = {}) {
  const [state, setState] = useState({ data: null, error: null, isLoading: immediate })
  const fnRef = useRef(asyncFn)
  const requestIdRef = useRef(0)

  useEffect(() => {
    fnRef.current = asyncFn
  }, [asyncFn])

  /** Lanza la petición y solo aplica el resultado si sigue siendo la más reciente. */
  const run = useCallback((args) => {
    const requestId = ++requestIdRef.current
    const isCurrent = () => requestId === requestIdRef.current

    return Promise.resolve()
      .then(() => fnRef.current(...args))
      .then(
        (data) => {
          if (isCurrent()) setState({ data, error: null, isLoading: false })
          return data
        },
        (error) => {
          if (isCurrent()) setState({ data: null, error, isLoading: false })
          throw error
        },
      )
  }, [])

  const execute = useCallback(
    (...args) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))
      return run(args)
    },
    [run],
  )

  useEffect(() => {
    if (!immediate) return undefined
    const requestCounter = requestIdRef
    run([]).catch(() => {})
    // Invalida la petición en curso si el componente se desmonta.
    return () => {
      requestCounter.current++
    }
  }, [immediate, run])

  return { ...state, execute }
}
