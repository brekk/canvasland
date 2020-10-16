import { useState, useEffect } from "react"
import { once } from "ramda"
import { randomColor } from "./utils"

const CONSTANTS = {
  LIMITS: {
    OPACITY: 100,
    STROKE: 50,
  },
}

export function useConfiguration() {
  const [$opacity, setOpacity] = useState(100)
  const [$stroke, setStroke] = useState(50)
  const [$color, setColor] = useState("#000000")
  const injectables = {
    opacity: $opacity,
    stroke: $stroke,
    color: $color,
    setOpacity,
    setStroke,
    setColor,
  }
  console.log("using configuration", injectables)
  return injectables
}

export default useConfiguration
