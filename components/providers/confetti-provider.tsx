'use client'

import Confetti from 'react-confetti'
import { useConfettiStore } from '@/hooks/use-confetti-store'

const ConfettiProvider = () => {
  const confetti = useConfettiStore()

  if (!confetti.isOpen) return null

  return (
    <Confetti
      gravity={0.1}
      height={1115}
      initialVelocityX={2}
      initialVelocityY={2}
      numberOfPieces={200}
      opacity={1}
      recycle={false}
      run
      width={862}
      wind={0}
      onConfettiComplete={() => confetti.onClose()}
    />
  )
}

export default ConfettiProvider
