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

import { categories } from "@/types/Proyek";

import { toast } from "sonner";

export default function useManagementCategory() {
  // State untuk dialog dan form
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [deleteCategoryName, setDeleteCategoryName] = useState("");

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<categories[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const paginatedCategories = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [categories, totalPages, currentPage]);

  useEffect(() => {
    const q = query(
      collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_CATEGORIES as string),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setCategories(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as categories[]
      );
    });
    return () => unsub();
  }, []);

  const addCategory = async (name: string) => {
    setLoading(true);
    try {
      await addDoc(
        collection(
          db,
          process.env.NEXT_PUBLIC_COLLECTIONS_CATEGORIES as string
        ),
        {
          name,
          createdAt: Timestamp.now(),
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const editCategory = async (id: string, name: string) => {
    setLoading(true);
    try {
      await updateDoc(
        doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_CATEGORIES as string, id),
        {
          name,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    setLoading(true);
    try {
      await deleteDoc(
        doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_CATEGORIES as string, id)
      );
    } finally {
      setLoading(false);
    }
  };

  // Handler untuk submit tambah kategori
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCategory(categoryName);
      toast.success("Kategori berhasil ditambahkan");
    } catch {
      toast.error("Gagal menambah kategori");
    }
    setCategoryName("");
    setOpen(false);
  };

  // Handler untuk buka dialog edit
  const handleEdit = (cat: categories) => {
    setEditCategoryId(cat.id);
    setEditCategoryName(cat.name);
    setEditOpen(true);
  };

  // Handler untuk submit edit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editCategoryId) {
      try {
        await editCategory(editCategoryId, editCategoryName);
        toast.success("Kategori berhasil diubah");
      } catch {
        toast.error("Gagal mengubah kategori");
      }
      setEditOpen(false);
      setEditCategoryId(null);
      setEditCategoryName("");
    }
  };

  // Handler untuk buka dialog hapus
  const handleDelete = (id: string, name: string) => {
    setDeleteCategoryId(id);
    setDeleteCategoryName(name);
    setDeleteOpen(true);
  };

  // Handler untuk konfirmasi hapus
  const handleDeleteConfirm = async () => {
    if (deleteCategoryId) {
      try {
        await deleteCategory(deleteCategoryId);
        toast.success("Kategori berhasil dihapus");
      } catch {
        toast.error("Gagal menghapus kategori");
      }
      setDeleteOpen(false);
      setDeleteCategoryId(null);
      setDeleteCategoryName("");
    }
  };

  return {
    addCategory,
    editCategory,
    deleteCategory,
    categories,
    loading,
    open,
    setOpen,
    categoryName,
    setCategoryName,
    editOpen,
    setEditOpen,
    editCategoryId,
    setEditCategoryId,
    editCategoryName,
    setEditCategoryName,
    deleteOpen,
    setDeleteOpen,
    deleteCategoryId,
    setDeleteCategoryId,
    deleteCategoryName,
    setDeleteCategoryName,
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
    paginatedCategories,
  };
}
