import React from "react"
import { mount, route } from "navi"
import api from "./api"

const Statistics = ({ user }) => (
  <article>
    <h1>{user.name}</h1>
    <pre>
    <code>
    {JSON.stringify(user, null, 2)}
    </code>
    </pre>
  </article>
)

export default mount({
  "/:id": route({
    async getView(req) {
      console.log("uh what", req)
      const user = await api.fetchDrawing(req.params.id)
      return <Statistics user={user} />
    }
  })
})
