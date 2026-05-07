'use client'

import type { ThemeProviderProps } from 'next-themes'
import { HeroUIProvider } from '@heroui/react'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Toaster } from 'react-hot-toast'
import { LazyMotion, domAnimation } from 'framer-motion'

interface ProvidersProps {
  children: React.ReactNode
  themeProps?: ThemeProviderProps
}

export function Providers({ children, themeProps }: ProvidersProps) {

  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <ThemeProvider {...themeProps}>
        <SessionProvider>
          <LazyMotion features={domAnimation} strict>
            <Toaster position="top-center" containerStyle={{ zIndex: 9999 }} />
            {children}
          </LazyMotion>
        </SessionProvider>
      </ThemeProvider>
    </HeroUIProvider>
  )
}
