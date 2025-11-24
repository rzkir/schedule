"use client";

import React from "react";

import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

import useManagementAccounts from "./lib/useManagementAccounts";

import ModalForm from "./modal/ModalForm";

import ViewModal from "./modal/ViewModal";

import DeleteModal from "./modal/DeleteModal";

import { ManagementAccounts } from "@/types/ManagementAccounts";

import { FormatIndoDate } from "@/lib/formatDate";

import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from "@/components/ui/card";

import { EmptyDataSVG } from "@/base/helper/Empety";

import ManagementAccountsSkelaton from "./ManagamentAccountsSkelaton";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function ManagementAccountsLayout() {
  const {
    open,
    setOpen,
    loading,
    initialLoading,
    form,
    handleInputChange,
    addAccount,
    editAccount,
    types,
    providers,
    loadingTypes,
    loadingProviders,
    filteredAccounts,
    selectedProvider,
    setSelectedProvider,
    selectedType,
    setSelectedType,
    searchName,
    setSearchName,
    handleEdit,
    editOpen,
    setEditOpen,
    deleteAccount,
    setDeleteId,
    // pagination
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages,
    paginatedAccounts,
  } = useManagementAccounts();

  // State untuk modal view dan delete
  const [viewOpen, setViewOpen] = React.useState(false);
  const [deleteOpenModal, setDeleteOpenModal] = React.useState(false);
  const [selectedAccount, setSelectedAccount] =
    React.useState<ManagementAccounts | null>(null);

  const handleDeleteAccount = async () => {
    await deleteAccount();
    setDeleteOpenModal(false);
    setSelectedAccount(null);
  };

  return (
    <section>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-8 border rounded-2xl border-border bg-card shadow-sm">
        <div className="flex flex-col gap-4">
          <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Management Accounts
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
                <BreadcrumbLink asChild>
                  <Link href="/dashboard/management-accounts">
                    Management Accounts
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Home</BreadcrumbPage>
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
          addAccount={addAccount}
          types={types}
          providers={providers}
          loadingTypes={loadingTypes}
          loadingProviders={loadingProviders}
        />
        {/* Modal Edit */}
        {editOpen && (
          <ModalForm
            open={editOpen}
            setOpen={setEditOpen}
            loading={loading}
            form={form}
            handleInputChange={handleInputChange}
            addAccount={editAccount}
            types={types}
            providers={providers}
            loadingTypes={loadingTypes}
            loadingProviders={loadingProviders}
          />
        )}
      </div>
      {/* Filter Section */}
      <div className="mt-6 mb-4 flex flex-col md:flex-row items-start gap-4 p-4 sm:p-8 border justify-between rounded-2xl border-border bg-card shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full">
          <div className="flex gap-2 w-full">
            <Input
              id="search-name"
              type="text"
              placeholder="Search by account name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full">
            {/* Provider Filter */}
            <div className="w-full">
              <Select
                value={selectedProvider}
                onValueChange={setSelectedProvider}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.provider}>
                      {provider.provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter */}
            <div className="w-full">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type.id} value={type.type}>
                      {type.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Show skeleton when loading */}
      {initialLoading || loading || loadingTypes || loadingProviders ? (
        <ManagementAccountsSkelaton />
      ) : filteredAccounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <EmptyDataSVG />
          <p className="text-lg text-muted-foreground">
            {selectedProvider === "all" &&
            selectedType === "all" &&
            searchName === ""
              ? "Belum ada data account yang tersedia."
              : "Tidak ada account yang sesuai dengan filter yang dipilih."}
          </p>
          {(selectedProvider !== "all" ||
            selectedType !== "all" ||
            searchName !== "") && (
            <p className="text-sm text-muted-foreground mt-2">
              Coba ubah filter atau kata kunci pencarian untuk melihat hasil
              yang berbeda.
            </p>
          )}
        </div>
      ) : (
        <div className="mt-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedAccounts.map((account) => (
              <Card
                key={account.id}
                className="relative p-0 bg-gradient-to-br from-card via-background to-muted rounded-3xl border border-border transition-all duration-300 group flex flex-col overflow-hidden"
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-base font-bold text-foreground tracking-tight">
                    <span className="inline-flex items-center gap-2">
                      {account.name}
                    </span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col gap-2 px-4">
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Email:</span>
                      <span className="text-foreground">{account.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Provider:</span>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                        {account.provider}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Type:</span>
                      <span className="px-2 py-1 bg-accent/10 text-accent-foreground rounded-full text-xs">
                        {account.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Created:</span>
                      <span className="text-foreground text-xs">
                        {FormatIndoDate(account.createdAt)}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardAction className="flex flex-wrap md:flex-row gap-2 p-4 pt-0 w-full">
                  <button
                    type="button"
                    className="flex-1 min-w-[80px] border border-border rounded px-2 py-1 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
                    onClick={() => {
                      setSelectedAccount(account);
                      setViewOpen(true);
                    }}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    className="flex-1 min-w-[80px] border border-border rounded px-2 py-1 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleEdit(account)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="flex-1 min-w-[80px] border border-destructive text-destructive rounded px-2 py-1 text-sm hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => {
                      setSelectedAccount(account);
                      setDeleteOpenModal(true);
                      setDeleteId(account.id);
                    }}
                  >
                    Delete
                  </button>
                </CardAction>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
            <div className="text-sm text-muted-foreground">
              {filteredAccounts.length} account
              {filteredAccounts.length !== 1 ? "s" : ""} found
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
                        className={
                          currentPage <= 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
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
                          if (currentPage < totalPages)
                            setCurrentPage(currentPage + 1);
                        }}
                        className={
                          currentPage >= totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      )}
      <ViewModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        account={selectedAccount}
      />
      <DeleteModal
        open={deleteOpenModal}
        onClose={() => setDeleteOpenModal(false)}
        account={selectedAccount}
        onDelete={handleDeleteAccount}
        loading={loading}
      />
    </section>
  );
}
