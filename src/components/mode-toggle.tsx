"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Box, Flex, Text } from "@chakra-ui/react"

// Adaptado de https://ui.shadcn.com/docs/dark-mode/next
// O projeto usa Chakra UI (sem button/dropdown-menu do shadcn),
// então o toggle replica a mesma API Light / Dark / System
// usando apenas next-themes + Chakra + SVG inline (estilo lucide).

function SunIcon({ size = 19 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  )
}

function MoonIcon({ size = 19 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const rootRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => setMounted(true), [])

  React.useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [open ])

  if (!mounted) {
    return (
      <Box
        w="40px"
        h="40px"
        borderRadius="full"
        border="1px solid var(--toggle-border)"
        bg="var(--toggle-bg)"
        aria-hidden="true"
      />
    )
  }

  const isDark = resolvedTheme === "dark"
  const options = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ] as const

  return (
    <Box ref={rootRef} position="relative">
      <button
        type="button"
        aria-label={`Trocar tema. Atual: ${theme}`}
        onClick={() => setOpen((v) => !v)}
        style={{
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "9999px",
          border: "1px solid var(--toggle-border)",
          background: "var(--toggle-bg)",
          color: "var(--toggle-fg)",
          cursor: "pointer",
          transition: "background 0.2s ease, transform 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)"
        }}
      >
        <Box position="relative" w="19px" h="19px">
          {/* Sol visível no light, lua no dark — mesma animação do exemplo shadcn */}
          <Box
            position="absolute"
            inset="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
            transition="all 0.3s ease"
            transform={isDark ? "rotate(-90deg) scale(0)" : "rotate(0deg) scale(1)"}
            opacity={isDark ? 0 : 1}
          >
            <SunIcon />
          </Box>
          <Box
            position="absolute"
            inset="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
            transition="all 0.3s ease"
            transform={isDark ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0)"}
            opacity={isDark ? 1 : 0}
          >
            <MoonIcon />
          </Box>
        </Box>
        <Text as="span" srOnly>
          Toggle theme
        </Text>
      </button>

      {open && (
        <Box
          position="absolute"
          top="48px"
          right="0"
          minW="140px"
          borderRadius="xl"
          border="1px solid var(--toggle-border)"
          bg="var(--toggle-bg)"
          color="var(--toggle-fg)"
          boxShadow="0 12px 32px rgba(0,0,0,0.12)"
          overflow="hidden"
          zIndex="60"
        >
          <Flex direction="column" p="1">
            {options.map((opt) => {
              const active = theme === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setTheme(opt.value)
                    setOpen(false)
                  }}
                  style={{
                    textAlign: "left",
                    padding: "8px 12px",
                    fontSize: "14px",
                    fontWeight: active ? 600 : 400,
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    background: active
                      ? "var(--toggle-active-bg)"
                      : "transparent",
                    color: "var(--toggle-fg)",
                  }}
                >
                  {opt.label}
                </button>
              )
            })}
          </Flex>
        </Box>
      )}
    </Box>
  )
}
