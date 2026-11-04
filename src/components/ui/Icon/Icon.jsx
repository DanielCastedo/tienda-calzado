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
  // Panel administrativo
  alert: <path d="M12 2 1 21h22zm-1 7h2v6h-2zm0 8h2v2h-2z" />,
  info: <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm-1 8v7h2v-7zm0-3v2h2V7z" />,
  edit: <path d="M3 17.2V21h3.8L17.8 10 14 6.2zM20.7 7a1 1 0 0 0 0-1.4l-2.3-2.3a1 1 0 0 0-1.4 0l-1.8 1.8L19 8.8z" />,
  eye: <path d="M12 5c5 0 9 4.5 10 7-1 2.5-5 7-10 7S3 14.5 2 12c1-2.5 5-7 10-7Zm0 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z" />,
  power: <path d="M11 2h2v10h-2zm-4.2 3.3 1.4 1.4A6.5 6.5 0 1 0 18.5 12a6.5 6.5 0 0 0-2.7-5.3l1.4-1.4A8.5 8.5 0 1 1 6.8 5.3Z" />,
  download: <path d="M11 3h2v9.2l3.3-3.3 1.4 1.4L12 16l-5.7-5.7 1.4-1.4 3.3 3.3zM4 18h16v2H4z" />,
  printer: <path d="M6 2h12v5H6zM4 8h16a2 2 0 0 1 2 2v7h-4v5H6v-5H2v-7a2 2 0 0 1 2-2Zm4 9v3h8v-5H8zm10-6.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />,
  logout: <path d="M10 3h9a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-9v-2h9V5h-9zm-.6 4.6L11 9l-2 2h8v2H9l2 2-1.6 1.4L5 12z" />,
  dashboard: <path d="M3 3h8v10H3zm10 0h8v6h-8zM3 15h8v6H3zm10-4h8v10h-8z" />,
  box: <path d="m12 2 9 4.5v11L12 22l-9-4.5v-11zm0 2.2L5.4 7.5 12 10.8l6.6-3.3zM5 9.1v7.2l6 3V12.1zm14 0-6 3v7.2l6-3z" />,
  layers: <path d="m12 2 10 5-10 5L2 7zm-7.8 8.9L12 15l7.8-4.1L22 12l-10 5-10-5zm0 5L12 20l7.8-4.1L22 17l-10 5-10-5z" />,
  factory: <path d="M2 21V9l6 4V9l6 4V3h4l2 18zm5-5v2h2v-2zm4 0v2h2v-2zm4 0v2h2v-2z" />,
  warehouse: <path d="M12 2 2 7v14h4v-9h12v9h4V7zM8 14v2h8v-2zm0 4v3h8v-3z" />,
  cart: <path d="M7 18a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm10 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM1 2h3.3l.9 2H21l-3.6 8.4a2 2 0 0 1-1.8 1.2H8.1l-.9 1.6V16H19v2H7a2 2 0 0 1-1.7-3l1.4-2.4L3 4H1z" />,
  users: <path d="M9 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm7.5 1a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM1 20c0-3.9 3.6-6 8-6s8 2.1 8 6v1H1zm17.5 1v-1c0-2-1-3.8-2.5-5 3.4.1 7 1.6 7 4.5V21z" />,
  user: <path d="M12 3a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 11c4.4 0 8 2.2 8 5.5V21H4v-1.5C4 16.2 7.6 14 12 14Z" />,
  truck: <path d="M1 4h13v4h4l4 5v5h-2.2a3 3 0 0 1-5.6 0H9.8a3 3 0 0 1-5.6 0H1zm6 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm10 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-3-6v3h5.6L17 10z" />,
  wallet: <path d="M3 5h16a2 2 0 0 1 2 2v1h-6a4 4 0 0 0 0 8h6v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm12 5h7v4h-7a2 2 0 1 1 0-4Zm0 1.2a.8.8 0 1 0 0 1.6.8.8 0 0 0 0-1.6Z" />,
  chart: <path d="M3 3h2v16h16v2H3zm4 9h3v5H7zm5-5h3v10h-3zm5 3h3v7h-3z" />,
  shield: <path d="m12 2 8 3v6c0 5.2-3.4 9.4-8 11-4.6-1.6-8-5.8-8-11V5zm-1.2 13.6 5.6-5.6-1.4-1.4-4.2 4.2-2-2-1.4 1.4z" />,
  receipt: <path d="M5 2h14v20l-2.3-1.5L14.3 22 12 20.5 9.7 22l-2.4-1.5L5 22zm3 5v2h8V7zm0 4v2h8v-2zm0 4v2h5v-2z" />,
  refresh: <path d="M12 4a8 8 0 0 1 7.4 5H17v2h6V5h-2v2.3A10 10 0 1 0 22 13h-2a8 8 0 1 1-8-9Z" />,
  undo: <path d="M10 5V1L4 7l6 6V9c3.9 0 7 2.4 7 6.5 0 1.6-.5 3-1.3 4.1A8 8 0 0 0 20 13c0-4.7-4.3-8-10-8Z" />,
  home: <path d="m12 3 9 8h-3v9h-5v-6h-2v6H6v-9H3z" />,
  calendar: <path d="M7 2h2v2h6V2h2v2h3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3zm-2 8v10h14V10zm2 2h4v4H7z" />,
  clipboard: <path d="M9 2h6a1 1 0 0 1 1 1v1h3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3V3a1 1 0 0 1 1-1Zm1 2v2h4V4zM7 10v2h10v-2zm0 4v2h10v-2zm0 4v2h6v-2z" />,
  menu: <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />,
  close: <path d="m6.4 5 5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4z" />,
  external: <path d="M14 3h7v7h-2V6.4l-8.3 8.3-1.4-1.4L17.6 5H14zM5 5h6v2H5v12h12v-6h2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />,
  key: <path d="M7 9a5 5 0 0 1 9.6-2H22v4h-2v3h-3v-3h-.4A5 5 0 1 1 7 9Zm5-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />,
  tag: <path d="M3 3h8l10 10-8 8L3 11zm4 2.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />,
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
