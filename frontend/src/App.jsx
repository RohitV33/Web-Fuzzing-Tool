import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'
import Landing   from './pages/Landing'
import AuthPage  from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import Scanner   from './pages/Scanner'
import Reports   from './pages/Reports'
import About     from './pages/About'
import AuthSuccess from './pages/AuthSuccess'


export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <div className="pt-16">
          <Routes>
            <Route path="/"          element={<Landing />} />
            <Route path="/login"     element={<AuthPage />} />
            <Route path="/about"     element={<About />} />
            <Route path="/scanner"   element={<Scanner />} />
            <Route path="/reports"      element={<Reports />} />
            <Route path="/reports/:id"  element={<Reports />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/auth-success" element={<AuthSuccess />} />
          </Routes>
          </div>
          <ScrollToTop />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

