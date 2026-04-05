import { useState, useEffect } from 'react'

/**
 * Returns { isMobile, isTablet }
 *  isMobile  → viewport < 640px
 *  isTablet  → viewport < 1024px (includes mobile)
 */
export function useResponsive() {
  const [state, setState] = useState({ isMobile: false, isTablet: false })

  useEffect(() => {
    const mqMobile = window.matchMedia('(max-width: 639px)')
    const mqTablet = window.matchMedia('(max-width: 1023px)')

    const update = () =>
      setState({ isMobile: mqMobile.matches, isTablet: mqTablet.matches })

    update()
    mqMobile.addEventListener('change', update)
    mqTablet.addEventListener('change', update)
    return () => {
      mqMobile.removeEventListener('change', update)
      mqTablet.removeEventListener('change', update)
    }
  }, [])

  return state
}
