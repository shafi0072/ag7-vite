import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { useEffect } from 'react'
import i18n from '@/lib/i18n'

import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'

import Dashboard from '@/pages/Dashboard'
import Chat from '@/pages/Chat'
import Tasks from '@/pages/Tasks'
import Calendar from '@/pages/Calendar'
import Settings from '@/pages/Settings'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import Onboarding from '@/pages/Onboarding'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('ag7_token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('ag7_token')
  if (token) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-screen bg-[#0F0F0F] text-white overflow-hidden">
      {/* Glow layer */}
      <div
        className="fixed inset-0 pointer-events-none z-[50]"
        style={{ mixBlendMode: "screen" }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: 180,
            height: 180,
            top: 36,
            left: 564,
            backgroundColor: "#FF7439",
            filter: "blur(200px)",
            opacity: 1,
          }}
        />
      </div>

      {/* Layout */}
      <div className="relative z-[10] flex flex-col h-full">
        <Topbar />
        <div className="flex flex-1 min-h-0">
          <Sidebar />
          <main className="flex-1 overflow-auto p-6 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow orb */}
      <div
        style={{
          position: "absolute",
          width: 422,
          height: 422,
          top: -77,
          left: -92,
          borderRadius: "50%",
          background: "#FF7439",
          opacity: 0.25,
          filter: "blur(200px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div className="w-full max-w-md relative z-10">{children}</div>
    </div>
  )
}

function I18nSync() {
  useEffect(() => {
    const saved = localStorage.getItem('ag7_language')
    if (saved && saved !== i18n.language) {
      i18n.changeLanguage(saved)
    }
  }, [])
  return null
}

function AppRoutes() {
  const location = useLocation()
  const isAuth = ['/login', '/signup'].includes(location.pathname)
  const isOnboarding = location.pathname === '/onboarding'

  if (isOnboarding) {
    return (
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
      </Routes>
    )
  }

  if (isAuth) {
    return (
      <AuthLayout>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        </Routes>
      </AuthLayout>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <I18nSync />
        <AppRoutes />
      </BrowserRouter>
    </I18nextProvider>
  )
}
