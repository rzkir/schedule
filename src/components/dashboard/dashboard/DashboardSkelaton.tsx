import React from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardSkelaton() {
    return (
        <section className="space-y-8">
            {/* Statistik Ringkas Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-3 w-8" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Chart Area Interactive Skeleton */}
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-80 w-full" />
                </CardContent>
            </Card>

            {/* Grafik Order Bulanan & Target Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-72 w-full" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-6 w-24 mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-3 w-48" />
                    </CardContent>
                </Card>
            </div>

            {/* Tabel Order Terbaru Skeleton */}
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <div className="space-y-4">
                            {/* Table Header */}
                            <div className="grid grid-cols-4 gap-4 pb-2 border-b">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                            {/* Table Rows */}
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="grid grid-cols-4 gap-4 py-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-6 w-16 rounded" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}
