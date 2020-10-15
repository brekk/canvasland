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
  const [points, setPoints] = useState([])
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
      const current = canvasRef.current
      const {clientWidth: w, clientHeight: h, offsetLeft: l, offsetTop: t} = current
      const rect = current.getBoundingClientRect()
      const point = {
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY
      }
      if (point.x && point.y && point.x !== x && point.y !== y) {
          setX(point.x)
          setY(point.y)
          setPoints(points.concat([
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
      console.log('up', {x, y}, "chunk!", activePoints.length, 'points', points.length)
      setPressing(false)
      setX(-1)
      setY(-1)
      // setPoints(points.concat(activePoints))
      // setActivePoints([])
      setPoints([])
    }
  }
  useEffect(() => {
    if (canvasRef.current && points.length) {
      const ctx = canvasRef.current.getContext('2d')
      ctx.lineWidth = 2
      ctx.strokeStyle = 'red'
      const first = head(points)
      if (first) {
        const rest = tail(points)
        if (rest.length) {
          ctx.beginPath()
          rest.forEach((zz, i) => {
            const yy = rest[i - 1]
            if (yy && distance(yy, zz) < 50) {
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
