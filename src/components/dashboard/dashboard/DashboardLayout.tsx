"use client"
import React, { useEffect, useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { ScrollArea } from "@/components/ui/scroll-area";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { ChartAreaInteractive } from "@/components/dashboard/dashboard/ChartAreaInteractive"

import DashboardSkelaton from "@/components/dashboard/dashboard/DashboardSkelaton"

import { db } from "@/utils/firebase/firebase";

import { collection, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";

import { Proyek } from "@/types/Proyek";

import { FormatIndoDate } from "@/lib/formatDate";

export default function DashboardLayout() {
    const [proyeks, setProyeks] = useState<Proyek[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch projects data
    useEffect(() => {
        const q = query(
            collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_PROYEK as string),
            orderBy("createdAt", "desc")
        );
        const unsub = onSnapshot(q, (snapshot) => {
            setProyeks(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Proyek[]
            );
            setLoading(false);
        });
        return () => unsub();
    }, []);

    // Calculate statistics
    const totalOrders = proyeks.length;
    const completedOrders = proyeks.filter(p => p.progres === 'selesai').length;
    const inProgressOrders = proyeks.filter(p => p.progres === 'progress').length;
    const pendingOrders = proyeks.filter(p => p.progres === 'pending').length;
    const totalRevenue = proyeks.reduce((sum, p) => sum + (p.price || 0), 0);

    // Calculate monthly data for chart
    const getMonthlyData = () => {
        const monthlyData = Array.from({ length: 12 }, (_, i) => ({
            month: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][i],
            order: 0
        }));

        const currentYear = new Date().getFullYear();
        proyeks.forEach(proyek => {
            const createdAt = proyek.createdAt instanceof Timestamp ?
                proyek.createdAt.toDate() : new Date(proyek.createdAt);
            if (createdAt.getFullYear() === currentYear) {
                const month = createdAt.getMonth();
                monthlyData[month].order += 1;
            }
        });

        return monthlyData;
    };

    // Get recent orders for table
    const getRecentOrders = () => {
        return proyeks.slice(0, 5).map(proyek => ({
            name: proyek.title,
            price: `Rp ${proyek.price?.toLocaleString('id-ID') || '0'}`,
            status: proyek.progres === 'selesai' ? 'Selesai' :
                proyek.progres === 'progress' ? 'Proses' :
                    proyek.progres === 'revisi' ? 'Revisi' : 'Pending',
            start_date: FormatIndoDate(proyek.start_date),
            end_date: FormatIndoDate(proyek.end_date),
            date: FormatIndoDate(proyek.createdAt)
        }));
    };

    // Calculate target and achieved
    const target = 100; // Target order bulanan
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const achieved = proyeks.filter(proyek => {
        const createdAt = proyek.createdAt instanceof Timestamp ?
            proyek.createdAt.toDate() : new Date(proyek.createdAt);
        return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
    }).length;

    const stats = [
        { label: "Total Order", value: totalOrders, change: "+11%" },
        { label: "Order Selesai", value: completedOrders, change: "+9%" },
        { label: "Order Proses", value: inProgressOrders, change: "-2%" },
        { label: "Order Pending", value: pendingOrders, change: "+5%" },
        { label: "Pendapatan", value: `Rp ${(totalRevenue / 1000000).toFixed(1)}jt`, change: "+15%" },
    ];

    const chartData = getMonthlyData();
    const recentOrders = getRecentOrders();

    if (loading) {
        return <DashboardSkelaton />;
    }

    return (
        <section className="space-y-8">
            {/* Statistik Ringkas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                            <span className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{stat.change}</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <ChartAreaInteractive />

            {/* Grafik Order Bulanan & Target */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Order Bulanan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="order" stroke="#6366f1" strokeWidth={3} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Target Bulan Ini</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-2 text-lg font-semibold">{achieved} / {target} Order</div>
                        <Progress value={achieved / target * 100} className="h-4" />
                        <div className="mt-2 text-xs text-muted-foreground">Target {target} order tercapai {Math.round(achieved / target * 100)}%</div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabel Order Terbaru */}
            <Card>
                <CardHeader>
                    <CardTitle>Order Terbaru</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[200px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Order</TableHead>
                                    <TableHead>Harga</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Mulai</TableHead>
                                    <TableHead>Selesai</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentOrders.map((order, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{order.name}</TableCell>
                                        <TableCell>{order.price}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${order.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                                                order.status === 'Proses' ? 'bg-yellow-100 text-yellow-700' :
                                                    order.status === 'Revisi' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-gray-100 text-gray-700'
                                                }`}>{order.status}</span>
                                        </TableCell>
                                        <TableCell>{order.start_date}</TableCell>
                                        <TableCell>{order.end_date}</TableCell>
                                        <TableCell>{order.date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </section>
    )
}
