import type { ReactNode } from "react"

import { DashboardLayoutClient } from "@/components/dashboard/DashboardLayoutClient"

export default function DashboardLayout({
    children,
}: {
    children: ReactNode
}) {
    return <DashboardLayoutClient>{children}</DashboardLayoutClient>
}
