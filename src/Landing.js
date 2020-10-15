import React, { useEffect, useRef, useState } from "react"
import { pipe, pathOr, values, toLower } from "ramda"
import { Link, useCurrentRoute } from "react-navi"
// import { trace } from "xtrace"
// import { debounce } from "throttle-debounce"

const distance = (aa, bb) =>
  Math.sqrt(Math.pow(bb.x - aa.x, 2), Math.pow(bb.y - aa.y, 2))

const randomColor = () =>
  "#" + Math.floor(Math.random() * Math.pow(2, 24)).toString(16)

const Landing = () => {
  const canvasRef = useRef()
  const [$x, setX] = useState(-1)
  const [$y, setY] = useState(-1)
  const [$lastPress, setLastPress] = useState(Date.now() - 1000)
  const [$color, setColor] = useState(randomColor())
  const [$stroke, setStroke] = useState(Math.round(Math.random() * 100))
  const [$points, setPoints] = useState([])
  const [$pressing, setPressing] = useState(false)
  const [$frameId, setFrameId] = useState(-1)
  const drawings = pipe(useCurrentRoute, pathOr({}, ["data"]), values)()
  const onMouseMove = (e) => {
    if (canvasRef.current && $pressing) {
      const point = {
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY,
      }
      if (point.x && point.y && point.x !== $x && point.y !== $y) {
        setX(point.x)
        setY(point.y)
        setPoints($points.concat([point]))
        setLastPress(Date.now())
      }
    }
  }
  const onMouseDown = (e) => {
    e.preventDefault()
    if (canvasRef.current) {
      console.log("down")
      setPressing(true)
    }
  }
  const onMouseUp = (e) => {
    e.preventDefault()
    if (canvasRef.current) {
      setPressing(false)
      setX(-1)
      setY(-1)
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
      ctx.strokeStyle = $color
      $points.forEach((zz, i) => {
        const yy = $points[i - 1]
        ctx.beginPath()
        if (yy) {
          const timeLapsed = Math.round(
            Math.abs($lastPress - Date.now()) / 2000
          ) * 2
          if (timeLapsed > 1 || distance(yy, zz) < 100) {
            ctx.moveTo(yy.x, yy.y)
          }
        }
        ctx.lineTo(zz.x, zz.y)
        ctx.stroke()
      })
    }
    return () => {}
  }, [$color, $lastPress, $stroke, $pressing, $points, canvasRef])
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
          max="100"
          value={$stroke}
          onChange={(e) => {
            e.preventDefault()
            setStroke(e.target.value)
          }}
        />
        <input
          type="color"
          value={$color}
          onChange={(e) => {
            e.preventDefault()
            setColor(e.target.value)
          }}
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
