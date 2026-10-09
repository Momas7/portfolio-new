'use client'

import { useEffect, useRef } from 'react'

// Poço gravitacional: malha do espaço-tempo afundando num funil até o
// buraco negro, com matéria escorrendo em espiral para dentro.
// Canvas 2D puro: pausa fora da tela e respeita reduced motion.

const RINGS = 22
const SPOKES = 44
const SEGMENTS = 120
const THROAT = 0.075 // raio da garganta (o buraco)

interface Mote {
  r: number
  a: number
  speed: number
  size: number
}

// Mistura duas cores hex (t=0 a, t=1 b)
function mix(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16)
  const pb = parseInt(b.slice(1), 16)
  const ch = (shift: number) =>
    Math.round(((pa >> shift) & 255) + (((pb >> shift) & 255) - ((pa >> shift) & 255)) * t)
  return `rgb(${ch(16)}, ${ch(8)}, ${ch(0)})`
}

// Paletas: ciano na borda, violeta na garganta
const PALETTES = {
  dark: { outer: '#22d3ee', inner: '#c084fc', pulse: '#67e8f9', rim: '#f5d0fe', hole: '#02030a' },
  light: { outer: '#0e7490', inner: '#5b21b6', pulse: '#0891b2', rim: '#7c3aed', hole: '#0a1024' },
}

function spawnMote(outer = true): Mote {
  return {
    r: outer ? 0.75 + Math.random() * 0.3 : THROAT + Math.random() * 0.9,
    a: Math.random() * Math.PI * 2,
    speed: 0.6 + Math.random() * 0.8,
    size: Math.random() < 0.2 ? 2.2 : 1.4,
  }
}

interface GravityWellProps {
  targetId: string
  label: string
  hint: string
}

