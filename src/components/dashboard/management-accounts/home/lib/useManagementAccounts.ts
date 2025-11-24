import { useState, useEffect, ChangeEvent } from "react";

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

import { ManagementAccounts } from "@/types/ManagementAccounts";

import useManagementType from "@/components/dashboard/management-accounts/type/lib/useManagementType";

import useManagementProvider from "@/components/dashboard/management-accounts/provider/lib/useManagementProvider";

const defaultForm: Omit<ManagementAccounts, "id" | "createdAt" | "updatedAt"> =
  {
    name: "",
    email: "",
    password: "",
    provider: "",
    type: "",
  };

export default function useManagementAccounts() {
  const [open, setOpen] = useState(false);
  const [form, setForm] =
    useState<Omit<ManagementAccounts, "id" | "createdAt" | "updatedAt">>(
      defaultForm
    );
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [accounts, setAccounts] = useState<ManagementAccounts[]>([]);

  // Filter state
  const [selectedProvider, setSelectedProvider] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchName, setSearchName] = useState<string>("");

  // Fetch types and providers
  const { Type: types, loading: loadingTypes } = useManagementType();
  const { Provider: providers, loading: loadingProviders } =
    useManagementProvider();

  // Filter accounts based on selected filters and search
  const filteredAccounts = accounts.filter((account) => {
    const providerMatch =
      selectedProvider === "all" || account.provider === selectedProvider;
    const typeMatch = selectedType === "all" || account.type === selectedType;
    const nameMatch =
      searchName === "" ||
      account.name.toLowerCase().includes(searchName.toLowerCase());

    return providerMatch && typeMatch && nameMatch;
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedProvider, selectedType, searchName]);

  // Reset to first page when current page exceeds total pages
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Listen to management accounts collection
  useEffect(() => {
    const q = query(
      collection(
        db,
        process.env.NEXT_PUBLIC_COLLECTIONS_MANAGEMENT_ACCOUNTS as string
      ),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setAccounts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ManagementAccounts[]
      );
      setInitialLoading(false);
    });
    return () => unsub();
  }, []);

  // Handle input change
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Add Account
  const addAccount = async () => {
    setLoading(true);
    try {
      // Ambil nama provider dari id
      let providerName = form.provider;
      const selectedProviderObj = providers.find((p) => p.id === form.provider);
      if (selectedProviderObj) {
        providerName = selectedProviderObj.provider;
      }
      // Ambil nama type dari id
      let typeName = form.type;
      const selectedTypeObj = types.find((t) => t.id === form.type);
      if (selectedTypeObj) {
        typeName = selectedTypeObj.type;
      }
      await addDoc(
        collection(
          db,
          process.env.NEXT_PUBLIC_COLLECTIONS_MANAGEMENT_ACCOUNTS as string
        ),
        {
          ...form,
          provider: providerName, // Simpan name, bukan id
          type: typeName, // Simpan name, bukan id
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }
      );
      toast.success("Account berhasil ditambahkan");
      setForm(defaultForm);
      setOpen(false);
    } catch {
      toast.error("Gagal menambah account");
    }
    setLoading(false);
  };

  // Edit Account
  const editAccount = async () => {
    if (!editId) return;
    setLoading(true);
    try {
      // Ambil nama provider dari id
      let providerName = form.provider;
      const selectedProviderObj = providers.find((p) => p.id === form.provider);
      if (selectedProviderObj) {
        providerName = selectedProviderObj.provider;
      }
      // Ambil nama type dari id
      let typeName = form.type;
      const selectedTypeObj = types.find((t) => t.id === form.type);
      if (selectedTypeObj) {
        typeName = selectedTypeObj.type;
      }
      await updateDoc(
        doc(
          db,
          process.env.NEXT_PUBLIC_COLLECTIONS_MANAGEMENT_ACCOUNTS as string,
          editId
        ),
        {
          ...form,
          provider: providerName, // Simpan name, bukan id
          type: typeName, // Simpan name, bukan id
          updatedAt: Timestamp.now(),
        }
      );
      toast.success("Account berhasil diubah");
      setForm(defaultForm);
      setEditOpen(false);
      setEditId(null);
    } catch {
      toast.error("Gagal mengubah account");
    }
    setLoading(false);
  };

  // Delete Account
  const deleteAccount = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      await deleteDoc(
        doc(
          db,
          process.env.NEXT_PUBLIC_COLLECTIONS_MANAGEMENT_ACCOUNTS as string,
          deleteId
        )
      );
      toast.success("Account berhasil dihapus");
      setDeleteOpen(false);
      setDeleteId(null);
    } catch {
      toast.error("Gagal menghapus account");
    }
    setLoading(false);
  };

  // Handler untuk buka dialog edit
  const handleEdit = (account: ManagementAccounts) => {
    setEditId(account.id);
    // Cari id provider berdasarkan nama provider yang ada di account
    const providerId =
      providers.find((p) => p.provider === account.provider)?.id || "";
    // Cari id type berdasarkan nama type yang ada di account
    const typeId = types.find((t) => t.type === account.type)?.id || "";
    setForm({ ...account, provider: providerId, type: typeId });
    setEditOpen(true);
  };

  return {
    accounts,
    filteredAccounts,
    loading,
    initialLoading,
    open,
    setOpen,
    form,
    setForm,
    handleInputChange,
    addAccount,
    editOpen,
    setEditOpen,
    editId,
    setEditId,
    editAccount,
    handleEdit,
    deleteOpen,
    setDeleteOpen,
    deleteId,
    setDeleteId,
    deleteAccount,
    // types/providers
    types,
    loadingTypes,
    providers,
    loadingProviders,
    // pagination
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages,
    paginatedAccounts,
    // filter
    selectedProvider,
    setSelectedProvider,
    selectedType,
    setSelectedType,
    searchName,
    setSearchName,
  };
}
