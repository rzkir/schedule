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

import { frameworks } from "@/types/Proyek";

export default function useManagementFramework() {
  // State untuk dialog dan form
  const [open, setOpen] = useState(false);
  const [FrameworkName, setFrameworkName] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editFrameworkId, setEditFrameworkId] = useState<string | null>(null);
  const [editFrameworkName, setEditFrameworkName] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteFrameworkId, setDeleteFrameworkId] = useState<string | null>(
    null
  );
  const [deleteFrameworkName, setDeleteFrameworkName] = useState("");

  const [loading, setLoading] = useState(false);
  const [Framework, setFramework] = useState<frameworks[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(Framework.length / itemsPerPage);
  const paginatedFramework = Framework.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [Framework, totalPages, currentPage]);

  useEffect(() => {
    const q = query(
      collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_FRAMEWORK as string),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setFramework(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as frameworks[]
      );
    });
    return () => unsub();
  }, []);

  const addFramework = async (name: string) => {
    setLoading(true);
    try {
      await addDoc(
        collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_FRAMEWORK as string),
        {
          name,
          createdAt: Timestamp.now(),
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const editFramework = async (id: string, name: string) => {
    setLoading(true);
    try {
      await updateDoc(
        doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_FRAMEWORK as string, id),
        {
          name,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteFramework = async (id: string) => {
    setLoading(true);
    try {
      await deleteDoc(
        doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_FRAMEWORK as string, id)
      );
    } finally {
      setLoading(false);
    }
  };

  // Handler untuk submit tambah kategori
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addFramework(FrameworkName);
      toast.success("Kategori berhasil ditambahkan");
    } catch {
      toast.error("Gagal menambah kategori");
    }
    setFrameworkName("");
    setOpen(false);
  };

  // Handler untuk buka dialog edit
  const handleEdit = (cat: frameworks) => {
    setEditFrameworkId(cat.id);
    setEditFrameworkName(cat.name);
    setEditOpen(true);
  };

  // Handler untuk submit edit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editFrameworkId) {
      try {
        await editFramework(editFrameworkId, editFrameworkName);
        toast.success("Kategori berhasil diubah");
      } catch {
        toast.error("Gagal mengubah kategori");
      }
      setEditOpen(false);
      setEditFrameworkId(null);
      setEditFrameworkName("");
    }
  };

  // Handler untuk buka dialog hapus
  const handleDelete = (id: string, name: string) => {
    setDeleteFrameworkId(id);
    setDeleteFrameworkName(name);
    setDeleteOpen(true);
  };

  // Handler untuk konfirmasi hapus
  const handleDeleteConfirm = async () => {
    if (deleteFrameworkId) {
      try {
        await deleteFramework(deleteFrameworkId);
        toast.success("Kategori berhasil dihapus");
      } catch {
        toast.error("Gagal menghapus kategori");
      }
      setDeleteOpen(false);
      setDeleteFrameworkId(null);
      setDeleteFrameworkName("");
    }
  };

  return {
    addFramework,
    editFramework,
    deleteFramework,
    Framework,
    loading,
    open,
    setOpen,
    FrameworkName,
    setFrameworkName,
    editOpen,
    setEditOpen,
    editFrameworkId,
    setEditFrameworkId,
    editFrameworkName,
    setEditFrameworkName,
    deleteOpen,
    setDeleteOpen,
    deleteFrameworkId,
    setDeleteFrameworkId,
    deleteFrameworkName,
    setDeleteFrameworkName,
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
    paginatedFramework,
  };
}
