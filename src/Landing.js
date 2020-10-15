import React, { useEffect, useRef, useState } from "react"
import { identity, memoizeWith, uniqBy, find, pipe, pathOr, values, toLower } from "ramda"
import { Link, useCurrentRoute } from "react-navi"
// import { trace } from "xtrace"
import { throttle } from "throttle-debounce"
import raf from 'raf'

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
const pointMemo = ({x, y}) => `${x}-${y}`
const memoizeByPoint = memoizeWith(pointMemo)
const pointFind = memoizeByPoint(find)

const delegateTo = (fn) => (e) => {
  e.preventDefault()
  fn(e.target.value)
}

const Landing = () => {
  const canvasRef = useRef()
  // const [$x, setX] = useState(-1)
  // const [$y, setY] = useState(-1)
  const [$lastPress, setLastPress] = useState(Date.now() - 1000)
  // const [$recording, setRecording] = useState($lastPress)
  const [$color, setColor] = useState(randomColor())
  const [$stroke, setStroke] = useState(Math.round(Math.random() * 100))
  const [$opacity, setOpacity] = useState(100)
  const [$points, setRawPoints] = useState([])
  const [$pressing, setPressing] = useState(false)
  // const [$replayInterval, setReplayInterval] = useState(-1)
  const [$renderInterval, setRenderInterval] = useState(-1)
  const setPoints = throttle(20, setRawPoints)
  const addPoint = (point) => {
    setPoints($points.concat(point))
  }
  const drawings = pipe(useCurrentRoute, pathOr({}, ["data"]), values)()
  const makePointFromEvent = (e) => ({
    x: e.nativeEvent.offsetX,
    y: e.nativeEvent.offsetY,
  })
  const onMouseMove = (e) => {
    e.preventDefault()
    if (canvasRef.current && $pressing) {
      // clearTimeout($pressInterval)
      const point = makePointFromEvent(e)
      addPoint(point)
    }
  }
  const onMouseDown = (e) => {
    e.preventDefault()
    if (canvasRef.current) {
      setPressing(true)
      const point = makePointFromEvent(e)
      addPoint(point)
    }
  }
  const onMouseUp = (e) => {
    e.preventDefault()
    if (canvasRef.current) {
      setPressing(false)
      setPoints([])
      setLastPress(Date.now())
    }
  }
  useEffect(() => {
    if (canvasRef.current && $points.length) {
      const ctx = canvasRef.current.getContext("2d")
      ctx.lineWidth = $stroke
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.strokeStyle = toRGBA($color, $opacity)
      ctx.beginPath()
      const uniqPoints = uniqBy(identity, $points)
      uniqPoints.forEach((yy, i) => {
        ctx.moveTo(yy.x, yy.y)
        ctx.lineTo(yy.x, yy.y)
        const zz = $points[i + 1]
        if (zz) {
          ctx.lineTo(zz.x, zz.y)
        }
      })
      ctx.stroke()
      // console.log('rendered', $points.length, 'segments')
      // setRenderInterval(raf(renderCanvas))
    }
    return () => {
      // clearInterval($renderInterval)
    }
  }, [$opacity, $color, $lastPress, $stroke, $pressing, $points, canvasRef])
  return (
    <>
      <ul>
        {drawings.map(({ title, color }) => (
          <li key={title}>
            <div style={{ backgroundColor: color }}>
              <Link href={`/stats/${toLower(title)}`}>{title}</Link>
            </div>
          </li>
        ))}
      </ul>
      <form>
        <input
          type="range"
          min="1"
          max="50"
          value={$stroke}
          onChange={delegateTo(setStroke)}
        />
        <input type="color" value={$color} onChange={delegateTo(setColor)} />
        <input
          type="range"
          min="1"
          max="100"
          value={$opacity}
          onChange={delegateTo(setOpacity)}
        />
      </form>
      <canvas
        height="600"
        width="800"
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onMouseOut={onMouseUp}
        style={{
          display: "block",
          border: "1px solid black",
          margin: "1rem",
        }}
      />
    </>
  )
}

export default Landing
