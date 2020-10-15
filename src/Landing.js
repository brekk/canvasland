import React, {useEffect, useRef, useState} from "react"
import {last, head, tail, pipe, pathOr, values, toLower} from 'ramda'
import { Link, useCurrentRoute } from "react-navi"
import {trace} from 'xtrace'
import {debounce} from 'throttle-debounce'

const distance = (aa, bb) => Math.sqrt(
  Math.pow(bb.x - aa.x, 2),
  Math.pow(bb.y - aa.y, 2)
)

const Landing = () => {
  const canvasRef = useRef()
  const [$x, setX] = useState(-1)
  const [$y, setY] = useState(-1)
  const [$lastPress, setLastPress] = useState(Date.now() - 1000)
  const [$color, setColor] = useState('#000000')
  const [$stroke, setStroke] = useState(4)
  const [$points, setPoints] = useState([])
  const [$pressing, setPressing] = useState(false)
  const [$frameId, setFrameId] = useState(-1)
  // useCurrentRoute returns the lastest loaded Route object
  const drawings = pipe(
    useCurrentRoute,
    pathOr({}, ['data']),
    values
  )()
  const onMouseMove = e => {
    if (canvasRef.current && $pressing) {
      const current = canvasRef.current
      const {clientWidth: w, clientHeight: h, offsetLeft: l, offsetTop: t} = current
      const point = {
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY
      }
      if (point.x && point.y && point.x !== $x && point.y !== $y) {
          setX(point.x)
          setY(point.y)
          setPoints($points.concat([
            point 
          ]))
      }
    }
  }
  const onMouseDown = e => {
    e.preventDefault()
    if (canvasRef.current) {
      console.log('down')
      setPressing(true)
    }
  }
  const onMouseUp = e => {
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
      const ctx = canvasRef.current.getContext('2d')
      ctx.lineWidth = $stroke
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.strokeStyle = $color
      // const first = head($points)
      // const rest = tail($points)
      // if (rest.length) {
        $points.forEach((zz, i) => {
          const yy = $points[i - 1]
          ctx.beginPath()
          if (yy) {
            const timeLapsed = Math.round(Math.abs($lastPress - Date.now()) / 1000)
            if (timeLapsed > 1 || distance(yy, zz) < 40) {
              ctx.moveTo(yy.x, yy.y) 
            }
          }
          ctx.lineTo(zz.x, zz.y)
          ctx.stroke()
        })
      // }
    }
    return () => {}
  }, [$pressing, $points, canvasRef])
  return (
    <>
    <ul>
      {drawings.map(({title, color}) => (
        <li key={title}>
          <div style={{backgroundColor: color}}>
            <Link href={`/stats/${toLower(title)}`}>{title}</Link>
          </div>
        </li>
      ))}
    </ul>
    <form>
    <input type="range" min="1" max="50" value={$stroke} onChange={e => {
      e.preventDefault()
      setStroke(e.target.value)
    }}/>
    <input type="color" value={$color} onChange={e => {
      e.preventDefault()
      setColor(e.target.value)
    }}/>
    </form>
    <canvas height="600" width="800" ref={canvasRef}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onMouseOut={onMouseUp}
      style={{
        display: 'block',
        border: '1px solid black',
        margin: '1rem'
      }}
    />
    </>
  )
}

export default Landing
