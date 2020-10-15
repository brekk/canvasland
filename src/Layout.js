import BusyIndicator from "react-busy-indicator"
import React from "react"
import { Link, NotFoundBoundary, useLoadingRoute } from "react-navi"
import blem from "blem"

const bem = blem("Layout")

const UnableToRender = () => (
  <div className={bem("error")}>
    <h1>404 - Not Found</h1>
  </div>
)

function Layout({ children }) {
  const loadingRoute = useLoadingRoute()
  const pathname = window ? window.location.pathname : ''
  const link = (x, p) => bem(x, pathname === p ? 'active' : 'inactive')
  return (
    <div className={bem()}>
      <BusyIndicator isBusy={!!loadingRoute} delayMs={200} />
      <header className={bem("header")}>
        <nav className={bem("nav")}>
          <ul className={bem('nav-list')}>
            <li className={link('nav-item', '/')}>
              <Link href="/" className={link('nav-link', '/')}>
                <span role="img" aria-label="drawing"
                className={bem('icon')}
                >
                  ✏️
                </span>
              </Link>
            </li>
            <li className={link('nav-item', '/stats')}>
              <Link href="/stats" className={link('nav-link', '/stats')}>
                <span role="img" aria-label="statistics"

                className={bem('icon')}
                >
                  📈
                </span>
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className={bem('main')}>
        <NotFoundBoundary render={UnableToRender}>{children}</NotFoundBoundary>
      </main>
    </div>
  )
}

export default Layout
