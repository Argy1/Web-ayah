// src/components/PageTransition.tsx
import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode } from 'react'
import { useRouter } from 'next/router'

const variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4 } },
}

export default function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={router.asPath}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
