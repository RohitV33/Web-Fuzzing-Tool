import { useEffect } from 'react'

export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            // animate progress bars
            entry.target.querySelectorAll('.progress-fill').forEach(bar => {
              const w = bar.dataset.width || '1'
              bar.style.transform = `scaleX(${w})`
            })
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}
