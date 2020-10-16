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
import { toRGBA, randomColor } from "./utils"

const bem = blem("App")

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
  const [$color, setColor] = useState(randomColor())
  const [$stroke, setStroke] = useState(Math.round(Math.random() * 100))
  const [$opacity, setOpacity] = useState(100)
  const [$lastPress, setLastPress] = useState(Date.now() - 1000)
  const [$points, setRawPoints] = useState([])
  const [$pressing, setPressing] = useState(false)
  const setPoints = throttle(20, setRawPoints)
  const addPoint = (point) => {
    setPoints($points.concat(point))
  }
  const makePointFromEvent = (e, time) => ({
    x: e.nativeEvent.offsetX,
    y: e.nativeEvent.offsetY,
    time,
  })
  const controlProps = {
    color: $color,
    opacity: $opacity,
    stroke: $stroke,
    setColor: setColor,
    setOpacity: setOpacity,
    setStroke: setStroke,
  }
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
      console.log($color, "@#>>@>@", ctx.strokeStyle)
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

  return (
    <div className={bem()}>
      <Canvas
        height="600"
        width="800"
        className={bem("canvas")}
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
