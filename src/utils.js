import { Children, cloneElement } from "react"
import { curry, ifElse, pipe, length, equals, head, map } from "ramda"
export const distance = (aa, bb) =>
  Math.sqrt(Math.pow(bb.x - aa.x, 2), Math.pow(bb.y - aa.y, 2))

export const randomColor = () =>
  "#" + Math.floor(Math.random() * Math.pow(2, 24)).toString(16)

export const toRGBA = (hex, opacity) => {
  const color = parseInt(!hex.startsWith("#") ? hex : hex.slice(1), 16)
  const r = color >> 16
  const g = (color >> 8) & 0xff
  const b = color & 0xff
  const a = (Math.max(1, opacity) / 100).toFixed(2)
  const out = `rgba(${r}, ${g}, ${b}, ${a})`
  return out
}

export const injectChildren = curry((data, children) =>
  pipe(
    Children.toArray,
    ifElse(
      pipe(length, equals(1)),
      pipe(head, (aa) => cloneElement(aa, data)),
      map((el) => cloneElement(el, data))
    )
  )(children)
)
