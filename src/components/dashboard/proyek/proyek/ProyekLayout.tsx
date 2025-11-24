"use client"

import React from 'react'

import Link from 'next/link'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"

import useManagementProyek from './lib/useManagementProyek'

import ModalForm from './modal/ModalForm';

import ViewModal from './modal/ViewModal';

import DeleteModal from './modal/DeleteModal';

import Image from 'next/image'

import { Proyek } from '@/types/Proyek';

import { FormatIndoDate } from '@/lib/formatDate';

import { Card, CardHeader, CardTitle, CardAction, CardContent } from '@/components/ui/card';

import { EmptyDataSVG } from "@/base/helper/Empety"

import { StatusIcon, ProgressIcon } from "@/base/helper/ProgresStatus"

import ProyekSkelaton from './ProyekSkelaton'

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

export default function ProyekLayout() {
    const {
        open, setOpen, loading, initialLoading, form,
        handleInputChange, handleImageChange, addProyek, editProyek,
        categories, frameworks, loadingCategories, loadingFrameworks,
        addLink, updateLink, removeLink,
        addDeposit, updateDeposit, removeDeposit,
        addAccount, updateAccount, removeAccount,
        filteredProyeks,
        selectedCategory, setSelectedCategory,
        selectedProgress, setSelectedProgress,
        selectedStatus, setSelectedStatus,
        searchTitle, setSearchTitle,
        handleEdit, editOpen, setEditOpen,
        deleteProyek,
        setDeleteId,
        // pagination
        currentPage,
        setCurrentPage,
        itemsPerPage,
        totalPages,
        paginatedProyeks,
    } = useManagementProyek();

    // State untuk modal view dan delete
    const [viewOpen, setViewOpen] = React.useState(false);
    const [deleteOpenModal, setDeleteOpenModal] = React.useState(false);
    const [selectedProyek, setSelectedProyek] = React.useState<Proyek | null>(null);

    function getFrameworkName(framework: unknown): string {
        if (typeof framework === 'string') return framework;
        if (
            framework &&
            typeof framework === 'object' &&
            'name' in framework &&
            typeof (framework as { name?: unknown }).name === 'string'
        ) {
            return (framework as { name: string }).name;
        }
        return '-';
    }

    const handleDeleteProyek = async () => {
        await deleteProyek();
        setDeleteOpenModal(false);
        setSelectedProyek(null);
    };

    return (
        <section>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-8 border rounded-2xl border-border bg-card shadow-sm">
                <div className='flex flex-col gap-4'>
                    <h3 className='text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'>
                        Management Proyek
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
                                <BreadcrumbPage>Proyek</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                {/* Modal Tambah */}
                <ModalForm
                    open={open}
                    setOpen={setOpen}
                    loading={loading}
                    form={form}
                    handleInputChange={handleInputChange}
                    handleImageChange={handleImageChange}
                    addProyek={addProyek}
                    categories={categories}
                    frameworks={frameworks}
                    loadingCategories={loadingCategories}
                    loadingFrameworks={loadingFrameworks}
                    addLink={addLink}
                    updateLink={updateLink}
                    removeLink={removeLink}
                    addDeposit={addDeposit}
                    updateDeposit={updateDeposit}
                    removeDeposit={removeDeposit}
                    addAccount={addAccount}
                    updateAccount={updateAccount}
                    removeAccount={removeAccount}
                />
                {/* Modal Edit */}
                {editOpen && (
                    <ModalForm
                        open={editOpen}
                        setOpen={setEditOpen}
                        loading={loading}
                        form={form}
                        handleInputChange={handleInputChange}
                        handleImageChange={handleImageChange}
                        addProyek={editProyek}
                        categories={categories}
                        frameworks={frameworks}
                        loadingCategories={loadingCategories}
                        loadingFrameworks={loadingFrameworks}
                        addLink={addLink}
                        updateLink={updateLink}
                        removeLink={removeLink}
                        addDeposit={addDeposit}
                        updateDeposit={updateDeposit}
                        removeDeposit={removeDeposit}
                        addAccount={addAccount}
                        updateAccount={updateAccount}
                        removeAccount={removeAccount}
                    />
                )}
            </div>
            {/* Filter Section */}
            <div className="mt-6 mb-4 flex flex-col md:flex-row items-start gap-4 p-4 sm:p-8 border justify-between rounded-2xl border-border bg-card shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full">
                    <div className="flex gap-2 w-full">
                        <Input
                            id="search-title"
                            type="text"
                            placeholder="Search by project title..."
                            value={searchTitle}
                            onChange={(e) => setSearchTitle(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full">
                        {/* Category Filter */}
                        <div className="w-full">
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.name}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Progress Filter */}
                        <div className="w-full">
                            <Select value={selectedProgress} onValueChange={setSelectedProgress}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select progress" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Progress</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="progress">In Progress</SelectItem>
                                    <SelectItem value="revisi">Revision</SelectItem>
                                    <SelectItem value="selesai">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status Filter */}
                        <div className="w-full">
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Show skeleton when loading */}
            {initialLoading || loading || loadingCategories || loadingFrameworks ? (
                <ProyekSkelaton />
            ) : filteredProyeks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <EmptyDataSVG />
                    <p className="text-lg text-muted-foreground">
                        {selectedCategory === 'all' && selectedProgress === 'all' && selectedStatus === 'all' && searchTitle === ''
                            ? "Belum ada data proyek yang tersedia."
                            : "Tidak ada proyek yang sesuai dengan filter yang dipilih."
                        }
                    </p>
                    {(selectedCategory !== 'all' || selectedProgress !== 'all' || selectedStatus !== 'all' || searchTitle !== '') && (
                        <p className="text-sm text-muted-foreground mt-2">
                            Coba ubah filter atau kata kunci pencarian untuk melihat hasil yang berbeda.
                        </p>
                    )}
                </div>
            ) : (
                <div className="mt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedProyeks.map((proyek) => (
                            <Card key={proyek.id} className="relative p-0 bg-gradient-to-br from-card via-background to-muted rounded-3xl border border-border transition-all duration-300 group flex flex-col overflow-hidden">
                                <CardHeader className="p-0 relative">
                                    <div className="relative w-full aspect-[4/3] bg-muted flex items-center justify-center overflow-hidden rounded-t-3xl border-b border-border">
                                        {/* Badge Status */}
                                        <span className={`absolute bottom-14 left-2 px-3 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full z-10 transition-colors duration-200 gap-1 shadow ${proyek.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : proyek.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-muted text-muted-foreground'}`} title={`Status: ${proyek.status}`}>
                                            <StatusIcon status={proyek.status} />
                                            {proyek.status.charAt(0).toUpperCase() + proyek.status.slice(1)}
                                        </span>
                                        {/* Badge Progres */}
                                        <span className={`absolute bottom-14 left-28 px-3 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full z-10 transition-colors duration-200 gap-1 shadow ${proyek.progres === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : proyek.progres === 'progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : proyek.progres === 'revisi' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`} title={`Progres: ${proyek.progres}`}>
                                            <ProgressIcon progres={proyek.progres} />
                                            {proyek.progres.charAt(0).toUpperCase() + proyek.progres.slice(1)}
                                        </span>
                                        {proyek.thumbnail ? (
                                            <Image
                                                src={proyek.thumbnail}
                                                alt={proyek.title}
                                                width={400}
                                                height={300}
                                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 z-0"
                                                style={{ aspectRatio: '4/3' }}
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground">
                                                {/* SVG ilustrasi default */}
                                                <svg width="64" height="64" fill="none" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#f3f4f6" /><path d="M20 44V28a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v16" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M24 36l8 8 8-8" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                <span className="mt-2 text-xs">No image</span>
                                            </div>
                                        )}
                                        {/* Start and End Dates absolutely positioned at bottom of image */}
                                        <div className="absolute bottom-0 left-0 w-full flex gap-4 justify-between items-center py-4 bg-background/80 backdrop-blur-sm z-20 px-2">
                                            <span className="text-xs inline-flex items-center gap-1">
                                                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M16 3v4" /><path d="M8 3v4" /></svg>
                                                Start: {FormatIndoDate(proyek.start_date)}
                                            </span>
                                            <span className="text-xs inline-flex items-center gap-1">
                                                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M16 3v4" /><path d="M8 3v4" /></svg>
                                                End: {FormatIndoDate(proyek.end_date)}
                                            </span>
                                        </div>
                                    </div>
                                    <CardTitle className="text-base font-bold text-foreground px-4 pt-4 tracking-tight">
                                        <span className="inline-flex items-center gap-2">
                                            {proyek.title}
                                        </span>
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="flex-1 flex flex-col gap-2 px-4">
                                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                        <span>Category: <span className="font-medium text-foreground">{proyek.category}</span></span>
                                        <span>Framework: <span className="font-medium text-foreground">{Array.isArray(proyek.framework) && proyek.framework.length > 0 ? getFrameworkName(proyek.framework[0]) : '-'}</span></span>
                                    </div>
                                </CardContent>
                                <CardAction className="flex flex-row gap-2 p-4 pt-0 w-full">
                                    <button
                                        type="button"
                                        className="flex-1 min-w-[80px] border border-border rounded px-2 py-1 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
                                        onClick={() => { setSelectedProyek(proyek); setViewOpen(true); }}
                                    >
                                        View
                                    </button>
                                    <button
                                        type="button"
                                        className="flex-1 min-w-[80px] border border-border rounded px-2 py-1 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
                                        onClick={() => handleEdit(proyek)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="flex-1 min-w-[80px] border border-destructive text-destructive rounded px-2 py-1 text-sm hover:bg-destructive/10 hover:text-destructive"
                                        onClick={() => { setSelectedProyek(proyek); setDeleteOpenModal(true); setDeleteId(proyek.id); }}
                                    >
                                        Delete
                                    </button>
                                </CardAction>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className='flex flex-col md:flex-row justify-between items-center mt-8 gap-4'>
                        <div className="text-sm text-muted-foreground">
                            {filteredProyeks.length} project{filteredProyeks.length !== 1 ? 's' : ''} found
                            {totalPages > 1 && (
                                <span className="ml-2">
                                    (Page {currentPage} of {totalPages}, {itemsPerPage} per page)
                                </span>
                            )}
                        </div>

                        {totalPages > 1 && (
                            <div>
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                                                }}
                                                className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                                            />
                                        </PaginationItem>

                                        {/* Show first page */}
                                        {currentPage > 3 && (
                                            <>
                                                <PaginationItem>
                                                    <PaginationLink
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setCurrentPage(1);
                                                        }}
                                                    >
                                                        1
                                                    </PaginationLink>
                                                </PaginationItem>
                                                {currentPage > 4 && (
                                                    <PaginationItem>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                )}
                                            </>
                                        )}

                                        {/* Show current page and surrounding pages */}
                                        {(() => {
                                            const pages = [];
                                            const startPage = Math.max(1, currentPage - 1);
                                            const endPage = Math.min(totalPages, currentPage + 1);

                                            for (let page = startPage; page <= endPage; page++) {
                                                pages.push(
                                                    <PaginationItem key={page}>
                                                        <PaginationLink
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setCurrentPage(page);
                                                            }}
                                                            isActive={page === currentPage}
                                                        >
                                                            {page}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                );
                                            }
                                            return pages;
                                        })()}

                                        {/* Show last page */}
                                        {currentPage < totalPages - 2 && (
                                            <>
                                                {currentPage < totalPages - 3 && (
                                                    <PaginationItem>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                )}
                                                <PaginationItem>
                                                    <PaginationLink
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setCurrentPage(totalPages);
                                                        }}
                                                    >
                                                        {totalPages}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            </>
                                        )}

                                        <PaginationItem>
                                            <PaginationNext
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                                                }}
                                                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <ViewModal open={viewOpen} onClose={() => setViewOpen(false)} proyek={selectedProyek} />
            <DeleteModal
                open={deleteOpenModal}
                onClose={() => setDeleteOpenModal(false)}
                proyek={selectedProyek}
                onDelete={handleDeleteProyek}
                loading={loading}
            />
        </section>
    )
}
