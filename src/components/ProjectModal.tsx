'use client'

import { Box, Flex, Text, Heading, HStack, Link as ChakraLink, IconButton } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Project } from '@/data/projects'
import { useEffect } from 'react'

const MotionBox = motion.create(Box)
const MotionFlex = motion.create(Flex)

interface ProjectModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
  setHovering: (val: boolean) => void
}

export default function ProjectModal({ project, isOpen, onClose, setHovering }: ProjectModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && project && (
        <Box
          position="fixed"
          inset="0"
          zIndex="100"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={{ base: 4, md: 10 }}
        >
          {/* Backdrop */}
          <MotionBox
            position="absolute"
            inset="0"
            bg="blackAlpha.800"
            backdropFilter="blur(10px)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
          />

          {/* Modal Content */}
          <MotionFlex
            direction="column"
            position="relative"
            bg={project.color}
            w="100%"
            maxW="5xl"
            h={{ base: '90vh', md: 'auto' }}
            maxH="90vh"
            borderRadius="3xl"
            overflow="hidden"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Close Button */}
            <Box position="absolute" top="6" right="6" zIndex="10">
              <IconButton
                aria-label="Close modal"
                variant="ghost"
                borderRadius="full"
                size="lg"
                bg="whiteAlpha.500"
                _hover={{ bg: 'whiteAlpha.800' }}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                onClick={onClose}
              >
                ✕
              </IconButton>
            </Box>

            <Flex direction={{ base: 'column', md: 'row' }} h="full">
              {/* Left Side: Project Info */}
              <Flex
                direction="column"
                flex="1"
                p={{ base: 8, md: 16 }}
                justifyContent="center"
                overflowY="auto"
              >
                <Text
                  fontSize="sm"
                  fontWeight="600"
                  letterSpacing="0.1em"
                  color="blackAlpha.600"
                  mb="4"
                >
                  PROJETO {project.number} — {project.year}
                </Text>
                
                <Heading
                  as="h2"
                  fontSize={{ base: '4xl', md: '6xl' }}
                  fontWeight="800"
                  letterSpacing="-0.03em"
                  color="black"
                  mb="6"
                  lineHeight="1.1"
                >
                  {project.title}
                </Heading>

                <Text
                  fontSize={{ base: 'lg', md: 'xl' }}
                  color="blackAlpha.800"
                  mb="8"
                  lineHeight="1.6"
                >
                  {project.description}
                </Text>

                <HStack gap="3" flexWrap="wrap" mb="10">
                  {project.tags.map((tag) => (
                    <Text
                      key={tag}
                      px="4"
                      py="2"
                      bg="blackAlpha.100"
                      color="blackAlpha.800"
                      borderRadius="full"
                      fontSize="sm"
                      fontWeight="500"
                    >
                      {tag}
                    </Text>
                  ))}
                </HStack>

                <HStack gap="6">
                  {project.live && (
                    <ChakraLink
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      fontSize="lg"
                      fontWeight="600"
                      color="black"
                      display="flex"
                      alignItems="center"
                      gap="2"
                      _hover={{ textDecoration: 'none', opacity: 0.7 }}
                      onMouseEnter={() => setHovering(true)}
                      onMouseLeave={() => setHovering(false)}
                    >
                      Ver Projeto ↗
                    </ChakraLink>
                  )}
                  {project.github && (
                    <ChakraLink
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      fontSize="lg"
                      fontWeight="600"
                      color="blackAlpha.600"
                      display="flex"
                      alignItems="center"
                      gap="2"
                      _hover={{ textDecoration: 'none', color: 'black' }}
                      onMouseEnter={() => setHovering(true)}
                      onMouseLeave={() => setHovering(false)}
                    >
                      Repositório ↗
                    </ChakraLink>
                  )}
                </HStack>
              </Flex>

              {/* Right Side: Image Placeholder */}
              <Box
                flex="1"
                bg="blackAlpha.50"
                position="relative"
                display={{ base: 'none', md: 'flex' }}
                alignItems="center"
                justifyContent="center"
                borderLeft="1px solid"
                borderColor="blackAlpha.100"
              >
                <Text fontSize="6xl" opacity={0.2}>
                  🖥️
                </Text>
              </Box>
            </Flex>
          </MotionFlex>
        </Box>
      )}
    </AnimatePresence>
  )
}
