"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { db } from "@/utils/firebase/firebase"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { Proyek } from "@/types/Proyek"

export const description = "An interactive area chart showing project progress"

const chartConfig = {
    projects: {
        label: "Projects",
    },
    pending: {
        label: "Pending",
        color: "hsl(var(--yellow-500))",
    },
    progress: {
        label: "In Progress",
        color: "hsl(var(--blue-500))",
    },
    revisi: {
        label: "Revision",
        color: "hsl(var(--red-500))",
    },
    selesai: {
        label: "Completed",
        color: "hsl(var(--green-500))",
    },
} satisfies ChartConfig

export function ChartAreaInteractive() {
    const isMobile = useIsMobile()
    const [timeRange, setTimeRange] = React.useState("90d")
    const [projects, setProjects] = React.useState<Proyek[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        if (isMobile) {
            setTimeRange("7d")
        }
    }, [isMobile])

    // Fetch projects from Firebase
    React.useEffect(() => {
        const q = query(
            collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_PROYEK as string),
            orderBy("createdAt", "desc")
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const projectsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Proyek[]
            setProjects(projectsData)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    // Generate chart data based on projects
    const generateChartData = React.useMemo(() => {
        if (loading || projects.length === 0) return []

        const now = new Date()
        let daysToSubtract = 90
        if (timeRange === "30d") {
            daysToSubtract = 30
        } else if (timeRange === "7d") {
            daysToSubtract = 7
        }

        const startDate = new Date(now)
        startDate.setDate(startDate.getDate() - daysToSubtract)

        // Group projects by date and progress
        const dateMap = new Map<string, { pending: number; progress: number; revisi: number; selesai: number }>()

        // Initialize all dates in range
        for (let i = 0; i <= daysToSubtract; i++) {
            const date = new Date(startDate)
            date.setDate(date.getDate() + i)
            const dateStr = date.toISOString().split('T')[0]
            dateMap.set(dateStr, { pending: 0, progress: 0, revisi: 0, selesai: 0 })
        }

        // Count projects by their start date and progress
        projects.forEach(project => {
            const startDate = project.start_date.toDate()
            const dateStr = startDate.toISOString().split('T')[0]

            if (dateMap.has(dateStr)) {
                const current = dateMap.get(dateStr)!
                current[project.progres as keyof typeof current]++
                dateMap.set(dateStr, current)
            }
        })

        // Convert to array format for chart
        return Array.from(dateMap.entries()).map(([date, counts]) => ({
            date,
            pending: counts.pending,
            progress: counts.progress,
            revisi: counts.revisi,
            selesai: counts.selesai,
        }))
    }, [projects, timeRange, loading])

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>Project Progress Overview</CardTitle>
                <CardDescription>
                    <span className="hidden @[540px]/card:block">
                        Project progress distribution over time
                    </span>
                    <span className="@[540px]/card:hidden">Project progress</span>
                </CardDescription>
                <CardAction>
                    <ToggleGroup
                        type="single"
                        value={timeRange}
                        onValueChange={setTimeRange}
                        variant="outline"
                        className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
                    >
                        <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
                        <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
                        <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
                    </ToggleGroup>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger
                            className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                            size="sm"
                            aria-label="Select a value"
                        >
                            <SelectValue placeholder="Last 3 months" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="90d" className="rounded-lg">
                                Last 3 months
                            </SelectItem>
                            <SelectItem value="30d" className="rounded-lg">
                                Last 30 days
                            </SelectItem>
                            <SelectItem value="7d" className="rounded-lg">
                                Last 7 days
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </CardAction>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                {loading ? (
                    <div className="flex items-center justify-center h-[250px]">
                        <div className="text-muted-foreground">Loading project data...</div>
                    </div>
                ) : generateChartData.length === 0 ? (
                    <div className="flex items-center justify-center h-[250px]">
                        <div className="text-muted-foreground">No project data available</div>
                    </div>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[250px] w-full"
                    >
                        <AreaChart data={generateChartData}>
                            <defs>
                                <linearGradient id="fillPending" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="hsl(var(--yellow-500))"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="hsl(var(--yellow-500))"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                                <linearGradient id="fillProgress" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="hsl(var(--blue-500))"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="hsl(var(--blue-500))"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                                <linearGradient id="fillRevisi" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="hsl(var(--red-500))"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="hsl(var(--red-500))"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                                <linearGradient id="fillSelesai" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="hsl(var(--green-500))"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="hsl(var(--green-500))"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) => {
                                    const date = new Date(value)
                                    return date.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    })
                                }}
                            />
                            <ChartTooltip
                                cursor={false}
                                defaultIndex={isMobile ? -1 : 10}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(value) => {
                                            return new Date(value).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })
                                        }}
                                        indicator="dot"
                                    />
                                }
                            />
                            <Area
                                dataKey="selesai"
                                type="natural"
                                fill="url(#fillSelesai)"
                                stroke="hsl(var(--green-500))"
                                stackId="a"
                            />
                            <Area
                                dataKey="revisi"
                                type="natural"
                                fill="url(#fillRevisi)"
                                stroke="hsl(var(--red-500))"
                                stackId="a"
                            />
                            <Area
                                dataKey="progress"
                                type="natural"
                                fill="url(#fillProgress)"
                                stroke="hsl(var(--blue-500))"
                                stackId="a"
                            />
                            <Area
                                dataKey="pending"
                                type="natural"
                                fill="url(#fillPending)"
                                stroke="hsl(var(--yellow-500))"
                                stackId="a"
                            />
                        </AreaChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
