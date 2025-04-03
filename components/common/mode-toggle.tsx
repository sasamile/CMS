'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Button
      onClick={() => {
        if (theme === 'light') {
          setTheme('dark')
        } else {
          setTheme('light')
        }
      }}
      size="icon"
      variant="ghost"
      className="hover:dark:bg-muted-foreground/35"
    >
      <Sun
        className={cn(
          'h-[1.37rem] w-[1.37rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0',
          theme === 'dark' && 'hidden'
        )}
      />

      <Moon
        className={cn(
          'absolute h-[1.37rem] w-[1.37rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100',
          theme === 'light' && 'hidden'
        )}
      />

      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
