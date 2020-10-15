import React from "react"
import PropTypes from "prop-types"
import blem from "blem"

const bem = blem("ControlPanel")

const delegateTo = (fn) => (e) => {
  e.preventDefault()
  fn(e.target.value)
}

const ControlPanel = ({
  stroke,
  setStroke,
  color,
  setColor,
  opacity,
  setOpacity,
}) => (
  <form className={bem()}>
      <div className={bem('field')}>
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
        onChange={delegateTo(setStroke)}
      />
      </div>
      <div className={bem('field')}>
      <label htmlFor="stroke" className={bem("label", "color")}>
        Color
      </label>
      <input
        className={bem("input", "color")}
        id="color"
        type="color"
        value={color}
        onChange={delegateTo(setColor)}
      />
      </div>
      <div className={bem('field')}>
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
        onChange={delegateTo(setOpacity)}
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
