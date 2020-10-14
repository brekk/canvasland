const {map,pipe } = require('ramda')
const ice = Object.freeze

const shallowFreeze = pipe(map(ice), ice)

module.exports = shallowFreeze({
  FRONTEND: {
    DOMAIN: 'localhost',
    PORT: 3000
  },
  BACKEND: {
    DOMAIN: 'localhost',
    PORT: 3001
  },
  STORAGE: {
    BRAIN: 'state.json',
    BACKUP: 'old-state.json'
  }
})
