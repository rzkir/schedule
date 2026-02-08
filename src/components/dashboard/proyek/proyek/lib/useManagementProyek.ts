import { useState, useEffect, ChangeEvent } from "react";

import { db } from "@/utils/firebase/firebase";

import imagekitInstance from "@/utils/imagekit/Imagekit";

import {
  collection,
  addDoc,
  Timestamp,
  onSnapshot,
  query,
  orderBy,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { toast } from "sonner";

import { Proyek } from "@/types/Proyek";

import useManagementCategory from "../../category/lib/useManagementCategory";

import useManagementFramework from "../../framework/lib/useManagementFramework";

import { useAuth } from "@/utils/context/AuthContext";

const defaultForm: Omit<Proyek, "id" | "createdAt" | "updatedAt"> = {
  title: "",
  description: "",
  start_date: Timestamp.now(),
  end_date: Timestamp.now(),
  status: "draft",
  progres: "pending",
  category: "",
  thumbnail: "",
  framework: [], // array of id framework
  nama_user: "",
  accounts: [],
  price: 0,
  deposit: [],
  link: [],
};

export default function useManagementProyek() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] =
    useState<Omit<Proyek, "id" | "createdAt" | "updatedAt">>(defaultForm);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [proyeks, setProyeks] = useState<Proyek[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProgress, setSelectedProgress] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTitle, setSearchTitle] = useState<string>("");

  // Fetch categories and frameworks
  const { categories, loading: loadingCategories } = useManagementCategory();
  const { Framework: frameworks, loading: loadingFrameworks } =
    useManagementFramework();

  // Filter projects based on selected filters and search
  const filteredProyeks = proyeks.filter((proyek) => {
    const categoryMatch =
      selectedCategory === "all" || proyek.category === selectedCategory;
    const progressMatch =
      selectedProgress === "all" || proyek.progres === selectedProgress;
    const statusMatch =
      selectedStatus === "all" || proyek.status === selectedStatus;
    const titleMatch =
      searchTitle === "" ||
      proyek.title.toLowerCase().includes(searchTitle.toLowerCase());

    return categoryMatch && progressMatch && statusMatch && titleMatch;
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredProyeks.length / itemsPerPage);
  const paginatedProyeks = filteredProyeks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedProgress, selectedStatus, searchTitle]);

  // Reset to first page when current page exceeds total pages
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Listen to proyek collection
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
      setInitialLoading(false);
    });
    return () => unsub();
  }, []);

  // Handle input change
  const handleInputChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      | {
        target: {
          name: string;
          value: string | number | string[];
          type?: string;
        };
      }
  ) => {
    const { name, value, type } = e.target;
    if (type === "date") {
      setForm((prev) => ({
        ...prev,
        [name]: Timestamp.fromDate(new Date(value as string)),
      }));
    } else if (name === "price") {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else if (name === "framework") {
      setForm((prev) => ({ ...prev, framework: value as string[] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle image file change
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  // Upload image to ImageKit
  const uploadImage = async (file: File): Promise<string | null> => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Format file tidak didukung. Gunakan JPG, PNG, atau WebP");
      return null;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar. Maksimal 5MB");
      return null;
    }
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result;
        if (typeof base64data !== "string") {
          toast.error("Terjadi kesalahan saat memproses gambar");
          resolve(null);
          return;
        }
        const base64String = base64data.split(",")[1];
        try {
          const uploadResponse = await imagekitInstance.upload({
            file: base64String,
            fileName: `proyek_${Date.now()}.jpg`,
            folder: "/proyeks",
          });
          resolve(uploadResponse.url || null);
        } catch {
          toast.error("Terjadi kesalahan saat mengupload gambar");
          resolve(null);
        }
      };
    });
  };

  // Add Proyek
  const addProyek = async () => {
    setLoading(true);
    try {
      let thumbnailUrl = "";
      if (imageFile) {
        const url = await uploadImage(imageFile);
        if (!url) throw new Error("Gagal upload gambar");
        thumbnailUrl = url;
      }
      // Ambil nama kategori dari id
      let categoryName = form.category;
      const selectedCategory = categories.find(
        (cat) => cat.id === form.category
      );
      if (selectedCategory) {
        categoryName = selectedCategory.name;
      }
      // Konversi framework id[] ke array of object { name }
      const frameworkArr = (form.framework as string[]).map((fid) => {
        const fw = frameworks.find((f) => f.id === fid);
        return { name: fw ? fw.name : fid };
      });
      if (!user?.uid) {
        toast.error("Anda harus login untuk menambah proyek");
        return;
      }

      await addDoc(
        collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_PROYEK as string),
        {
          ...form,
          uid: user.uid,
          category: categoryName, // Simpan name, bukan id
          framework: frameworkArr, // Simpan array of object
          thumbnail: thumbnailUrl,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }
      );
      toast.success("Proyek berhasil ditambahkan");
      setForm(defaultForm);
      setImageFile(null);
      setOpen(false);
    } catch {
      toast.error("Gagal menambah proyek");
    }
    setLoading(false);
  };

  // Edit Proyek
  const editProyek = async () => {
    if (!editId) return;
    setLoading(true);
    try {
      let thumbnailUrl = form.thumbnail || "";
      if (imageFile) {
        const url = await uploadImage(imageFile);
        if (!url) throw new Error("Gagal upload gambar");
        thumbnailUrl = url;
      }
      // Ambil nama kategori dari id
      let categoryName = form.category;
      const selectedCategory = categories.find(
        (cat) => cat.id === form.category
      );
      if (selectedCategory) {
        categoryName = selectedCategory.name;
      }
      // Konversi framework id[] ke array of object { name }
      const frameworkArr = (form.framework as string[]).map((fid) => {
        const fw = frameworks.find((f) => f.id === fid);
        return { name: fw ? fw.name : fid };
      });
      await updateDoc(
        doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_PROYEK as string, editId),
        {
          ...form,
          category: categoryName, // Simpan name, bukan id
          framework: frameworkArr, // Simpan array of object
          thumbnail: thumbnailUrl,
          updatedAt: Timestamp.now(),
        }
      );
      toast.success("Proyek berhasil diubah");
      setForm(defaultForm);
      setImageFile(null);
      setEditOpen(false);
      setEditId(null);
    } catch {
      toast.error("Gagal mengubah proyek");
    }
    setLoading(false);
  };

  // Delete Proyek
  const deleteProyek = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      await deleteDoc(
        doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_PROYEK as string, deleteId)
      );
      toast.success("Proyek berhasil dihapus");
      setDeleteOpen(false);
      setDeleteId(null);
    } catch {
      toast.error("Gagal menghapus proyek");
    }
    setLoading(false);
  };

  // Handler untuk buka dialog edit
  const handleEdit = (proyek: Proyek) => {
    setEditId(proyek.id);
    // Konversi framework dari array of object ke array of id
    const frameworkIds = Array.isArray(proyek.framework)
      ? proyek.framework.map((fw: { name: string } | string) => {
        if (typeof fw === "string") return fw;
        return frameworks.find((f) => f.name === fw.name)?.id || fw.name;
      })
      : [];
    // Cari id kategori berdasarkan nama kategori yang ada di proyek
    const categoryId =
      categories.find((cat) => cat.name === proyek.category)?.id || "";
    setForm({ ...proyek, category: categoryId, framework: frameworkIds });
    setEditOpen(true);
  };

  // Handler untuk buka dialog hapus
  const handleDelete = (id: string) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  // Handler untuk menambah link
  const addLink = () => {
    setForm((f) => ({
      ...f,
      link: [
        ...(f.link || []),
        {
          id: Math.random().toString(36).slice(2),
          label: "",
          url: "",
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        },
      ],
    }));
  };

  // Handler untuk update link
  const updateLink = (idx: number, field: "label" | "url", value: string) => {
    setForm((f) => {
      const newLinks = [...(f.link || [])];
      newLinks[idx] = {
        ...newLinks[idx],
        [field]: value,
        updatedAt: Timestamp.now(),
      };
      return { ...f, link: newLinks };
    });
  };

  // Handler untuk hapus link
  const removeLink = (idx: number) => {
    setForm((f) => ({
      ...f,
      link: (f.link || []).filter((_, i) => i !== idx),
    }));
  };

  // Handler untuk menambah deposit
  const addDeposit = () => {
    setForm((f) => ({
      ...f,
      deposit: [
        ...(f.deposit || []),
        {
          id: Math.random().toString(36).slice(2),
          label: "",
          price: 0,
          percent: 0,
        },
      ],
    }));
  };
  // Handler untuk update deposit
  const updateDeposit = (
    idx: number,
    field: "label" | "price" | "percent",
    value: string | number
  ) => {
    setForm((f) => {
      const newDeposits = [...(f.deposit || [])];
      newDeposits[idx] = { ...newDeposits[idx], [field]: value };
      return { ...f, deposit: newDeposits };
    });
  };
  // Handler untuk hapus deposit
  const removeDeposit = (idx: number) => {
    setForm((f) => ({
      ...f,
      deposit: (f.deposit || []).filter((_, i) => i !== idx),
    }));
  };

  // Handler untuk menambah account
  const addAccount = () => {
    setForm((f) => ({
      ...f,
      accounts: [
        ...(f.accounts || []),
        {
          label: "",
          email: "",
          password: "",
        },
      ],
    }));
  };

  // Handler untuk update account
  const updateAccount = (
    idx: number,
    field: "label" | "email" | "password",
    value: string
  ) => {
    setForm((f) => {
      const newAccounts = [...(f.accounts || [])];
      newAccounts[idx] = { ...newAccounts[idx], [field]: value };
      return { ...f, accounts: newAccounts };
    });
  };

  // Handler untuk hapus account
  const removeAccount = (idx: number) => {
    setForm((f) => ({
      ...f,
      accounts: (f.accounts || []).filter((_, i) => i !== idx),
    }));
  };

  return {
    proyeks,
    filteredProyeks,
    loading,
    initialLoading,
    open,
    setOpen,
    form,
    setForm,
    imageFile,
    setImageFile,
    handleInputChange,
    handleImageChange,
    addProyek,
    editOpen,
    setEditOpen,
    editId,
    setEditId,
    editProyek,
    handleEdit,
    deleteOpen,
    setDeleteOpen,
    deleteId,
    setDeleteId,
    deleteProyek,
    handleDelete,
    addLink,
    updateLink,
    removeLink,
    addDeposit,
    updateDeposit,
    removeDeposit,
    addAccount,
    updateAccount,
    removeAccount,
    // categories/frameworks
    categories,
    loadingCategories,
    frameworks,
    loadingFrameworks,
    // pagination
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages,
    paginatedProyeks,
    // filter
    selectedCategory,
    setSelectedCategory,
    selectedProgress,
    setSelectedProgress,
    selectedStatus,
    setSelectedStatus,
    searchTitle,
    setSearchTitle,
  };
}
