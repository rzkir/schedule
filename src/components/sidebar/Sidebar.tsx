"use client"

import Link from "next/link"

import { useState, useEffect } from "react"

import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

import { useSidebar } from "./Header"

import { useSidebarCollapsed } from "./SidebarCollapsedContext"

import { sidebarNavItems, generalNavItems } from "@/components/sidebar/data/dashboard"

import { DigitalClock } from "@/components/ui/digital-clock"

import {
    X,
    ChevronDown,
} from "lucide-react";

import { SidebarNavItem, SidebarNavSubItem } from "@/components/sidebar/data/dashboard";

export default function Sidebar() {
    const pathname = usePathname()
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
    const { collapsed } = useSidebarCollapsed()
    const { isMobileOpen, setIsMobileOpen } = useSidebar()

    // Auto-expand parent items when subitems are active
    useEffect(() => {
        const newExpandedItems: Record<string, boolean> = {}

        sidebarNavItems.forEach((item) => {
            if (item.subItems) {
                const hasActiveSubItem = item.subItems.some(subItem =>
                    pathname === subItem.href || pathname.startsWith(subItem.href + '/')
                )
                if (hasActiveSubItem) {
                    newExpandedItems[item.href] = true
                }
            }
        })

        setExpandedItems(prev => ({
            ...prev,
            ...newExpandedItems
        }))
    }, [pathname])

    const toggleExpand = (href: string) => {
        setExpandedItems(prev => ({
            ...prev,
            [href]: !prev[href]
        }))
    }

    // Check if item or any of its subitems are active
    const isItemActive = (item: SidebarNavItem) => {
        if (pathname === item.href) return true
        if (item.subItems) {
            return item.subItems.some((subItem: SidebarNavSubItem) =>
                pathname === subItem.href || pathname.startsWith(subItem.href + '/')
            )
        }
        return false
    }

    // Check if subitem is active
    const isSubItemActive = (subItem: SidebarNavSubItem) => {
        return pathname === subItem.href || pathname.startsWith(subItem.href + '/')
    }

    return (
        <>
            {/* Sidebar */}
            <div className={cn(
                "flex h-full flex-col gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300",
                collapsed ? "w-16 px-2" : "w-64 px-4",
                "py-6",
                "border-r border-border/40",
                "fixed lg:relative",
                "inset-y-0 left-0 z-[70] lg:z-[50]",
                "transform transition-transform duration-300 ease-in-out",
                isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className={cn(
                    "flex items-center justify-between border-b border-border/40 px-0",
                    collapsed && "justify-center"
                )}>
                    {!collapsed && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setIsMobileOpen(false)}
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    )}
                </div>
                <div className="flex-1 overflow-y-auto px-0">
                    <div className="space-y-6">
                        <div>
                            {!collapsed && (
                                <h3 className={cn(
                                    "text-xs font-semibold text-muted-foreground uppercase mb-6",
                                    "block tracking-wider"
                                )}>
                                    MENU
                                </h3>
                            )}
                            <div className="space-y-4">
                                {sidebarNavItems.map((item) => (
                                    <div key={item.href} className="space-y-1">
                                        <div className="relative group">
                                            <Button
                                                variant={isItemActive(item) ? "secondary" : "ghost"}
                                                className={cn(
                                                    "w-full justify-start gap-2",
                                                    isItemActive(item) && "bg-primary/10 text-primary font-medium rounded-lg",
                                                    "justify-start px-2 min-w-[40px] min-h-[40px]",
                                                    "hover:bg-muted/50 transition-colors duration-200",
                                                    "border border-transparent hover:border-border/40",
                                                    collapsed && "justify-center px-0"
                                                )}
                                                onClick={() => item.subItems && toggleExpand(item.href)}
                                                asChild={!item.subItems}
                                            >
                                                {item.subItems ? (
                                                    <div className={cn("flex items-center w-full", collapsed ? "justify-center" : "justify-between")}>
                                                        <div className="flex items-center gap-2">
                                                            <item.icon className={cn(
                                                                "h-5 w-5",
                                                                "transition-all duration-300",
                                                                isItemActive(item) ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                                            )} />
                                                            {!collapsed && (
                                                                <span className={cn(
                                                                    "whitespace-nowrap transition-all duration-300",
                                                                    "w-auto opacity-100 overflow-visible"
                                                                )}>
                                                                    {item.title}
                                                                </span>
                                                            )}
                                                            {collapsed && (
                                                                <span className="sr-only">{item.title}</span>
                                                            )}
                                                        </div>
                                                        {!collapsed && (
                                                            <ChevronDown className={cn(
                                                                "h-4 w-4 transition-transform duration-200",
                                                                expandedItems[item.href] ? "transform rotate-180" : ""
                                                            )} />
                                                        )}
                                                    </div>
                                                ) : (
                                                    <Link href={item.href} className="flex items-center justify-center w-full">
                                                        <item.icon className={cn(
                                                            "h-5 w-5",
                                                            "transition-all duration-300",
                                                            isItemActive(item) ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                                        )} />
                                                        {!collapsed && (
                                                            <span className={cn(
                                                                "whitespace-nowrap transition-all duration-300",
                                                                "w-auto opacity-100 overflow-visible"
                                                            )}>
                                                                {item.title}
                                                            </span>
                                                        )}
                                                        {collapsed && (
                                                            <span className="sr-only">{item.title}</span>
                                                        )}
                                                    </Link>
                                                )}
                                            </Button>

                                        </div>
                                        {item.subItems && expandedItems[item.href] && !collapsed && (
                                            <div className="ml-6 space-y-1.5 border-l border-border/40 pl-3">
                                                {item.subItems.map((subItem) => (
                                                    <div key={subItem.href} className="relative group">
                                                        <Button
                                                            variant={isSubItemActive(subItem) ? "secondary" : "ghost"}
                                                            className={cn(
                                                                "w-full justify-start gap-2",
                                                                isSubItemActive(subItem) && "bg-primary/10 text-primary font-medium rounded-lg",
                                                                "justify-start px-2 min-w-[40px] min-h-[40px]",
                                                                "hover:bg-muted/50 transition-colors duration-200",
                                                                "border border-transparent hover:border-border/40"
                                                            )}
                                                            asChild
                                                        >
                                                            <Link href={subItem.href}>
                                                                <span className={cn(
                                                                    "whitespace-nowrap transition-all duration-300",
                                                                    "w-auto opacity-100 overflow-visible"
                                                                )}>
                                                                    {subItem.title}
                                                                </span>
                                                            </Link>
                                                        </Button>

                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            {!collapsed && (
                                <h3 className={cn(
                                    "text-xs font-semibold text-muted-foreground uppercase mb-6",
                                    "block tracking-wider"
                                )}>
                                    GENERAL
                                </h3>
                            )}
                            <div className="space-y-1.5">
                                {generalNavItems.map((item) => (
                                    <div key={item.href} className="relative group">
                                        <Button
                                            variant={isItemActive(item) ? "secondary" : "ghost"}
                                            className={cn(
                                                "w-full justify-start gap-2",
                                                isItemActive(item) && "bg-primary/10 text-primary font-medium rounded-lg",
                                                "justify-start px-2 min-w-[40px] min-h-[40px]",
                                                "hover:bg-muted/50 transition-colors duration-200",
                                                "border border-transparent hover:border-border/40",
                                                collapsed && "justify-center px-0"
                                            )}
                                            asChild
                                        >
                                            <Link href={item.href} className="flex items-center justify-center w-full">
                                                <item.icon className={cn(
                                                    "h-5 w-5",
                                                    "transition-all duration-300",
                                                    isItemActive(item) ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                                )} />
                                                {!collapsed && (
                                                    <span className={cn(
                                                        "whitespace-nowrap transition-all duration-300",
                                                        "w-auto opacity-100 overflow-visible"
                                                    )}>
                                                        {item.title}
                                                    </span>
                                                )}
                                                {collapsed && (
                                                    <span className="sr-only">{item.title}</span>
                                                )}
                                            </Link>
                                        </Button>

                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Digital Clock section moved to bottom */}
                <div className={cn(
                    "flex items-center border-t border-border/40 pt-6 mt-6",
                    collapsed ? "justify-center" : "justify-start"
                )}>
                    <DigitalClock collapsed={collapsed} />
                </div>
            </div>
            {/* Overlay for mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[69] lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </>
    )
}