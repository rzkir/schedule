import React from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

export default function ManagementAccountsSkelaton() {
  return (
    <section className="space-y-6">
      {/* Header Section Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-8 border rounded-2xl border-border bg-card shadow-sm">
        <div className="flex flex-col gap-4">
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

      {/* Account Cards Grid Skeleton */}
      <div className="mt-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card
              key={i}
              className="relative p-0 bg-gradient-to-br from-card via-background to-muted rounded-3xl border border-border transition-all duration-300 group flex flex-col overflow-hidden"
            >
              <CardHeader className="p-4">
                <CardTitle className="text-base font-bold text-foreground tracking-tight">
                  <Skeleton className="h-5 w-3/4" />
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col gap-2 px-4">
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
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
        <div className="flex flex-col md:flex-row justify-between items-center mt-8">
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
  );
}
