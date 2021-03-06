import {
  defaultTo,
  objOf,
  values,
  pathOr,
  map,
  pipe,
  curry,
  merge,
} from "ramda"
import { NotFoundError } from "navi"
import * as E from "ensorcel/ensorcel.js"
import { trace } from "xtrace"
import axios from "axios"
const config = require("./config")

const BACKEND = "http://" + config.BACKEND.DOMAIN + ":" + config.BACKEND.PORT
const api = pipe(
  merge({ url: BACKEND, method: "get" }),
  trace("what up"),
  axios
)

const defaultify = pipe(
  merge({ title: "Untitled", points: [], color: "#888", opacity: 1 })
)

const then = curry((fn, thenable) => thenable.then(fn))
const snag = curry((fn, thenable) => thenable.catch(fn))

export default {
  fetchDrawing: (id) =>
    pipe(
      objOf("id"),
      objOf("data"),
      api,
      snag(() => NotFoundError),
      then(pipe(pathOr([], ["data", "points", id]), defaultify))
    )(id),
  fetchAllDrawings: pipe(
    defaultTo({}),
    api,
    snag(() => NotFoundError),
    then(pipe(pathOr([], ["data", "points"])))
  ),
  saveDrawing: (data) =>
    pipe(
      api,
      snag(() => NotFoundError),
      then(console.log)
    )({ method: "POST", data }),
}
