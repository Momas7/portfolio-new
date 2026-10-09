'use client'

import { useEffect, useState } from 'react'

// Nome digitado letra a letra no carregamento. O texto restante fica
// transparente para reservar a largura e evitar layout shift.
export default function TypedName({ text }: { text: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let i = 0
    let timer: ReturnType<typeof setTimeout>
    const tick = () => {
      i = reduce ? text.length : i + 1
      setCount(i)
      if (i < text.length) timer = setTimeout(tick, 55 + Math.random() * 70)
    }
    timer = setTimeout(tick, reduce ? 0 : 450)
    return () => clearTimeout(timer)
  }, [text])

  return (
    <h1 className="hero-name" aria-label={text}>
      <span aria-hidden="true">
        {text.slice(0, count)}
        <span className="hero-cursor">_</span>
        <span className="hero-ghost">{text.slice(count)}</span>
      </span>
    </h1>
  )
}
