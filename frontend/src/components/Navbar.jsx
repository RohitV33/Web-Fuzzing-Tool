import { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Target, Menu, X, LayoutDashboard, LogOut, User, ChevronDown, Sun, Moon } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [userMenu,  setUserMenu]  = useState(false)
  const [isMobile,  setIsMobile]  = useState(false)
  const { user, logout } = useAuth()
  const { theme, toggle } = useTheme()
  const location  = useLocation()
  const navigate  = useNavigate()

  // Track scroll for backdrop style
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Track viewport width to conditionally render desktop vs mobile controls
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const onChange = (e) => setIsMobile(e.matches)
    setIsMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false)
    setUserMenu(false)
  }, [location])

  const handleLogout = () => { logout(); navigate('/') }

  const links = user
    ? [
        { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={13} /> },
        { to: '/scanner',   label: 'Scanner' },
        { to: '/reports',   label: 'Reports' },
        { to: '/about',     label: 'About' },
      ]
    : [
        { to: '/',        label: 'Home',    end: true },
        { to: '/scanner', label: 'Scanner' },
        { to: '/reports', label: 'Reports' },
        { to: '/about',   label: 'About' },
      ]

  const isDark = theme === 'dark'

  const navBg = scrolled
    ? isDark ? 'rgba(9,9,11,0.94)' : 'rgba(248,249,251,0.96)'
    : isDark ? 'rgba(9,9,11,0.6)'  : 'rgba(248,249,251,0.75)'

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: '60px',
        background: navBg,
        backdropFilter: 'blur(24px) saturate(160%)',
        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
        borderBottom: `1px solid ${scrolled ? 'var(--border-hover)' : 'var(--border)'}`,
        transition: 'background 0.3s ease, border-color 0.3s ease',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto', height: '100%',
          padding: '0 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '1rem',
        }}>

          {/* ── Logo ── */}
          <NavLink
            to={user ? '/dashboard' : '/'}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '9px', flexShrink: 0 }}
          >
            <div style={{
              width: '32px', height: '32px', borderRadius: '9px',
              background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 10px var(--accent-glow)',
            }}>
              <Target size={15} color="white" />
            </div>
            <span style={{
              fontWeight: 700, fontSize: '0.95rem',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              fontFamily: 'Syne, sans-serif',
            }}>
              Vuln<span style={{ color: 'var(--text-accent)' }}>Scan</span>
            </span>
          </NavLink>

          {/* ── Desktop Centre Links ── */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center' }}>
              {links.map(l => (
                <NavLink
                  key={l.to} to={l.to} end={l.end}
                  style={({ isActive }) => ({
                    textDecoration: 'none',
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '0.38rem 0.78rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: isActive ? 'var(--text-accent)' : 'var(--text-secondary)',
                    background: isActive ? 'var(--accent-light)' : 'transparent',
                    transition: 'all 0.18s',
                  })}
                >
                  {l.icon && l.icon}
                  {l.label}
                </NavLink>
              ))}
            </div>
          )}

          {/* ── Desktop Right Side ── */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>

              {/* Theme toggle */}
              <button
                onClick={toggle}
                title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                style={{
                  width: '32px', height: '32px',
                  borderRadius: '8px',
                  background: 'var(--bg-surface-2)',
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  transition: 'all 0.18s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
              >
                {isDark ? <Sun size={14} /> : <Moon size={14} />}
              </button>

              {/* Divider */}
              <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 0.2rem' }} />

              {user ? (
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setUserMenu(v => !v)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '0.3rem 0.65rem 0.3rem 0.4rem',
                      background: userMenu ? 'var(--accent-light)' : 'var(--bg-surface-2)',
                      border: `1px solid ${userMenu ? 'var(--border-accent)' : 'var(--border)'}`,
                      borderRadius: '9px', cursor: 'pointer',
                      transition: 'all 0.18s',
                    }}
                  >
                    <div style={{
                      width: '22px', height: '22px', borderRadius: '50%',
                      background: 'var(--accent)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <User size={11} color="white" />
                    </div>
                    <span style={{ color: 'var(--text-primary)', fontSize: '0.83rem', fontWeight: 500 }}>
                      {user.username || user.email?.split('@')[0] || 'User'}
                    </span>
                    <ChevronDown size={11} style={{
                      color: 'var(--text-muted)',
                      transform: userMenu ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.2s',
                    }} />
                  </button>

                  {userMenu && (
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 7px)', right: 0,
                      width: '170px',
                      background: isDark ? '#111113' : '#fff',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '0.3rem',
                      boxShadow: 'var(--shadow-lg)',
                      zIndex: 100,
                    }}>
                      <NavLink to="/profile" style={{ textDecoration: 'none' }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '0.48rem 0.65rem', borderRadius: '8px', cursor: 'pointer',
                          color: 'var(--text-secondary)', fontSize: '0.83rem', transition: 'all 0.15s',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                        >
                          <User size={13} /> Profile
                        </div>
                      </NavLink>
                      <div style={{ height: '1px', background: 'var(--border)', margin: '0.25rem 0' }} />
                      <div
                        onClick={handleLogout}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '0.48rem 0.65rem', borderRadius: '8px', cursor: 'pointer',
                          color: 'var(--danger)', fontSize: '0.83rem', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-bg)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                      >
                        <LogOut size={13} /> Sign out
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    style={{
                      textDecoration: 'none',
                      padding: '0.38rem 0.85rem',
                      borderRadius: '8px', fontSize: '0.875rem', fontWeight: 500,
                      color: 'var(--text-secondary)',
                      transition: 'all 0.18s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-hover)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent' }}
                  >
                    Log in
                  </NavLink>

                  <NavLink
                    to="/login"
                    style={{
                      textDecoration: 'none',
                      padding: '0.38rem 0.9rem',
                      borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600,
                      color: '#fff',
                      background: 'var(--accent)',
                      boxShadow: '0 2px 10px var(--accent-glow)',
                      transition: 'all 0.18s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-hover)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    Get Started
                  </NavLink>
                </>
              )}
            </div>
          )}

          {/* ── Mobile Right Side (theme + hamburger only) ── */}
          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                onClick={toggle}
                title="Toggle theme"
                style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: 'var(--bg-surface-2)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--text-secondary)',
                }}
              >
                {isDark ? <Sun size={14} /> : <Moon size={14} />}
              </button>
              <button
                onClick={() => setMenuOpen(v => !v)}
                style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: 'var(--bg-surface-2)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--text-primary)',
                }}
              >
                {menuOpen ? <X size={17} /> : <Menu size={17} />}
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ── Mobile Dropdown Menu ── */}
      {isMobile && menuOpen && (
        <div style={{
          position: 'fixed', top: '60px', left: 0, right: 0, zIndex: 49,
          background: isDark ? 'rgba(9,9,11,0.97)' : 'rgba(248,249,251,0.98)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid var(--border)',
          padding: '0.6rem 1.25rem 1.25rem',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
            {links.map(l => (
              <NavLink
                key={l.to} to={l.to} end={l.end}
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '0.65rem 0.9rem', borderRadius: '10px',
                  color: isActive ? 'var(--text-accent)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--accent-light)' : 'transparent',
                  fontSize: '0.9rem', fontWeight: isActive ? 500 : 400,
                })}
              >
                {l.icon && l.icon}
                {l.label}
              </NavLink>
            ))}

            <div style={{ height: '1px', background: 'var(--border)', margin: '0.5rem 0' }} />

            {user ? (
              <button onClick={handleLogout} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '0.65rem 0.9rem', borderRadius: '10px',
                color: 'var(--danger)', background: 'var(--danger-bg)',
                border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500,
                width: '100%',
              }}>
                <LogOut size={14} /> Sign out
              </button>
            ) : (
              <NavLink to="/login" style={{
                textDecoration: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0.7rem', borderRadius: '10px',
                background: 'var(--accent)',
                color: '#fff', fontWeight: 600, fontSize: '0.9rem',
              }}>
                Get Started
              </NavLink>
            )}
          </div>
        </div>
      )}
    </>
  )
}