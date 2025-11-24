"use client"

import { Button } from '@/components/ui/button'

import React from 'react'

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'

import useManagementFramework from '@/components/dashboard/proyek/framework/lib/useManagementFramework'

import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table'

import { ScrollArea } from '@/components/ui/scroll-area'

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
} from '@/components/ui/pagination'

import Link from "next/link"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { FormatIndoDate } from '@/lib/formatDate'

export default function FrameworkLayout() {
    const {
        loading,
        open, setOpen, FrameworkName, setFrameworkName,
        editOpen, setEditOpen, editFrameworkName, setEditFrameworkName,
        deleteOpen, setDeleteOpen, deleteFrameworkName,
        handleSubmit, handleEdit, handleEditSubmit, handleDelete, handleDeleteConfirm,
        currentPage, setCurrentPage, itemsPerPage, totalPages, paginatedFramework
    } = useManagementFramework()

    return (
        <section>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-8 border rounded-2xl border-border bg-card shadow-sm">
                <div className='flex flex-col gap-4'>
                    <h3 className='text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'>
                        Framework
                    </h3>

                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="/dashboard">Dashboard</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Framework</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90 transition-colors px-6 py-2 rounded-lg">
                            Add Framework
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md w-full rounded-2xl p-6 bg-background border border-border">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-semibold text-foreground">Add Framework</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
                            <input
                                type="text"
                                placeholder="Framework name"
                                value={FrameworkName}
                                onChange={e => setFrameworkName(e.target.value)}
                                className="border border-input rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                                required
                            />
                            <DialogFooter className="flex gap-2 justify-end">
                                <Button type="submit" disabled={loading || !FrameworkName} className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 py-2 rounded-lg transition-colors">
                                    {loading ? 'Adding...' : 'Add'}
                                </Button>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline" className="border-border px-4 py-2 rounded-lg">Cancel</Button>
                                </DialogClose>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="mt-6">
                <ScrollArea className="overflow-x-auto rounded-lg shadow-sm border border-border bg-background">
                    <Table className="min-w-[600px]">
                        <TableHeader>
                            <TableRow className="bg-muted">
                                <TableHead className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">No</TableHead>
                                <TableHead className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nama Framework</TableHead>
                                <TableHead className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tanggal Dibuat</TableHead>
                                <TableHead className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedFramework.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground py-6">No framework yet.</TableCell>
                                </TableRow>
                            ) : (
                                paginatedFramework.map((cat, idx) => (
                                    <TableRow key={cat.id} className="hover:bg-muted/60 transition-colors">
                                        <TableCell className="py-3 px-4">{(currentPage - 1) * itemsPerPage + idx + 1}</TableCell>
                                        <TableCell className="py-3 px-4 font-medium">{cat.name}</TableCell>
                                        <TableCell className="py-3 px-4 text-xs text-muted-foreground">
                                            {FormatIndoDate(cat.createdAt)}
                                        </TableCell>
                                        <TableCell className="py-3 px-4 flex gap-2">
                                            <Button size="sm" variant="outline" onClick={() => handleEdit(cat)} className="border-border hover:bg-primary/10 transition-colors">Edit</Button>
                                            <Button size="sm" variant="destructive" onClick={() => handleDelete(cat.id, cat.name)} className="hover:bg-destructive/90 transition-colors">Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-end mt-4">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={e => {
                                            e.preventDefault();
                                            setCurrentPage(p => Math.max(1, p - 1))
                                        }}
                                        href="#"
                                        aria-disabled={currentPage === 1}
                                    />
                                </PaginationItem>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            isActive={currentPage === i + 1}
                                            href="#"
                                            onClick={e => {
                                                e.preventDefault();
                                                setCurrentPage(i + 1)
                                            }}
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        onClick={e => {
                                            e.preventDefault();
                                            setCurrentPage(p => Math.min(totalPages, p + 1))
                                        }}
                                        href="#"
                                        aria-disabled={currentPage === totalPages}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
            {/* Edit Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-w-md w-full rounded-2xl p-6 bg-background border border-border">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold text-foreground">Edit Framework</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 mt-2">
                        <input
                            type="text"
                            placeholder="Framework name"
                            value={editFrameworkName}
                            onChange={e => setEditFrameworkName(e.target.value)}
                            className="border border-input rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                            required
                        />
                        <DialogFooter className="flex gap-2 justify-end">
                            <Button type="submit" disabled={loading || !editFrameworkName} className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 py-2 rounded-lg transition-colors">
                                {loading ? 'Saving...' : 'Save'}
                            </Button>
                            <DialogClose asChild>
                                <Button type="button" variant="outline" className="border-border px-4 py-2 rounded-lg" onClick={() => setEditOpen(false)}>Cancel</Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            {/* Delete Dialog */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent className="max-w-md w-full rounded-2xl p-6 bg-background border border-border">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold text-foreground">Hapus Framework</DialogTitle>
                    </DialogHeader>
                    <p className="mb-4 text-foreground">Apakah Anda yakin ingin menghapus Framework <b>{deleteFrameworkName}</b>?</p>
                    <DialogFooter className="flex gap-2 justify-end">
                        <Button variant="destructive" onClick={handleDeleteConfirm} disabled={loading} className="hover:bg-destructive/90 transition-colors">
                            {loading ? 'Menghapus...' : 'Hapus'}
                        </Button>
                        <DialogClose asChild>
                            <Button variant="outline" type="button" className="border-border px-4 py-2 rounded-lg" onClick={() => setDeleteOpen(false)}>Batal</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    )
}
