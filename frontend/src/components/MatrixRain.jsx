import { useEffect, useRef } from 'react'

const CHARS = '01アイウエオカキクケコサシスセソタチツテト∑∆Ω≈◊'

export default function MatrixRain({ count = 25 }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    container.innerHTML = ''

    const intervals = []
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span')
      el.className = 'matrix-char'
      el.style.pointerEvents = 'none'   // ✅ fix: spans were intercepting clicks
      el.textContent = CHARS[Math.floor(Math.random() * CHARS.length)]
      el.style.left = (Math.random() * 100) + '%'
      el.style.setProperty('--duration', (6 + Math.random() * 8) + 's')
      el.style.setProperty('--delay', (Math.random() * 10) + 's')
      container.appendChild(el)

      const iv = setInterval(() => {
        el.textContent = CHARS[Math.floor(Math.random() * CHARS.length)]
      }, 200 + Math.random() * 600)
      intervals.push(iv)
    }
    return () => intervals.forEach(clearInterval) 
  }, [count])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}