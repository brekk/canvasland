import React from "react"
import {pipe, pathOr, values, toLower} from 'ramda'
import { Link, useCurrentRoute } from "react-navi"
import {trace} from 'xtrace'

const Landing = () => {
  // useCurrentRoute returns the lastest loaded Route object
  const drawings = pipe(
    useCurrentRoute,
    trace('yo'),
    pathOr({}, ['data', 'data', 'data']),
    values
  )()
  console.log('drawings', drawings)
  return (
    <ul>
      {drawings.map(({title}) => (
        <li key={title}>
          <Link href={`/stats/${toLower(title)}`}>{title}</Link>
        </li>
      ))}
    </ul>
  )
}

export default Landing
