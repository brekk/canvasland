import React from "react"
import PropTypes from "prop-types"
import blem from "blem"
import { pathOr, pipe } from "ramda"
// import { useConfiguration } from "./useConfiguration"

const bem = blem("ControlPanel")

// const delegateTo = ({fn, name, as}) => (e) => {
//   e.preventDefault()
//   const val = e.target.value
//   fn(as === Number ? parseInt(val) : val)
// }

const targValueOrX = (x) => pathOr(x, ["target", "value"])

const ControlPanel = ({
    stroke,
    color,
    opacity,
    setStroke,
    setColor,
    setOpacity,
  }) => (
    <form className={bem()}>
      <div className={bem("field")}>
        <label className={bem("label", "stroke")} htmlFor="stroke">
          Stroke
        </label>
        <input
          className={bem("input", "stroke")}
          id="stroke"
          type="range"
          min="1"
          max="100"
          step="10"
          value={stroke}
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
          value={color}
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
          min="1"
          step="10"
          max="100"
          value={opacity}
          onChange={pipe(pathOr(10, ["target", "value"]), parseInt, setOpacity)}
        />
      </div>
    </form>
  )

ControlPanel.propTypes = {
  stroke: PropTypes.number,
  color: PropTypes.string,
  opacity: PropTypes.number,
  setStroke: PropTypes.func,
  setColor: PropTypes.func,
  setOpacity: PropTypes.func,
}

export default ControlPanel
