import React from 'react'

import { Card, CardHeader, CardContent } from '@/components/ui/card'

import { Skeleton } from '@/components/ui/skeleton'

export default function ProfileSkelaton() {
    return (
        <section className="space-y-6">
            {/* Profile Header Skeleton */}
            <Card className="flex flex-col md:flex-row items-center gap-6 p-6 bg-card text-card-foreground">
                <div className="relative">
                    <Skeleton className="w-20 h-20 rounded-full" />
                    <Skeleton className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-4 w-32 mb-2" />
                    <div className="flex flex-col gap-1 mt-2">
                        <Skeleton className="h-3 w-24 mb-1" />
                        <Skeleton className="h-3 w-28" />
                    </div>
                </div>
            </Card>

            {/* Profile Information Form Skeleton */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between bg-card text-card-foreground">
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-5 h-5 rounded" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Password Change Form Skeleton */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between bg-card text-card-foreground">
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-5 h-5 rounded" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                    <Skeleton className="h-8 w-28" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}