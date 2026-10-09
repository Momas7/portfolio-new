'use client'

import { useEffect, useRef } from 'react'

// Disco de partículas em perspectiva (estilo disco de acreção).
// Canvas 2D puro: sem dependências, pausa fora da tela e respeita reduced motion.

interface Particle {
  r: number // raio normalizado (0..1)
  a: number // ângulo
  h: number // espessura do disco
  s: number // tamanho
  v: number // velocidade angular
  tint: number // 0 = base, 1 = acento, 2 = anel interno
  alpha: number
}

function readColor(name: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

function createParticles(count: number): Particle[] {
  const list: Particle[] = []
  const inner = 0.16
  for (let i = 0; i < count; i++) {
    // Densidade alta perto do anel interno, caindo para fora
    const t = Math.pow(Math.random(), 2.2)
    const r = inner + t * (1 - inner) + (Math.random() - 0.5) * 0.02
    list.push({
      r,
      a: Math.random() * Math.PI * 2,
      h: (Math.random() - 0.5) * 0.06 * (0.4 + r),
      s: Math.random() < 0.08 ? 2.2 : Math.random() < 0.45 ? 1.5 : 1.1,
      v: 0.11 / Math.sqrt(r),
      tint: t < 0.12 && Math.random() < 0.75 ? 2 : Math.random() < 0.16 ? 1 : 0,
      alpha: Math.min(1, 0.45 + Math.pow(1 - t, 3) * 0.8) * (0.6 + Math.random() * 0.4),
    })
  }
  return list
}

export default function Galaxy({ targetId, label }: { targetId: string; label: string }) {
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
    const particles = createParticles(small ? 3500 : 9000)

    let width = 0
    let height = 0
    let dpr = 1
    let palette: string[] = []
    // Escuro: partículas somam luz. Claro: núcleo escuro + brilho colorido.
    let additive = true
    const readTheme = () => {
      palette = [
        readColor('--particle', '#e9ecff'),
        readColor('--particle-accent', '#9d8cff'),
        readColor('--particle-hot', '#ffffff'),
      ]
      additive = document.documentElement.classList.contains('dark')
    }
    readTheme()

    // Inclinação reage ao ponteiro com suavização
    const pointer = { x: 0, y: 0 }
    const tilt = { x: 0, y: 0 }

    // Hover acelera o giro; clique faz o disco ser engolido (warp 0..1)
    let hover = 0
    let hoverTarget = 0
    let warp = 0
    let warpTarget = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (dt: number) => {
      tilt.x += (pointer.x - tilt.x) * 0.04
      tilt.y += (pointer.y - tilt.y) * 0.04
      hover += (hoverTarget - hover) * Math.min(1, dt * 6)
      warp += (warpTarget - warp) * Math.min(1, dt * (warpTarget > warp ? 3.2 : 1.6))

      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = additive ? 'lighter' : 'source-over'

      const cx = width * (small ? 0.5 : 0.55) + tilt.x * 24
      const cy = height * (small ? 0.62 : 0.6) + tilt.y * 16
      const radius = Math.min(width * (small ? 0.62 : 0.44), height * 0.8)
      const incline = 1.15 + tilt.y * 0.12 // ~66° de inclinação
      const cosI = Math.cos(incline)
      const sinI = Math.sin(incline)
      const spin = tilt.x * 0.18
      const holeFrac = 0.17 * (1 + hover * 0.12 + warp * 1.4)
      const speed = 1 + hover * 1.2 + warp * 9

      // Botão invisível acompanha o buraco
      const hitW = radius * holeFrac * 2.8
      const hitH = Math.max(44, hitW * cosI)
      holeButton.style.width = `${hitW}px`
      holeButton.style.height = `${hitH}px`
      holeButton.style.transform = `translate(${cx - hitW / 2}px, ${cy - hitH / 2}px)`

      if (!additive) {
        // Halo violeta bem suave atrás do disco
        ctx.save()
        ctx.translate(cx, cy)
        ctx.scale(1, cosI)
        const halo = ctx.createRadialGradient(0, 0, radius * 0.15, 0, 0, radius * 0.7)
        halo.addColorStop(0, 'rgba(91, 71, 224, 0.1)')
        halo.addColorStop(1, 'rgba(91, 71, 224, 0)')
        ctx.fillStyle = halo
        ctx.beginPath()
        ctx.arc(0, 0, radius * 0.7, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.a += p.v * dt * speed
        const rr = p.r * (1 - warp * 0.75)
        // Engolida pelo buraco durante o warp
        if (warp > 0.01 && rr < holeFrac * 0.9) continue
        const ang = p.a + spin
        const x3 = Math.cos(ang) * rr
        const z3 = Math.sin(ang) * rr
        const y3 = p.h

        const sx = cx + x3 * radius
        const sy = cy + (z3 * cosI + y3 * sinI) * radius
        // Partículas da frente (z positivo) ficam maiores e mais claras
        const depth = 0.85 + z3 * 0.25
        const size = p.s * depth

        ctx.globalAlpha = Math.min(1, p.alpha * Math.max(0.25, depth) * (additive ? 1 : 1.35))
        ctx.fillStyle = palette[p.tint]
        ctx.fillRect(sx, sy, size, size)
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
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

    const onResize = () => {
      resize()
      if (reduceMotion) draw(0)
    }

    // Troca de tema muda as cores das partículas
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
    window.addEventListener('resize', onResize)
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
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [targetId])

  return (
    <>
      <canvas ref={canvasRef} className="galaxy" aria-hidden="true" />
      <button ref={holeRef} type="button" className="galaxy-hole" aria-label={label} />
    </>
  )
}
