import React, {useEffect, useRef, useState} from "react"
import {head, tail, pipe, pathOr, values, toLower} from 'ramda'
import { Link, useCurrentRoute } from "react-navi"
import {trace} from 'xtrace'
import {debounce} from 'throttle-debounce'

const Landing = () => {
  const canvasRef = useRef()
  const [points, setPoints] = useState([
    {x: 400, y: 400}
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
      console.log('canvas', canvasRef.current, e.clientX, '..', e.clientY, Object.keys(e))
      const w = canvasRef.current.width
      const h = canvasRef.current.height
      const point = {
        x: Math.round(Math.abs(e.clientX - w)),
        y: Math.round(Math.abs(e.clientY - h))
      }
      if (point.x && point.y) {
      console.log("point!", point)
      setActivePoints(activePoints.concat([
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
      console.log('up')
      setPressing(false)
      setPoints(points.concat(activePoints))
    }
  }
  useEffect(() => {
    if (canvasRef.current && points.length) {
      const ctx = canvasRef.current.getContext('2d')
      ctx.lineWidth = 1
      ctx.strokeStyle = 'red'
      const first = head(points)
      if (first) {
        ctx.moveTo(first.x, first.y)
        const rest = tail(points)
        if (rest.length) {
          rest.forEach(({x, y}, i) => {
            ctx.lineTo(x, y)
            if (i === rest.length - 1) {
              ctx.stroke()
            }
          })
        }
      }
    }
    return () => {}
  }, [pressing, activePoints, points, canvasRef])
  console.log('points', points)
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
    <canvas ref={canvasRef} style={{
      width: '100%',
      height: '100%',
      minWidth: '800px',
      minHeight: '600px',
      bottom: 0,
      left: 0,
      top: 0,
      right: 0,
      position: 'relative',
      display: 'block'
    }} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseMove={onMouseMove}/>
    </>
  )
}

export default Landing
