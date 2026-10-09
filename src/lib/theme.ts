// Tema sem dependências: preferência salva em localStorage ('theme'),
// classe `dark` no <html>. O script inline do layout aplica antes da hidratação.

export type ThemePref = 'light' | 'dark' | 'system'

const KEY = 'theme'
const DEFAULT: ThemePref = 'dark'
const listeners = new Set<() => void>()

function systemDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function getThemePref(): ThemePref {
  try {
    const value = localStorage.getItem(KEY)
    if (value === 'light' || value === 'dark' || value === 'system') return value
  } catch {}
  return DEFAULT
}

export function isDarkResolved(pref: ThemePref) {
  return pref === 'dark' || (pref === 'system' && systemDark())
}

function apply(pref: ThemePref) {
  const dark = isDarkResolved(pref)
  const root = document.documentElement
  root.classList.toggle('dark', dark)
  root.style.colorScheme = dark ? 'dark' : 'light'
}

export function setThemePref(pref: ThemePref) {
  try {
    localStorage.setItem(KEY, pref)
  } catch {}
  apply(pref)
  listeners.forEach((l) => l())
}

export function subscribeTheme(listener: () => void) {
  listeners.add(listener)
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const onSystem = () => {
    if (getThemePref() === 'system') apply('system')
    listener()
  }
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      apply(getThemePref())
      listener()
    }
  }
  media.addEventListener('change', onSystem)
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    media.removeEventListener('change', onSystem)
    window.removeEventListener('storage', onStorage)
  }
}

export const themeInitScript = `(function(){try{var t=localStorage.getItem('${KEY}');if(t!=='light'&&t!=='dark'&&t!=='system')t='${DEFAULT}';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light'}catch(e){document.documentElement.classList.add('dark')}})()`
