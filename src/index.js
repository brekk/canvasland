import React, { Suspense } from "react"
import { mount, route, lazy } from "navi"
import { Router, View } from "react-navi"
import ReactDOM from "react-dom"
import api from "./api"
import Layout from "./Layout"
import Landing from "./Landing"
import "./App.css"
import * as serviceWorker from "./serviceWorker"

const routes = mount({
  "/": route({
    title: "🏚",
    getData: () => api.fetchAllDrawings(),
    view: <Landing />,
  }),
  "/stats": lazy(() => import("./stats")),
})

ReactDOM.render(
  <React.StrictMode>
    <Router routes={routes}>
      <Layout>
        <Suspense fallback={null}>
          <View />
        </Suspense>
      </Layout>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
