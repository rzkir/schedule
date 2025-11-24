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

import { ManagementAccountsType } from "@/types/ManagementAccounts";

export default function useManagementType() {
  // State untuk dialog dan form
  const [open, setOpen] = useState(false);
  const [TypeName, setTypeName] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editTypeId, setEditTypeId] = useState<string | null>(null);
  const [editTypeName, setEditTypeName] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTypeId, setDeleteTypeId] = useState<string | null>(null);
  const [deleteTypeName, setDeleteTypeName] = useState("");

  const [loading, setLoading] = useState(false);
  const [Type, setType] = useState<ManagementAccountsType[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(Type.length / itemsPerPage);
  const paginatedType = Type.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [Type, totalPages, currentPage]);

  useEffect(() => {
    const q = query(
      collection(
        db,
        process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS_TYPE as string
      ),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setType(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ManagementAccountsType[]
      );
    });
    return () => unsub();
  }, []);

  const addType = async (type: string) => {
    setLoading(true);
    try {
      await addDoc(
        collection(
          db,
          process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS_TYPE as string
        ),
        {
          type,
          createdAt: Timestamp.now(),
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const editType = async (id: string, type: string) => {
    setLoading(true);
    try {
      await updateDoc(
        doc(
          db,
          process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS_TYPE as string,
          id
        ),
        {
          type,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteType = async (id: string) => {
    setLoading(true);
    try {
      await deleteDoc(
        doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS_TYPE as string, id)
      );
    } finally {
      setLoading(false);
    }
  };

  // Handler untuk submit tambah type
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addType(TypeName);
      toast.success("Type berhasil ditambahkan");
    } catch {
      toast.error("Gagal menambah type");
    }
    setTypeName("");
    setOpen(false);
  };

  // Handler untuk buka dialog edit
  const handleEdit = (typeItem: ManagementAccountsType) => {
    setEditTypeId(typeItem.id);
    setEditTypeName(typeItem.type);
    setEditOpen(true);
  };

  // Handler untuk submit edit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editTypeId) {
      try {
        await editType(editTypeId, editTypeName);
        toast.success("Type berhasil diubah");
      } catch {
        toast.error("Gagal mengubah type");
      }
      setEditOpen(false);
      setEditTypeId(null);
      setEditTypeName("");
    }
  };

  // Handler untuk buka dialog hapus
  const handleDelete = (id: string, type: string) => {
    setDeleteTypeId(id);
    setDeleteTypeName(type);
    setDeleteOpen(true);
  };

  // Handler untuk konfirmasi hapus
  const handleDeleteConfirm = async () => {
    if (deleteTypeId) {
      try {
        await deleteType(deleteTypeId);
        toast.success("Type berhasil dihapus");
      } catch {
        toast.error("Gagal menghapus type");
      }
      setDeleteOpen(false);
      setDeleteTypeId(null);
      setDeleteTypeName("");
    }
  };

  return {
    addType,
    editType,
    deleteType,
    Type,
    loading,
    open,
    setOpen,
    TypeName,
    setTypeName,
    editOpen,
    setEditOpen,
    editTypeId,
    setEditTypeId,
    editTypeName,
    setEditTypeName,
    deleteOpen,
    setDeleteOpen,
    deleteTypeId,
    setDeleteTypeId,
    deleteTypeName,
    setDeleteTypeName,
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
    paginatedType,
  };
}
