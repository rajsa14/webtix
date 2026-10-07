import { motion, useScroll, useSpring } from 'motion/react'

/** Hairline at the very top showing how far down the page the visitor is. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[41] h-[3px] origin-left bg-accent"
    />
  )
}
