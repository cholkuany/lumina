import { useState, useCallback } from "react"

export const useZoom = ({ scale = 1.75 }: { scale: number }) => {
  const [isZoomed, setIsZoomed] = useState(false)
  const [origin, setOrigin] = useState({ x: 50, y: 50 })

  const toggle = useCallback(() => setIsZoomed((z) => !z), [])
  const reset = useCallback(() => setIsZoomed(false), [])

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setOrigin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }, [])

  const imageStyle = {
    transform: isZoomed ? `scale(${scale})` : undefined,
    transformOrigin: `${origin.x}% ${origin.y}%`,
  }

  return {
    isZoomed,
    reset,
    toggle,
    containerProps: { onMouseMove, onMouseLeave: reset },
    imageStyle,
  }
}