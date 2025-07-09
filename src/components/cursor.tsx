// src/components/cursor.tsx
import { useEffect, useState } from 'react'

export default function Cursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    document.addEventListener('mousemove', move)
    return () => document.removeEventListener('mousemove', move)
  }, [])

  useEffect(() => {
    const addHover = () => setHovering(true)
    const removeHover = () => setHovering(false)
    const elems = document.querySelectorAll('a, button, input, textarea')
    elems.forEach(el => {
      el.addEventListener('mouseenter', addHover)
      el.addEventListener('mouseleave', removeHover)
    })
    return () => {
      elems.forEach(el => {
        el.removeEventListener('mouseenter', addHover)
        el.removeEventListener('mouseleave', removeHover)
      })
    }
  }, [])

  return (
    <div
      className={`fixed pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-50 ${
        hovering ? 'cursor-hover' : 'cursor-default'
      }`}
      style={{ left: position.x, top: position.y }}
    />
  )
}