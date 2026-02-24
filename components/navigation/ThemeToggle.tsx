'use client'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function ThemeToggle() {
    const { setTheme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 dark:text-white text-black" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 dark:text-white text-black" />
                    <span className="sr-only">切換主題</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')} className="dark:text-white text-black">淺色</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')} className="dark:text-white text-black">深色</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')} className="dark:text-white text-black">系統</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
