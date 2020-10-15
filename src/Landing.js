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
  const [x, setX] = useState(-1)
  const [y, setY] = useState(-1)
  const [points, setPoints] = useState([
  ])
  const [activePoints, setActivePoints] = useState(points)
  const [pressing, setPressing] = useState(false)
  const [frameId, setFrameId] = useState(-1)
  // useCurrentRoute returns the lastest loaded Route object
  const drawings = pipe(
    useCurrentRoute,
    pathOr({}, ['data']),
    values
  )()
  const onMouseMove = e => {
    if (canvasRef.current && pressing) {
      console.log("ref", canvasRef.current)
      const current = canvasRef.current
      const {clientWidth: w, clientHeight: h, offsetLeft: l, offsetTop: t} = current
      const rect = current.getBoundingClientRect()
      console.log("wrecked", rect)
      const point = {
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY
      }
      console.log("W", w, "H", h, "L", l, "T", t, "POINT", point)
      if (point.x && point.y) {
        console.log("point!", point)
        // this is a fun permutation
        // if (distance({x,y}, point) > 100) {
        if (x && y && Math.abs(x - point.x) > 20 && Math.abs(y - point.y) > 20){
          setX(point.x)
          setY(point.y)
          setActivePoints(activePoints.concat([
            point 
          ]))
        }
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
      console.log('up', {x, y}, "chunk!", activePoints.length, 'points', points.length)
      setPressing(false)
      setX(-1)
      setY(-1)
      setPoints(points.concat(activePoints))
      setActivePoints([])
    }
  }
  useEffect(() => {
    if (canvasRef.current && points.length) {
      const ctx = canvasRef.current.getContext('2d')
      ctx.lineWidth = 2
      ctx.strokeStyle = 'red'
      const first = head(points)
      if (first) {
        ctx.beginPath()
        // ctx.moveTo(first.x, first.y)
        const rest = tail(points)
        if (rest.length) {
          rest.forEach((zz, i) => {
            const yy = rest[i - 1]
            if (yy) {
              ctx.moveTo(yy.x, yy.y)
            }
            ctx.lineTo(zz.x, zz.y)
            ctx.stroke()
          })
        }
      }
    }
    return () => {}
  }, [pressing, activePoints, points, canvasRef])
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
    <canvas height="600" width="800" ref={canvasRef} style={{
      // width: '100%',
      // height: '100%',
      display: 'block',
      border: '1px solid black',
      margin: '1rem'
    }} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseMove={onMouseMove} onMouseOut={onMouseUp}/>
    </>
  )
}

export default Landing
