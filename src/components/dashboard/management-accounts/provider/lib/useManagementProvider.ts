import { useState, useEffect } from "react";

import { db } from "@/utils/firebase/firebase";

import {
  collection,
  addDoc,
  Timestamp,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { toast } from "sonner";

import { ManagementAccountsProvider } from "@/types/ManagementAccounts";

export default function useManagementProvider() {
  // State untuk dialog dan form
  const [open, setOpen] = useState(false);
  const [ProviderName, setProviderName] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editProviderId, setEditProviderId] = useState<string | null>(null);
  const [editProviderName, setEditProviderName] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteProviderId, setDeleteProviderId] = useState<string | null>(null);
  const [deleteProviderName, setDeleteProviderName] = useState("");

  const [loading, setLoading] = useState(false);
  const [Provider, setProvider] = useState<ManagementAccountsProvider[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(Provider.length / itemsPerPage);
  const paginatedProvider = Provider.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [Provider, totalPages, currentPage]);

  useEffect(() => {
    const q = query(
      collection(
        db,
        process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS_PROVIDER as string
      ),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setProvider(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ManagementAccountsProvider[]
      );
    });
    return () => unsub();
  }, []);

  const addProvider = async (provider: string) => {
    setLoading(true);
    try {
      await addDoc(
        collection(
          db,
          process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS_PROVIDER as string
        ),
        {
          provider,
          createdAt: Timestamp.now(),
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const editProvider = async (id: string, provider: string) => {
    setLoading(true);
    try {
      await updateDoc(
        doc(
          db,
          process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS_PROVIDER as string,
          id
        ),
        {
          provider,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteProvider = async (id: string) => {
    setLoading(true);
    try {
      await deleteDoc(
        doc(
          db,
          process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS_PROVIDER as string,
          id
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // Handler untuk submit tambah provider
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProvider(ProviderName);
      toast.success("Provider berhasil ditambahkan");
    } catch {
      toast.error("Gagal menambah provider");
    }
    setProviderName("");
    setOpen(false);
  };

  // Handler untuk buka dialog edit
  const handleEdit = (providerItem: ManagementAccountsProvider) => {
    setEditProviderId(providerItem.id);
    setEditProviderName(providerItem.provider);
    setEditOpen(true);
  };

  // Handler untuk submit edit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editProviderId) {
      try {
        await editProvider(editProviderId, editProviderName);
        toast.success("Provider berhasil diubah");
      } catch {
        toast.error("Gagal mengubah provider");
      }
      setEditOpen(false);
      setEditProviderId(null);
      setEditProviderName("");
    }
  };

  // Handler untuk buka dialog hapus
  const handleDelete = (id: string, provider: string) => {
    setDeleteProviderId(id);
    setDeleteProviderName(provider);
    setDeleteOpen(true);
  };

  // Handler untuk konfirmasi hapus
  const handleDeleteConfirm = async () => {
    if (deleteProviderId) {
      try {
        await deleteProvider(deleteProviderId);
        toast.success("Provider berhasil dihapus");
      } catch {
        toast.error("Gagal menghapus provider");
      }
      setDeleteOpen(false);
      setDeleteProviderId(null);
      setDeleteProviderName("");
    }
  };

  return {
    addProvider,
    editProvider,
    deleteProvider,
    Provider,
    loading,
    open,
    setOpen,
    ProviderName,
    setProviderName,
    editOpen,
    setEditOpen,
    editProviderId,
    setEditProviderId,
    editProviderName,
    setEditProviderName,
    deleteOpen,
    setDeleteOpen,
    deleteProviderId,
    setDeleteProviderId,
    deleteProviderName,
    setDeleteProviderName,
    handleSubmit,
    handleEdit,
    handleEditSubmit,
    handleDelete,
    handleDeleteConfirm,
    // pagination
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages,
    paginatedProvider,
  };
}
