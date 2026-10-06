'use client'

import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const MotionBox = motion.create(Box)

// Stack de fato usada neste projeto (fonte: package.json)
const stack = ['React', 'Next.js', 'TypeScript', 'Chakra UI', 'Framer Motion']

export default function About() {
  return (
    <MotionBox
      mb={{ base: 24, md: 40 }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, delay: 0.1 }}
    >
      <Flex
        direction={{ base: 'column', md: 'row' }}
        gap={{ base: 8, md: 16 }}
        alignItems="center"
      >
        {/* Retrato */}
        <Box
          position="relative"
          w={{ base: 'full', md: '380px' }}
          maxW="380px"
          aspectRatio="1 / 1"
          flexShrink={0}
          borderRadius="3xl"
          overflow="hidden"
          border="1px solid"
          borderColor="var(--portfolio-border)"
          bg="black"
        >
          <Image
            src="/lucas.png"
            alt="Retrato de Lucas"
            fill
            sizes="(max-width: 768px) 100vw, 380px"
            style={{ objectFit: 'cover' }}
          />
        </Box>

        {/* Texto */}
        <Flex direction="column" gap="5" flex="1" minW="0">
          <Text
            fontSize="sm"
            fontWeight="600"
            letterSpacing="0.2em"
            color="var(--portfolio-faint)"
            textTransform="uppercase"
          >
            Sobre mim
          </Text>

          <Heading
            as="h2"
            fontSize={{ base: '3xl', md: '5xl' }}
            fontWeight="800"
            letterSpacing="-0.03em"
            lineHeight="1.1"
            color="var(--portfolio-fg)"
          >
            Olá, me chamo Lucas.
          </Heading>

          <Text
            fontSize={{ base: 'lg', md: 'xl' }}
            color="var(--portfolio-muted)"
            lineHeight="1.7"
            maxW="2xl"
          >
            Sou desenvolvedor Full Stack e gosto de construir experiências
            digitais elegantes e funcionais do banco de dados até a
            interface. Prefiro entender o problema de verdade antes de escrever
            a primeira linha.
          </Text>

          <Text
            fontSize={{ base: 'lg', md: 'xl' }}
            color="var(--portfolio-muted)"
            lineHeight="1.7"
            maxW="2xl"
          >
            Parte do meu trabalho é automatizar o que era manual. Quando uma
            tarefa repetitiva desaparece do dia a dia, sobra tempo para o que
            importa: produto, pessoas e detalhes.
          </Text>

          <Flex gap="2" flexWrap="wrap" mt="3">
            {stack.map((tech) => (
              <Box
                key={tech}
                px="4"
                py="2"
                borderRadius="full"
                border="1px solid"
                borderColor="var(--portfolio-border)"
                color="var(--portfolio-muted)"
                fontSize="sm"
                fontFamily="var(--font-geist-mono), monospace"
              >
                {tech}
              </Box>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </MotionBox>
  )
}
