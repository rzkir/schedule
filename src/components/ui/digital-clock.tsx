"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface DigitalClockProps {
    collapsed?: boolean
}

export function DigitalClock({ collapsed = false }: DigitalClockProps) {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const formattedTime = time.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    })

    return (
        <div className={cn(
            "flex items-center gap-3 w-full",
            collapsed ? "justify-center" : "justify-start"
        )}>
            {/* Modern clock icon with gradient */}
            <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 rounded-lg blur-sm opacity-30"></div>
                <div className="relative bg-gradient-to-br from-primary to-primary/80 p-2 rounded-lg">
                    <Clock className="h-4 w-4 text-primary-foreground" />
                </div>
            </div>

            {!collapsed && (
                <div className="relative flex-1">
                    {/* Main time display */}
                    <div className="relative bg-gradient-to-r from-card/90 to-card/80 backdrop-blur-sm border border-border rounded-lg px-4 py-2 w-full">
                        <span className="text-sm font-mono font-bold text-transparent bg-gradient-to-r from-primary to-primary/80 bg-clip-text tracking-wider block text-center">
                            {formattedTime}
                        </span>
                    </div>

                    {/* Animated dots */}
                    <div className="absolute -top-1 -right-1">
                        <div className="w-2 h-2 bg-gradient-to-r from-primary to-primary/80 rounded-full animate-pulse"></div>
                    </div>
                </div>
            )}
        </div>
    )
} 