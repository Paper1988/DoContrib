'use client'
import { Button } from '@/components/ui/button'
import { Menu, MenuButton, MenuItem, MenuItems, MenuSeparator } from '@headlessui/react'
import { Avatar } from '@mui/material'
import { AnimatePresence, motion } from 'motion/react'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import Loading from './loading'

export default function LoginButton() {
    const { data: session, status } = useSession()
    const [isSigningOut, setIsSigningOut] = useState(false)

    const handleSignOut = async () => {
        setIsSigningOut(true)
        try {
            await signOut()
        } catch (error) {
            console.error('Sign out error:', error)
        } finally {
            setIsSigningOut(false)
        }
    }

    const handleSignIn = async () => {
        try {
            await signIn('google')
        } catch (error) {
            console.error('Sign in error:', error)
        }
    }

    // 載入狀態
    if (status === 'loading') {
        return <Loading />
    }

    return (
        <>
            {session ? (
                <Menu>
                    {({ open }) => (
                        <div>
                            <MenuButton className="inline-flex items-center rounded-full text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:scale-105">
                                <Avatar
                                    src={session.user?.image ?? ''}
                                    alt={session.user?.name ?? 'User avatar'}
                                />
                            </MenuButton>
                            <AnimatePresence>
                                {open && (
                                    <MenuItems
                                        static
                                        as={motion.div}
                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                        transition
                                        anchor="bottom end"
                                        className="z-50 mt-2 w-48 origin-top-right rounded-xl bg-white dark:bg-background shadow-lg ring-1 ring-black/5 dark:ring-white/10 p-1 text-sm focus:outline-none ease-out duration-150"
                                    >
                                        <div className="px-3 py-2 text-xs text-foreground dark:text-foreground border-b border-gray-200 dark:border-gray-700">
                                            {session.user?.email}
                                        </div>
                                        <MenuItem>
                                            {({ focus }) => (
                                                <Link
                                                    href="/user"
                                                    className={`${
                                                        focus ? 'bg-gray-100 dark:bg-gray-700' : ''
                                                    } group flex w-full items-center rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 transition-colors duration-150`}
                                                >
                                                    <svg
                                                        className="mr-2 h-4 w-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                        />
                                                    </svg>
                                                    個人資料
                                                </Link>
                                            )}
                                        </MenuItem>
                                        <MenuSeparator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
                                        <MenuItem>
                                            {({ focus }) => (
                                                <button
                                                    onClick={handleSignOut}
                                                    disabled={isSigningOut}
                                                    className={`${
                                                        focus ? 'bg-gray-100 dark:bg-gray-700' : ''
                                                    } group flex w-full items-center rounded-lg px-3 py-2 text-sm text-red-600 dark:text-red-400 transition-colors duration-150 disabled:opacity-50`}
                                                >
                                                    <svg
                                                        className="mr-2 h-4 w-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                        />
                                                    </svg>
                                                    {isSigningOut ? '登出中...' : '登出'}
                                                </button>
                                            )}
                                        </MenuItem>
                                    </MenuItems>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </Menu>
            ) : (
                <Button
                    variant="outline"
                    onClick={handleSignIn}
                    className="transition-all duration-200 hover:scale-105"
                >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    使用 Google 登入
                </Button>
            )}
        </>
    )
}
