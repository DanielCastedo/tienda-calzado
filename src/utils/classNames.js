/** Une clases CSS ignorando valores falsy: cn('btn', active && 'is-active') */
export const cn = (...classes) => classes.filter(Boolean).join(' ')
