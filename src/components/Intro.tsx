'use client'

import { Box, Flex, Text } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const MotionBox = motion.create(Box)
const MotionFlex = motion.create(Flex)
const MotionText = motion.create(Text)

interface IntroProps {
  onComplete: () => void
  setHovering: (val: boolean) => void
}

export default function Intro({ onComplete, setHovering }: IntroProps) {
  const [clicked, setClicked] = useState(false)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleClick = () => {
    if (clicked) return
    setClicked(true)
    setHovering(false)
    setTimeout(() => {
      onComplete()
    }, 1500) // Wait for expansion animation
  }

  return (
    <Box
      position="fixed"
      inset="0"
      bg="black"
      zIndex="50"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
    >
      <AnimatePresence>
        {!clicked && (
          <MotionFlex
            direction="column"
            alignItems="center"
            position="absolute"
            top="15%"
            textAlign="center"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: showHint ? 1 : 0, y: showHint ? 0 : 15 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            gap="3"
            px="6"
          >
            <Text
              color="white"
              fontSize={{ base: '2xl', md: '4xl' }}
              fontWeight="300"
              letterSpacing="0.02em"
            >
              Bem-vindo ao meu portfólio.
            </Text>
            <Text
              color="whiteAlpha.800"
              fontSize={{ base: 'lg', md: '2xl' }}
              fontWeight="400"
              mb="8"
            >
              Eu sou Lucas Matos.
            </Text>
            <Text
              color="whiteAlpha.400"
              fontSize="xs"
              letterSpacing="0.2em"
              textTransform="uppercase"
            >
              Clique no centro para iniciar
            </Text>
          </MotionFlex>
        )}
      </AnimatePresence>

      <MotionBox
        w="40px"
        h="40px"
        bg="white"
        cursor="pointer"
        onMouseEnter={() => !clicked && setHovering(true)}
        onMouseLeave={() => !clicked && setHovering(false)}
        onClick={handleClick}
        animate={
          clicked
            ? {
                scale: 100, // Expand to cover screen
                opacity: 0, // Fade out to reveal background
                borderRadius: '0%', // Become a square/full screen
              }
            : {
                scale: [1, 1.2, 1], // Pulsing effect
                borderRadius: ['20%', '50%', '20%'],
              }
        }
        transition={
          clicked
            ? {
                duration: 1.2,
                ease: [0.7, 0, 0.3, 1],
              }
            : {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
        style={{ originX: 0.5, originY: 0.5 }}
      />
    </Box>
  )
}
