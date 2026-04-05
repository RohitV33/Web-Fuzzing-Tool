import { useEffect, useRef } from 'react'

export function useCounter() {
  const ran = useRef(new Set())

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          entry.target.querySelectorAll('.counter[data-target]').forEach(el => {
            if (ran.current.has(el)) return
            ran.current.add(el)
            const target = parseInt(el.dataset.target)
            const suffix = el.dataset.suffix || ''
            const duration = 2000
            const start = performance.now()
            const update = now => {
              const p = Math.min((now - start) / duration, 1)
              const e = 1 - Math.pow(1 - p, 3)
              el.textContent = Math.floor(e * target).toLocaleString() + suffix
              if (p < 1) requestAnimationFrame(update)
            }
            requestAnimationFrame(update)
          })
        })
      },
      { threshold: 0.2 }
    )

    document.querySelectorAll('.stat-section').forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])
}
