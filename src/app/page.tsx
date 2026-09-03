'use client'

import { useState } from 'react'
import { Box } from '@chakra-ui/react'
import Intro from '@/components/Intro'
import CustomCursor from '@/components/CustomCursor'
import InteractivePortfolio from '@/components/InteractivePortfolio'

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  return (
    <Box minH="100vh" position="relative">
      <CustomCursor isHovering={isHovering} />
      
      {!introComplete ? (
        <Intro 
          onComplete={() => setIntroComplete(true)} 
          setHovering={setIsHovering}
        />
      ) : (
        <InteractivePortfolio setHovering={setIsHovering} />
      )}
    </Box>
  )
}
