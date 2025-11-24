"use client"

import { Bell, Menu, PanelLeftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Switch } from "@/components/ui/switch"

import { useTheme } from "next-themes"

import { motion } from "framer-motion"

import { useEffect, useState, createContext, useContext } from "react"

import { useAuth } from "@/utils/context/AuthContext"

import { useRouter } from "next/navigation"

import { useSidebarCollapsed } from "./SidebarCollapsedContext"

import { cn } from "@/lib/utils"

// Create context for sidebar state
type SidebarContextType = {
    isMobileOpen: boolean
    setIsMobileOpen: (value: boolean) => void
}

export const SidebarContext = createContext<SidebarContextType>({
    isMobileOpen: false,
    setIsMobileOpen: () => { },
})

export const useSidebar = () => useContext(SidebarContext)

export default function Header() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const { user, logout } = useAuth()
    const router = useRouter()
    const { isMobileOpen, setIsMobileOpen } = useSidebar()
    const { collapsed, setCollapsed } = useSidebarCollapsed()

    useEffect(() => {
        setMounted(true)
    }, [])

    const fullName = user?.displayName as string;
    const userEmail = user?.email as string

    const handleLogout = async () => {
        await logout()
        router.push('/signin')
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center justify-between px-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                >
                    <Menu className="h-6 w-6" />
                </Button>
                {/* Collapse/Expand Button (Desktop only) */}
                <div className="hidden lg:flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCollapsed((c) => !c)}
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        <PanelLeftIcon className={cn("h-5 w-5 transition-transform", collapsed ? "rotate-180" : "")} />
                    </Button>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-2 lg:space-x-4">
                    <div className="flex items-center space-x-2 lg:space-x-4">
                        {mounted && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Switch
                                    id="theme-toggle"
                                    checked={theme === 'dark'}
                                    onCheckedChange={(checked: boolean) => setTheme(checked ? 'dark' : 'light')}
                                />
                            </motion.div>
                        )}

                        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-muted/50">
                            <Bell className="h-5 w-5" />
                            <span className="sr-only">Notifications</span>
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-auto rounded-full flex items-center gap-2 px-2 hover:bg-muted/50">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user?.photo_url} alt={fullName} />
                                        <AvatarFallback>{fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-col items-start hidden md:flex">
                                        <p className="text-sm font-medium leading-none">{fullName}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{fullName}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {userEmail}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    )
} 