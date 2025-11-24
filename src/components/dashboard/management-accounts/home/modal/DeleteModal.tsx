import React from "react";

import { ManagementAccounts } from "@/types/ManagementAccounts";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  account: ManagementAccounts | null;
  onDelete: () => void;
  loading: boolean;
}

export default function DeleteModal({
  open,
  onClose,
  account,
  onDelete,
  loading,
}: DeleteModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) onClose();
      }}
    >
      <DialogContent showCloseButton={true}>
        <DialogHeader>
          <DialogTitle>Hapus Account</DialogTitle>
        </DialogHeader>
        {account && (
          <div className="mb-4">
            Yakin ingin menghapus account <b>{account.name}</b>?
          </div>
        )}
        <DialogFooter>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button variant="destructive" onClick={onDelete} disabled={loading}>
            {loading ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
