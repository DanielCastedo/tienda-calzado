/* Set de íconos SVG de la marca. Uso: <Icon name="heart" /> */

const ICONS = {
  heart: <path d="M12 20s-7-4.4-7-9.5A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.5C19 15.6 12 20 12 20Z" />,
  search: (
    <>
      <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="m13.5 13.5 7 7" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </>
  ),
  arrow: <path d="M5 11h10.6l-4.3-4.3 1.4-1.4L19.4 12l-6.7 6.7-1.4-1.4 4.3-4.3H5z" />,
  whatsapp: (
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.5 14.1c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5-4.5-.2-.2-1.2-1.6-1.2-3s.8-2.2 1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .7.5l.9 2.2c.1.2.1.4 0 .5l-.3.5-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.3.1.2.1.7-.1 1.3Z" />
  ),
  phone: <path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z" />,
  mail: <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm9 7.2L4 7.3V17h16V7.3zM5.2 7 12 11.1 18.8 7z" />,
  pin: <path d="M12 2a7 7 0 0 1 7 7c0 5.2-7 13-7 13S5 14.2 5 9a7 7 0 0 1 7-7Zm0 4.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />,
  clock: <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 3v4.6l3.2 3.2-1.4 1.4L11 12.4V7z" />,
  trash: <path d="M9 3h6l1 2h4v2H4V5h4zm-3 6h12l-1 12H7z" />,
  plus: <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z" />,
  minus: <path d="M5 11h14v2H5z" />,
  check: <path d="m9.5 16.2-4.2-4.2-1.4 1.4 5.6 5.6L21 7.5l-1.4-1.4z" />,
  bag: <path d="M7 7V6a5 5 0 0 1 10 0v1h3l1 14H3L4 7zm2 0h6V6a3 3 0 0 0-6 0z" />,
  // Valores / características
  calidad: <path d="m12 2 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 16.9 6.1 20l1.2-6.5L2.5 8.9 9.1 8z" />,
  artesania: <path d="M14.7 3.3a1 1 0 0 1 1.4 0l4.6 4.6a1 1 0 0 1 0 1.4L10 20H5v-5zM6.5 15.9V18h2.1l8.5-8.5-2.1-2.1z" />,
  familia: <path d="M8 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm8 1a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM2 19c0-3.3 2.7-6 6-6s6 2.7 6 6v1H2zm13.5 1v-1c0-1.9-.7-3.6-1.8-4.9A5 5 0 0 1 22 18.5V20z" />,
  cliente: <path d="M12 21 3.5 12.6A5 5 0 0 1 12 6.1a5 5 0 0 1 8.5 6.5zM12 9.6 10.2 8a3 3 0 0 0-4.3 4.2L12 18.2l6.1-6a3 3 0 0 0-4.3-4.2z" />,
  envio: <path d="M2 5h12v3h4l4 4.5V17h-2a3 3 0 0 1-6 0H9a3 3 0 0 1-6 0H2zm3 11a1 1 0 1 0 2 0 1 1 0 0 0-2 0Zm11 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0Zm-2-6v3h6l-2.6-3z" />,
  reparacion: <path d="M21.7 18.6 13 9.9a5.5 5.5 0 0 0-7.2-7.1l3.6 3.6-2.6 2.6-3.6-3.6A5.5 5.5 0 0 0 10.4 12.5l8.7 8.7a1.8 1.8 0 0 0 2.6-2.6Z" />,
}

export function Icon({ name, size = 24, className, title }) {
  const content = ICONS[name]
  if (!content) return null

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {content}
    </svg>
  )
}
