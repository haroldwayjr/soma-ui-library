import { useEffect } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { AvatarsPage } from './pages/AvatarsPage'
import { CategoryPage } from './pages/CategoryPage'
import { ComponentPage } from './pages/ComponentPage'
import { FoundationPage } from './pages/FoundationPage'
import { HomePage } from './pages/HomePage'
import { IconsPage } from './pages/IconsPage'
import { NotFoundPage } from './pages/NotFoundPage'

/** Migrate old HashRouter bookmarks (`#/ui-library/...`) to path URLs. */
function HashRouteRedirect() {
  const location = useLocation()
  useEffect(() => {
    const { hash } = window.location
    if (hash.startsWith('#/')) {
      const next = hash.slice(1)
      window.history.replaceState(null, '', next)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }, [location])
  return null
}

function App() {
  return (
    <BrowserRouter>
      <HashRouteRedirect />
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/ui-library" replace />} />
          <Route path="/ui-library" element={<HomePage />} />
          <Route path="/ui-library/resources" element={<Navigate to="/ui-library/resources/icons" replace />} />
          <Route path="/ui-library/resources/icons" element={<IconsPage />} />
          <Route path="/ui-library/resources/avatars" element={<AvatarsPage />} />
          <Route path="/ui-library/foundation" element={<Navigate to="/ui-library/foundation/colors" replace />} />
          <Route path="/ui-library/foundation/:token" element={<FoundationPage />} />
          <Route path="/ui-library/:categorySlug/:componentSlug" element={<ComponentPage />} />
          <Route path="/ui-library/:categorySlug" element={<CategoryPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
