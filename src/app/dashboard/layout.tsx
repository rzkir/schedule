"use client";

import { useAuth } from "@/utils/context/AuthContext";

import Header, { SidebarContext } from '@/components/sidebar/Header'

import { SidebarCollapsedProvider } from '@/components/sidebar/SidebarCollapsedContext'

import Sidebar from '@/components/sidebar/Sidebar'

import { useState } from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useAuth();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <SidebarCollapsedProvider>
            <SidebarContext.Provider value={{ isMobileOpen, setIsMobileOpen }}>
                <div className="flex h-screen bg-background">
                    {/* Sidebar */}
                    <aside className="md:relative">
                        <div className="h-full overflow-x-visible">
                            <Sidebar />
                        </div>
                    </aside>

                    {/* Main content */}
                    <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out overflow-y-auto">
                        <Header />
                        <main className="flex-1 px-4 py-4">
                            {children}
                        </main>
                    </div>
                </div>
            </SidebarContext.Provider>
        </SidebarCollapsedProvider>
    );
} 