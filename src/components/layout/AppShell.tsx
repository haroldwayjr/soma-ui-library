import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function AppShell() {
  const { pathname } = useLocation()
  const home = pathname === '/ui-library' || pathname === '/'
  const wide =
    home ||
    pathname.includes('/resources/') ||
    pathname.includes('/foundation/')

  return (
    <div className="min-h-screen bg-surface text-ink antialiased">
      <Header />
      <Sidebar />
      <main className="min-h-screen pl-[272px] pt-16">
        <div
          className={`mx-auto w-full ${
            home
              ? 'max-w-none px-5 pb-16 pt-5 lg:px-6 lg:pt-6'
              : `px-8 py-12 lg:px-12 ${wide ? 'max-w-7xl' : 'max-w-6xl'}`
          }`}
        >
          <Outlet />
        </div>
      </main>
    </div>
  )
}
