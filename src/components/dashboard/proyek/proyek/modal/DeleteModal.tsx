import React from 'react'

import { Proyek } from '@/types/Proyek';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';

interface DeleteModalProps {
    open: boolean;
    onClose: () => void;
    proyek: Proyek | null;
    onDelete: () => void;
    loading: boolean;
}

export default function DeleteModal({ open, onClose, proyek, onDelete, loading }: DeleteModalProps) {
    return (
        <Dialog open={open} onOpenChange={(val) => { if (!val) onClose(); }}>
            <DialogContent showCloseButton={true}>
                <DialogHeader>
                    <DialogTitle>Hapus Proyek</DialogTitle>
                </DialogHeader>
                {proyek && (
                    <div className="mb-4">Yakin ingin menghapus proyek <b>{proyek.title}</b>?</div>
                )}
                <DialogFooter>
                    <Button variant="secondary" onClick={onClose} disabled={loading}>Batal</Button>
                    <Button variant="destructive" onClick={onDelete} disabled={loading}>
                        {loading ? 'Menghapus...' : 'Hapus'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
