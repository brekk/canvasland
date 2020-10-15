import React, { useEffect, useRef, useState } from "react"
import {
  identity,
  memoizeWith,
  uniqBy,
  find,
  pipe,
  pathOr,
  values,
  toLower,
} from "ramda"
import { Link, useCurrentRoute } from "react-navi"
import { throttle } from "throttle-debounce"
import blem from "blem"
import Canvas from "./Canvas"
import ControlPanel from "./ControlPanel"

const bem = blem("App")

const distance = (aa, bb) =>
  Math.sqrt(Math.pow(bb.x - aa.x, 2), Math.pow(bb.y - aa.y, 2))

const randomColor = () =>
  "#" + Math.floor(Math.random() * Math.pow(2, 24)).toString(16)

const toRGBA = (hex, opacity) => {
  const color = parseInt(!hex.startsWith("#") ? hex : hex.slice(1), 16)
  const r = color >> 16
  const g = (color >> 8) & 0xff
  const b = color & 0xff
  const a = (Math.max(1, opacity) / 100).toFixed(2)
  const out = `rgba(${r}, ${g}, ${b}, ${a})`
  return out
}
const pointMemo = ({ x, y }) => `${x}-${y}`
const memoizeByPoint = memoizeWith(pointMemo)

const delegateTo = (fn) => (e) => {
  e.preventDefault()
  fn(e.target.value)
}

/*
  const drawings = pipe(useCurrentRoute, pathOr({}, ["data"]), values)()
  <ul>
    {drawings.map(({ title, color }) => (
      <li key={title}>
        <div style={{ backgroundColor: color }}>
          <Link href={`/stats/${toLower(title)}`}>{title}</Link>
        </div>
      </li>
    ))}
  </ul>
  */

const Landing = () => {
  // by convention we use a $ prefix for state related values
  const [$lastPress, setLastPress] = useState(Date.now() - 1000)
  const [$color, setColor] = useState(randomColor())
  const [$stroke, setStroke] = useState(Math.round(Math.random() * 100))
  const [$opacity, setOpacity] = useState(100)
  const [$points, setRawPoints] = useState([])
  const [$pressing, setPressing] = useState(false)
  const setPoints = throttle(20, setRawPoints)
  const addPoint = (point) => {
    setPoints($points.concat(point))
  }
  const makePointFromEvent = (e, time) => ({
    x: e.nativeEvent.offsetX,
    y: e.nativeEvent.offsetY,
    time
  })
  const onMouseMove = (e) => {
    e.preventDefault()
    if ($pressing) {
      const point = makePointFromEvent(e)
      addPoint(point, $lastPress)
    }
  }
  const onMouseDown = (e) => {
    e.preventDefault()
    setPressing(true)
    const point = makePointFromEvent(e)
    addPoint(point, $lastPress)
  }
  const onMouseUp = (e) => {
    e.preventDefault()
    setPressing(false)
    setPoints([])
    setLastPress(Date.now())
  }
  const draw = (ctx) => {
    if ($points.length) {
      ctx.lineWidth = $stroke
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.strokeStyle = toRGBA($color, $opacity)
      ctx.beginPath()
      $points.forEach((yy, i) => {
        ctx.moveTo(yy.x, yy.y)
        ctx.lineTo(yy.x, yy.y)
        const zz = $points[i + 1]
        if (zz) {
          ctx.lineTo(zz.x, zz.y)
        }
      })
      ctx.stroke()
    }
  }
  const controlProps = {
    color: $color,
    opacity: $opacity,
    stroke: $stroke,
    setColor: setColor,
    setOpacity: setOpacity,
    setStroke: setStroke,
  }

  return (
    <div className={bem()}>
      <Canvas
        height="600"
        width="800"
        className={bem('canvas')}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onMouseOut={onMouseUp}
        draw={draw}
      />
      <ControlPanel {...controlProps} />
    </div>
  )
}

export default Landing
