'use client'

import { Box, Flex, Text, Heading, Link as ChakraLink } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { Project, projects } from '@/data/projects'
import { useState } from 'react'
import ProjectModal from './ProjectModal'

const MotionBox = motion.create(Box)
const MotionFlex = motion.create(Flex)

interface InteractivePortfolioProps {
  setHovering: (val: boolean) => void
}

export default function InteractivePortfolio({ setHovering }: InteractivePortfolioProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <Box minH="100vh" bg="#fafafa" position="relative" pt="20" pb="20">
      <Box maxW="90rem" mx="auto" px={{ base: 6, md: 12 }}>
        {/* Header */}
        <MotionFlex
          direction="column"
          mb={{ base: 16, md: 32 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Text
            fontSize="sm"
            fontWeight="600"
            letterSpacing="0.2em"
            color="blackAlpha.500"
            mb="4"
            textTransform="uppercase"
          >
            Desenvolvedor Full Stack
          </Text>
          <Heading
            as="h1"
            fontSize={{ base: '5xl', md: '8xl' }}
            fontWeight="900"
            letterSpacing="-0.04em"
            lineHeight="1"
            color="black"
            mb="8"
          >
            Criando
            <br />
            Experiências
            <br />
            Digitais.
          </Heading>

          <Text
            fontSize={{ base: 'lg', md: '2xl' }}
            color="blackAlpha.700"
            maxW="2xl"
            lineHeight="1.6"
            fontWeight="400"
          >
            Acredito que o bom design não é apenas como se parece, mas como funciona.
            Sou apaixonado por transformar desafios complexos em soluções elegantes, 
            escrevendo código limpo para criar produtos que as pessoas amam usar.
          </Text>
        </MotionFlex>

        {/* Project Grid */}
        <Flex direction="column" gap={{ base: 12, md: 24 }}>
          {projects.map((project, i) => (
            <MotionBox
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <Flex
                direction={{ base: 'column', md: i % 2 === 0 ? 'row' : 'row-reverse' }}
                gap={{ base: 6, md: 16 }}
                alignItems="center"
                cursor="pointer"
                onClick={() => setSelectedProject(project)}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                className="group"
              >
                {/* Visual Representation */}
                <MotionBox
                  flex="1"
                  w="full"
                  h={{ base: '300px', md: '500px' }}
                  bg={project.color}
                  borderRadius="3xl"
                  position="relative"
                  overflow="hidden"
                  whileHover={{ scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Flex
                    w="full"
                    h="full"
                    alignItems="center"
                    justifyContent="center"
                    fontSize={{ base: '6xl', md: '8xl' }}
                    opacity={0.3}
                  >
                    ✦
                  </Flex>
                </MotionBox>

                {/* Project Info */}
                <Flex direction="column" flex="1" gap="4">
                  <Text
                    fontSize="xl"
                    fontWeight="500"
                    color="blackAlpha.500"
                    fontFamily="monospace"
                  >
                    /{project.number}
                  </Text>
                  <Heading
                    as="h3"
                    fontSize={{ base: '3xl', md: '5xl' }}
                    fontWeight="700"
                    letterSpacing="-0.02em"
                    color="black"
                    transition="transform 0.3s ease"
                    _groupHover={{ transform: 'translateX(20px)' }}
                  >
                    {project.title}
                  </Heading>
                  <Text
                    fontSize="xl"
                    color="blackAlpha.700"
                    mt="2"
                  >
                    {project.subtitle}
                  </Text>
                </Flex>
              </Flex>
            </MotionBox>
          ))}
        </Flex>

        {/* Footer Contact Info */}
        <MotionFlex
          mt="32"
          pt="16"
          borderTop="1px solid"
          borderColor="blackAlpha.200"
          justifyContent="space-between"
          direction={{ base: 'column', md: 'row' }}
          gap="8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Text fontSize="lg" fontWeight="600">
            lucas11moraes@hotmail.com
          </Text>
          <Flex gap="8">
            {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
              <ChakraLink
                key={social}
                href="#"
                fontSize="lg"
                fontWeight="500"
                color="blackAlpha.600"
                _hover={{ color: 'black', textDecoration: 'none' }}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
              >
                {social}
              </ChakraLink>
            ))}
          </Flex>
        </MotionFlex>
      </Box>

      {/* Modal Overlay */}
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => {
          setSelectedProject(null)
          setHovering(false)
        }}
        setHovering={setHovering}
      />
    </Box>
  )
}
