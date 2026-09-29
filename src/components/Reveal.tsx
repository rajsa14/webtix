import { motion, type HTMLMotionProps } from 'motion/react'

export const EASE = [0.16, 1, 0.3, 1] as const

/** Fades content up when it enters the viewport. Reduced motion is handled by MotionConfig. */
export function Reveal({
  delay = 0,
  y = 22,
  children,
  ...rest
}: HTMLMotionProps<'div'> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
