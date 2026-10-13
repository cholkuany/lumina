import { useEffect, useRef, useState } from 'react'

export function useScrollButtonsStates(
  itemCount: number,
) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true)
  const [isAtEnd, setIsAtEnd] = useState(false)


  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    const update = () => {
      setIsAtStart(el.scrollLeft <= 0)
      setIsAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1)
    }

    update()
    el.addEventListener('scroll', update, { passive: true })

    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(el)

    return () => {
      el.removeEventListener('scroll', update)
      resizeObserver.disconnect()
    }
  }, [itemCount])

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return { isAtStart, isAtEnd, scrollBy, trackRef }
}