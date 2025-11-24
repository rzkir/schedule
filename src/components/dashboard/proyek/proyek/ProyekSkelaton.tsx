import React from 'react'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

import { Skeleton } from '@/components/ui/skeleton'

export default function ProyekSkelaton() {
    return (
        <section className="space-y-6">
            {/* Header Section Skeleton */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-8 border rounded-2xl border-border bg-card shadow-sm">
                <div className='flex flex-col gap-4'>
                    <Skeleton className="h-10 w-64" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            {/* Filter Section Skeleton */}
            <div className="mt-6 mb-4 flex flex-col md:flex-row items-start gap-4 p-4 sm:p-8 border justify-between rounded-2xl border-border bg-card shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full">
                    <div className="flex gap-2 w-full">
                        <Skeleton className="h-10 w-full" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full">
                        {/* Category Filter Skeleton */}
                        <div className="w-full">
                            <Skeleton className="h-10 w-full" />
                        </div>

                        {/* Progress Filter Skeleton */}
                        <div className="w-full">
                            <Skeleton className="h-10 w-full" />
                        </div>

                        {/* Status Filter Skeleton */}
                        <div className="w-full">
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Project Cards Grid Skeleton */}
            <div className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="relative p-0 bg-gradient-to-br from-card via-background to-muted rounded-3xl border border-border transition-all duration-300 group flex flex-col overflow-hidden">
                            <CardHeader className="p-0 relative">
                                <div className="relative w-full aspect-[4/3] bg-muted flex items-center justify-center overflow-hidden rounded-t-3xl border-b border-border">
                                    {/* Badge Status Skeleton */}
                                    <div className="absolute bottom-14 left-2">
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                    </div>
                                    {/* Badge Progress Skeleton */}
                                    <div className="absolute bottom-14 left-28">
                                        <Skeleton className="h-6 w-20 rounded-full" />
                                    </div>
                                    {/* Image Placeholder Skeleton */}
                                    <Skeleton className="w-full h-full" />
                                    {/* Date Section Skeleton */}
                                    <div className="absolute bottom-0 left-0 w-full flex gap-4 justify-between items-center py-4 bg-background/80 backdrop-blur-sm z-20 px-2">
                                        <Skeleton className="h-3 w-20" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                                <CardTitle className="text-base font-bold text-foreground px-4 pt-4 tracking-tight">
                                    <Skeleton className="h-5 w-3/4" />
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="flex-1 flex flex-col gap-2 px-4">
                                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-28" />
                                </div>
                            </CardContent>

                            {/* Action Buttons Skeleton */}
                            <div className="flex flex-row gap-2 p-4 pt-0 w-full">
                                <Skeleton className="flex-1 h-8 rounded" />
                                <Skeleton className="flex-1 h-8 rounded" />
                                <Skeleton className="flex-1 h-8 rounded" />
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Pagination Section Skeleton */}
                <div className='flex flex-col md:flex-row justify-between items-center mt-8'>
                    <Skeleton className="h-4 w-48" />
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                    </div>
                </div>
            </div>
        </section>
    )
}
