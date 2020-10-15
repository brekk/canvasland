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
  return (
    <div className={bem()}>
      <BusyIndicator isBusy={!!loadingRoute} delayMs={200} />
      <header className={bem("header")}>
        <nav className={bem("nav")}>
          <ul>
            <li>
              <Link href="/">
                <span role="img" aria-label="drawing">
                  ✏️
                </span>
              </Link>
            </li>
            <li>
              <Link href="/stats">
                <span role="img" aria-label="statistics">
                  📈
                </span>
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <NotFoundBoundary render={UnableToRender}>{children}</NotFoundBoundary>
      </main>
    </div>
  )
}

export default Layout
