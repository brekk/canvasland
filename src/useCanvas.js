import { useRef, useState, useEffect } from "react"
const DEFAULT_OPTIONS = {
  context: "2d",
  animate: false,
}
const useCanvas = (draw, options = DEFAULT_OPTIONS) => {
  const canvasRef = useRef(null)
  const [$id, setId] = useState(-1)
  const [$frame, setFrame] = useState(0)
  const { animate, context: ctx } = options
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext(ctx)
    const render = () => {
      draw(context)
      // setFrame($frame + 1)
      // if (animate) {
      //   setId(window.requestAnimationFrame(render))
      // }
    }
    render()
    return () => {
      // if (animate) {
      //   window.cancelAnimationFrame($id)
      // }
    }
  }, [draw, $id, ctx])
  return canvasRef
}
export default useCanvas
