import { map, pipe, curry, defaultTo, merge, prop } from "ramda"
import { NotFoundError } from "navi"
import * as E from 'ensorcel/ensorcel.js'
import {trace} from 'xtrace'
import axios from 'axios'
const config = require('./config')

const BACKEND = 'http://' + config.BACKEND.DOMAIN + ':' + config.BACKEND.PORT
const api = pipe(
  merge({url: BACKEND, method: 'get'}),
  axios
)

api({data: {id: 'hat'}}).catch(console.warn).then(console.log)

const defaultify = pipe(
  defaultTo({}),
  merge({ title: "Untitled", points: [], color: "#888", opacity: 1 })
)

const db = map(defaultify, {
  hat: {
    title: "Hat",
    color: "#d9def4",
  },
  bat: {
  title: "Bat",
  color: "#f60"
  },
  rat: {
    title: "Rat",
    color: "#ff0"
  }
})

const then = curry((fn, thenable) => thenable.then(fn))
const snag = curry((fn, thenable) => thenable.catch(fn))

export default {
  fetchDrawing: id => pipe(
    api,

    then(pipe(prop('data'), map(defaultify)))
  )({data: {id}}),
  fetchAllDrawings: id => api({data: {id}})
}

