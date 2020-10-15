import { useRef, useState, useEffect } from "react"
const DEFAULT_OPTIONS = {
  context: "2d",
  animate: false,
}
const useCanvas = (draw, options = DEFAULT_OPTIONS) => {
  const canvasRef = useRef(null)
  const [$id, setId] = useState(-1)
  const [$frame, setFrame] = useState(0)
  const relevant = options.animate ? [draw, $frame, $id] : [draw, $id]
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext(options.context)
    const render = () => {
      draw(context, $frame)
      setFrame($frame + 1)
      if (options.animate) {
        setId(window.requestAnimationFrame(render))
      }
    }
    render()
    return () => {
      if (options.animate) {
        window.cancelAnimationFrame($id)
      }
    }
  }, relevant)
  return canvasRef
}
export default useCanvas
