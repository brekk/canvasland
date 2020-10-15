import React from "react"
import { mount, route } from "navi"
import api from "./api"

const Statistics = ({ drawing }) => (
  <article>
    <h1>{drawing.title}</h1>
    <pre>
      <code>{JSON.stringify(drawing, null, 2)}</code>
    </pre>
  </article>
)

export default mount({
  "/:id": route({
    async getView(req) {
      const drawing = await api.fetchDrawing(req.params.id)
      return <Statistics drawing={drawing} />
    },
  }),
})
