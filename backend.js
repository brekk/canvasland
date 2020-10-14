const path = require('path')
const {trace} = require('xtrace')
const T = require('torpor')
const {curryN, pathOr, when, assocPath, pipe, __, map} = require('ramda')
const {fork, chain} = require('fluture')
const express = require('express')
const cors = require('cors')
const CONFIG = require('./config')


const app = express()
app.use(cors({
  origin: true,
  credentials: true
}))

const here = x => path.resolve(__dirname, x)
const PATHS = map(here, CONFIG.STORAGE)


const onLoad = () => {
  const oldThoughts = T.readFile(PATHS.BRAIN)
  const newThoughts = T.writeFile(PATHS.BACKUP, __, 'utf8')
  pipe(
    oldThoughts,
    map(trace('copying old state out')),
    chain(newThoughts),
    fork(trace('error on load'))(trace('data loaded...'))
  )('utf8')
}

const server = app.listen(CONFIG.BACKEND.PORT, onLoad)
const j2 = x => JSON.stringify(x, null, 2)

const onUnload = () => {
  const oldThoughts = T.readFile(PATHS.BRAIN)
  const newThoughts = T.writeFile(PATHS.BRAIN, __, 'utf8')
  pipe(
    oldThoughts,
    map(pipe(
      trace('saving state on exit...'),
      JSON.parse,
      assocPath(['meta', 'modified'], (new Date()).toString()),
      j2
    )),
    chain(newThoughts),
    fork(e => {
      trace('error on exit', e)
      process.exit(1)
    })(x => {
      trace('data saved...', x)
      // kill connection
      server.close(() => {
        process.exit(0)
      })
      // force kill connection
      setTimeout(() => process.exit(2), 5e3)
    })
  )('utf8')
}

process.on('SIGTERM', onUnload);
process.on('SIGINT', onUnload);

const select = curryN(2, (id, raw) => pathOr({error: 'MISSING DATA'}, ['data', id], raw))

const head204 = (req, res) => {
  res.sendStatus(204);
}

app.head("/", head204);
app.get("/",  (req, res, next) => {
  pipe(
    map(JSON.parse),
    fork(next)(x => res.json(x))
  )(require('./backend-data'))
});
app.post("/",  (req, res) => {
  res.json({
    text: "Simple CORS requests are working. [POST]"
  });
});

app.head('/:id', head204)

app.get('/:id',  (req, res, next) => {
  pipe(
    map(JSON.parse),
    map(select(req.params.id)),
    fork(next)(x => res.json(x))
  )(require('./backend-data'))
})

app.post('/:id',  (req, res, next) => {
  console.log("req", req, "res", res)
  res.json({text: "saved?"})
  // T.writeFile('./backend-data', 'utf8', req.data)
})

