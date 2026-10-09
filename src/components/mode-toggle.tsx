'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useLang } from '@/lib/i18n'
import { getThemePref, isDarkResolved, setThemePref, subscribeTheme, ThemePref } from '@/lib/theme'

// Mesma API do toggle do shadcn (Claro / Escuro / Sistema), sem next-themes.

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2m-7.07-17.07 1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

const options = [
  { value: 'light', label: 'light' },
  { value: 'dark', label: 'dark' },
  { value: 'system', label: 'system' },
] as const satisfies readonly { value: ThemePref; label: string }[]

export function ModeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, getThemePref, () => null)
  const [open, setOpen] = useState(false)
  const { t } = useLang()
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!theme) return <span className="toggle" aria-hidden="true" />

  const dark = isDarkResolved(theme)

  return (
    <div ref={rootRef} className="toggle-root">
      <button
        type="button"
        className="toggle"
        aria-label={`${t('theme')} ${t(theme)}`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="toggle-icon" data-on={!dark}>
          <SunIcon />
        </span>
        <span className="toggle-icon" data-on={dark}>
          <MoonIcon />
        </span>
      </button>

      {open && (
        <div className="toggle-menu" role="menu">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="menuitemradio"
              aria-checked={theme === opt.value}
              onClick={() => {
                setThemePref(opt.value)
                setOpen(false)
              }}
            >
              {t(opt.label)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
