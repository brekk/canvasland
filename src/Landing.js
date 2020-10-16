import React, { useEffect, useRef, useState } from "react"
import {
last,
propOr,
map,
  identity,
  memoizeWith,
  uniqBy,
  find,
  pipe,
  toPairs,
  sortBy,
  groupBy,
  pathOr,
  values,
  toLower,
} from "ramda"
import { trace } from "xtrace"
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

const updateLocal = (key, what) => {
  if (!window) return
  const payload = what && typeof what === "object" ? JSON.stringify(what) : what
  const existing = window.localStorage.getItem(key)
  const extant = existing && JSON.parse(existing)
  if (extant.length > 0) {
    const newPayload = JSON.stringify(extant.concat(what))
    window.localStorage.setItem(key, newPayload)
  } else {
    window.localStorage.setItem(key, payload)
  }
}
const mParseInt = memoizeWith(x => x)(parseInt)
const Landing = () => {
  const rawPoints = pipe(useCurrentRoute, pathOr({}, ["data"]), values)()
  // by convention we use a $ prefix for state related values
  const [$color, setColor] = useState(randomColor())
  const [$stroke, setStroke] = useState(35)
  const [$opacity, setOpacity] = useState(100)
  const [$lastPress, setLastPress] = useState(Date.now() - 1000)
  const [$points, setRawPoints] = useState(rawPoints)
  const [$allPoints, setAllPoints] = useState($points)
  const [$lastGesture, setLastGesture] = useState([])
  const [$pressing, setPressing] = useState(false)
  const [$context, setContext] = useState(false)
  const setPoints = throttle(20, setRawPoints)
  const addPoint = (point) => {
    setPoints($points.concat(point))
    setAllPoints($allPoints.concat(point))
  }
  const makePointFromEvent = (e) => ({
    x: e.nativeEvent.offsetX,
    y: e.nativeEvent.offsetY,
    time: $lastPress,
    offset: Math.abs($lastPress - Date.now()),
    stroke: $stroke,
    color: $color,
    opacity: $opacity,
  })
  const controlProps = {
    color: $color,
    opacity: $opacity,
    stroke: $stroke,
    setColor: setColor,
    setOpacity: setOpacity,
    setStroke: setStroke,
    context: $context,
    lastGesture: $lastGesture,
    lastPress: $lastPress,
    allPoints: $allPoints,
    setAllPoints
  }
  const onMouseMove = (e) => {
    e.preventDefault()
    if ($pressing) {
      const point = makePointFromEvent(e)
      addPoint(point)
    }
  }
  const onMouseDown = (e) => {
    e.preventDefault()
    setPressing(true)
    setLastPress(Date.now())
    const point = makePointFromEvent(e)
    addPoint(point)
  }
  const onMouseUp = (e) => {
    e.preventDefault()
    // offload drawn points to localStorage
    updateLocal("points", $points)
    console.log('points', $points.length)
const lastGestureFromAllPoints = pipe(
      groupBy(propOr(-1, 'time')),
      toPairs,
      last,
      propOr([], 1)
    )
    setLastGesture(lastGestureFromAllPoints($allPoints))
    setPressing(false)
    setPoints([])
  }
  const draw = (ctx) => {
    if ($context !== ctx) {
      setContext(ctx)
    }
    if ($points.length) {
      ctx.lineWidth = $stroke
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.strokeStyle = toRGBA($color, $opacity)
      ctx.beginPath()
      $points.forEach((yy, i) => {
        if (yy.color || yy.stroke || yy.opacity) {
          ctx.stroke()
          ctx.closePath()
        }
        if (yy.color && yy.color !== $color && toRGBA(yy.color, yy.opacity) !== $color) {
          ctx.strokeStyle = toRGBA(yy.color, yy.opacity || $opacity)
        }
        if (yy.stroke && yy.stroke !== $stroke) {
          ctx.lineWidth = yy.stroke
        }
        if (yy.color || yy.stroke || yy.opacity) {
          ctx.beginPath()
        }
        ctx.moveTo(yy.x, yy.y)
        ctx.lineTo(yy.x, yy.y)
        const zz = $points[i + 1]
        if (zz && Math.abs(zz.time - yy.time) < 500) {
          ctx.lineTo(zz.x, zz.y)
        }
      })
      ctx.stroke()
    }
  }
  useEffect(() => {
    window.localStorage.setItem("points", [])
  }, [])

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
