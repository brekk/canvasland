import React from "react"
import PropTypes from "prop-types"
import blem from "blem"
import { merge, pathOr, pipe } from "ramda"
import {toRGBA} from './utils'

const bem = blem("ControlPanel")

const ControlPanel = ({
  stroke: $stroke,
  color: $color,
  opacity: $opacity,
  setStroke,
  setColor,
  setOpacity,
  context: $context,
  points: $points,
  lastPress: $lastPress,
  lastGesture: $lastGesture,
  setPoints
}) => {

  const draw = (ctx, points, override = {}) => {
    if (ctx && points.length) {
      ctx.lineWidth = $stroke
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.strokeStyle = toRGBA($color, $opacity)
      ctx.beginPath()
      points.forEach((xx, i) => {
        const yy = merge(xx, override)
        if (yy.color || yy.stroke || yy.opacity) {
          ctx.stroke()
          ctx.closePath()
        }
        if (yy.color && yy.color !== $color) {
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
        const zz = points[i + 1]
        if (zz && Math.abs(zz.time - yy.time) < 500) {
          ctx.lineTo(zz.x, zz.y)
        }
      })
      ctx.stroke()
    }
  }
return(
  <form className={bem()}>
    <div className={bem("field")}>
      <label className={bem("label", "stroke")} htmlFor="stroke">
        Stroke
      </label>
      <input
        className={bem("input", "stroke")}
        id="stroke"
        type="range"
        min="5"
        max="100"
        step="5"
        value={$stroke}
        onChange={pipe(pathOr(10, ["target", "value"]), parseInt, setStroke)}
      />
    </div>
    <div className={bem("field")}>
      <label htmlFor="stroke" className={bem("label", "color")}>
        Color
      </label>
      <input
        className={bem("input", "color")}
        id="color"
        type="color"
        value={$color}
        onChange={pipe(pathOr("#000000", ["target", "value"]), setColor)}
      />
    </div>
    <div className={bem("field")}>
      <label htmlFor="opacity" className={bem("label", "color")}>
        Opacity
      </label>
      <input
        className={bem("input", "opacity")}
        id="opacity"
        type="range"
        min="5"
        step="5"
        max="100"
        value={$opacity}
        onChange={pipe(pathOr(10, ["target", "value"]), parseInt, setOpacity)}
      />
    </div>
    <div className={bem("field")}>
      <button className={bem('button', 'undo')} onClick={e => {
        e.preventDefault()
        console.log("RAWR", $lastGesture)
        if ($lastGesture.length) {
            draw($context, $lastGesture, {color: '#888'})
            // setPoints($points.filter(({time}) => time < $lastPress))
        }
      }}>Undo</button>
      <button className={bem('button', 'reset')} onClick={e => {
        e.preventDefault()
        if ($context) {
          $context.clearRect(0, 0, 800, 600)
        }
      }}>Reset</button> 
    </div>
  </form>
)}

ControlPanel.propTypes = {
  stroke: PropTypes.number,
  color: PropTypes.string,
  opacity: PropTypes.number,
  setStroke: PropTypes.func,
  setColor: PropTypes.func,
  setOpacity: PropTypes.func,
}

export default ControlPanel