export default function GravityWell({ targetId, label, hint }: GravityWellProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const holeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const holeButton = holeRef.current
    if (!canvas || !holeButton) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.matchMedia('(max-width: 768px)').matches
    const motes = Array.from({ length: small ? 70 : 140 }, () => spawnMote(false))

    let width = 0
    let height = 0
    let dark = true
    let pal = PALETTES.dark
    const readTheme = () => {
      dark = document.documentElement.classList.contains('dark')
      pal = dark ? PALETTES.dark : PALETTES.light
    }
    readTheme()

    const pointer = { x: 0, y: 0 }
    const tilt = { x: 0, y: 0 }
    let rotation = 0
    let hover = 0
    let hoverTarget = 0
    let warp = 0
    let warpTarget = 0
    let clock = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      // Escala exata (evita desalinhamento com o botão por arredondamento)
      ctx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0)
    }

    const draw = (dt: number) => {
      tilt.x += (pointer.x - tilt.x) * 0.04
      tilt.y += (pointer.y - tilt.y) * 0.04
      hover += (hoverTarget - hover) * Math.min(1, dt * 6)
      warp += (warpTarget - warp) * Math.min(1, dt * (warpTarget > warp ? 3 : 1.5))
      rotation += dt * (0.05 + hover * 0.12 + warp * 1.6)
      clock += dt

      const R = Math.min(width * (small ? 0.66 : 0.42), height * (small ? 0.6 : 0.8))
      const cx = width * (small ? 0.5 : 0.62) + tilt.x * 18
      const cy = height * (small ? 0.66 : 0.46)
      const phi = 0.42 + tilt.y * 0.06 // inclinação da câmera
      const cosP = Math.cos(phi)
      const sinP = Math.sin(phi)
      // Profundidade do funil cresce no hover e despenca no clique
      const A = 0.34 * (1 + hover * 0.25 + warp * 2.2)
      const shrink = 1 - warp * 0.55

      const depth = (r: number) => -A / (r * 9 + 0.35) + A / (9 + 0.35)

      // Projeta ponto da malha (raio, ângulo) na tela
      const project = (r: number, a: number) => {
        const rr = r * shrink
        const X = Math.cos(a) * rr
        const Z = Math.sin(a) * rr
        const Y = depth(r)
        const yv = Y * cosP + Z * sinP
        const zv = -Y * sinP + Z * cosP
        const p = 1 / (1 + zv * 0.35)
        return { x: cx + X * R * p, y: cy - yv * R * p, p }
      }

      ctx.clearRect(0, 0, width, height)
      // No escuro as linhas somam luz (efeito neon)
      ctx.globalCompositeOperation = dark ? 'lighter' : 'source-over'
      const fadeWarp = 1 - warp * 0.5

      const strokeGlow = (color: string, alpha: number, widthPx: number) => {
        ctx.strokeStyle = color
        if (dark) {
          ctx.lineWidth = widthPx * 4
          ctx.globalAlpha = alpha * 0.18
          ctx.stroke()
        }
        ctx.lineWidth = widthPx
        ctx.globalAlpha = alpha
        ctx.stroke()
      }

      const ringPath = (r: number, segments: number) => {
        ctx.beginPath()
        for (let s = 0; s <= segments; s++) {
          const pt = project(r, (s / segments) * Math.PI * 2)
          if (s === 0) ctx.moveTo(pt.x, pt.y)
          else ctx.lineTo(pt.x, pt.y)
        }
      }

      // Anéis concêntricos: espaçamento menor perto da garganta
      for (let i = 0; i < RINGS; i++) {
        const t = i / (RINGS - 1)
        const r = THROAT + Math.pow(t, 1.6) * (1 - THROAT)
        ringPath(r, SEGMENTS)
        const alpha = (dark ? 0.42 : 0.3) * (1 - t * 0.8) * fadeWarp
        strokeGlow(mix(pal.inner, pal.outer, Math.sqrt(t)), alpha, 1)
      }

      // Raios: torcem conforme descem (arrasto do buraco)
      for (let k = 0; k < SPOKES; k++) {
        const base = (k / SPOKES) * Math.PI * 2 + rotation
        ctx.beginPath()
        for (let s = 0; s <= 28; s++) {
          const t = s / 28
          const r = THROAT + Math.pow(t, 1.6) * (1 - THROAT)
          const twist = (1 - t) * (0.9 + warp * 3)
          const pt = project(r, base + twist)
          if (s === 0) ctx.moveTo(pt.x, pt.y)
          else ctx.lineTo(pt.x, pt.y)
        }
        ctx.strokeStyle = mix(pal.inner, pal.outer, 0.5)
        ctx.lineWidth = 1
        ctx.globalAlpha = (dark ? 0.16 : 0.16) * fadeWarp
        ctx.stroke()
      }

      // Pulso de energia: anel que desce da borda até a garganta
      const period = 3.4
      const phase = (clock % period) / 1.8
      if (phase < 1) {
        const eased = phase * phase
        const r = 1 - eased * (1 - THROAT)
        ringPath(r, SEGMENTS)
        strokeGlow(pal.pulse, Math.sin(Math.PI * phase) * (dark ? 0.85 : 0.6), 1.6)
      }

      // Matéria caindo em espiral
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i]
        const pull = 0.04 / (m.r + 0.05)
        m.r -= dt * m.speed * pull * (1 + hover * 1.5 + warp * 8)
        m.a += dt * m.speed * (0.35 / (m.r + 0.08)) * (1 + warp * 3)
        if (m.r <= THROAT * 1.05) Object.assign(m, spawnMote())
        const fade = Math.min(1, (m.r - THROAT) * 6) * Math.min(1, (1.05 - m.r) * 4)
        const pt = project(m.r, m.a + rotation)
        ctx.fillStyle = mix(pal.rim, pal.pulse, Math.min(1, m.r))
        ctx.globalAlpha = Math.max(0, fade) * (dark ? 0.95 : 0.7)
        const size = m.size * pt.p
        ctx.fillRect(pt.x - size / 2, pt.y - size / 2, size, size)
      }

      // Horizonte de eventos: garganta escura com anel de fótons
      ctx.globalCompositeOperation = 'source-over'
      ringPath(THROAT, 64)
      ctx.closePath()
      ctx.globalAlpha = 1
      ctx.fillStyle = pal.hole
      ctx.fill()
      ctx.shadowColor = pal.rim
      ctx.shadowBlur = 18 + hover * 14 + warp * 30
      ctx.strokeStyle = pal.rim
      ctx.lineWidth = 2
      ctx.stroke()
      ringPath(THROAT * 1.25, 64)
      ctx.shadowBlur = 0
      ctx.strokeStyle = pal.pulse
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.6 + hover * 0.4
      ctx.stroke()
      ctx.globalAlpha = 1

      // Área clicável cobre a boca do funil (não o centro matemático)
      let minX = Infinity
      let maxX = -Infinity
      let minY = Infinity
      let maxY = -Infinity
      for (let s = 0; s < 32; s++) {
        const a = (s / 32) * Math.PI * 2
        for (const r of [THROAT, 0.2]) {
          const pt = project(r, a)
          minX = Math.min(minX, pt.x)
          maxX = Math.max(maxX, pt.x)
          minY = Math.min(minY, pt.y)
          maxY = Math.max(maxY, pt.y)
        }
      }
      const pad = 12
      holeButton.style.width = `${maxX - minX + pad * 2}px`
      holeButton.style.height = `${maxY - minY + pad * 2}px`
      holeButton.style.transform = `translate(${minX - pad}px, ${minY - pad}px)`
    }

    resize()

    let raf = 0
    let last = performance.now()
    let running = false

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      draw(dt)
      raf = requestAnimationFrame(loop)
    }

    const start = () => {
      if (running || reduceMotion) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }

    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    if (reduceMotion) draw(0)

    const visibility = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !document.hidden) start()
      else stop()
    })
    visibility.observe(canvas)

    const onVisibility = () => {
      if (document.hidden) stop()
      else if (canvas.getBoundingClientRect().bottom > 0) start()
    }

    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2
    }

    // ResizeObserver pega mudanças de tamanho sem evento de janela (ex.: barra de rolagem)
    const sizeObserver = new ResizeObserver(() => {
      resize()
      if (reduceMotion) draw(0)
    })
    sizeObserver.observe(canvas)

    const themeObserver = new MutationObserver(() => {
      readTheme()
      if (reduceMotion) draw(0)
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    let timers: ReturnType<typeof setTimeout>[] = []
    let scrollRaf = 0
    const goToTarget = () => {
      const target = document.getElementById(targetId)
      if (!target) return
      history.replaceState(null, '', `#${targetId}`)
      const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
      const to = target.getBoundingClientRect().top + window.scrollY - offset
      if (reduceMotion) return window.scrollTo({ top: to, behavior: 'instant' })
      // Rolagem própria: não depende do smooth scroll nativo
      const from = window.scrollY
      const duration = 1000
      const t0 = performance.now()
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / duration)
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
        window.scrollTo({ top: from + (to - from) * eased, behavior: 'instant' })
        if (t < 1) scrollRaf = requestAnimationFrame(step)
      }
      scrollRaf = requestAnimationFrame(step)
    }
    const onHoleClick = () => {
      if (reduceMotion) return goToTarget()
      if (warpTarget === 1) return
      warpTarget = 1
      timers = [
        setTimeout(goToTarget, 650),
        setTimeout(() => {
          warpTarget = 0
        }, 1300),
      ]
    }
    const onHoleEnter = () => {
      hoverTarget = 1
    }
    const onHoleLeave = () => {
      hoverTarget = 0
    }

    holeButton.addEventListener('click', onHoleClick)
    holeButton.addEventListener('pointerenter', onHoleEnter)
    holeButton.addEventListener('pointerleave', onHoleLeave)
    holeButton.addEventListener('focus', onHoleEnter)
    holeButton.addEventListener('blur', onHoleLeave)
    window.addEventListener('pointermove', onPointer)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      timers.forEach(clearTimeout)
      cancelAnimationFrame(scrollRaf)
      holeButton.removeEventListener('click', onHoleClick)
      holeButton.removeEventListener('pointerenter', onHoleEnter)
      holeButton.removeEventListener('pointerleave', onHoleLeave)
      holeButton.removeEventListener('focus', onHoleEnter)
      holeButton.removeEventListener('blur', onHoleLeave)
      visibility.disconnect()
      themeObserver.disconnect()
      sizeObserver.disconnect()
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [targetId])

  return (
    <>
      <canvas ref={canvasRef} className="well" aria-hidden="true" />
      <button ref={holeRef} type="button" className="well-hole" aria-label={label}>
        <span className="well-frame" aria-hidden="true" />
        <span className="well-hint" aria-hidden="true">
          {hint}
        </span>
      </button>
    </>
  )
}
