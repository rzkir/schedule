import React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Proyek } from '@/types/Proyek';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { CalendarIcon } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { Check, ChevronsUpDown, Camera, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
} from '@/components/ui/context-menu';

import Image from 'next/image';
import { formatIDR } from '@/lib/formatPrice';
import { Checkbox } from '@/components/ui/checkbox';

// DatePicker component
function DatePicker({ label, value, onChange, name, required = false }: {
    label: string;
    value: Timestamp | null | undefined;
    onChange: (date: Date | null) => void;
    name: string;
    required?: boolean;
}) {
    const [open, setOpen] = React.useState(false);
    const dateValue = value ? value.toDate() : undefined;
    const [inputValue, setInputValue] = React.useState(dateValue ? formatDate(dateValue) : '');
    const [month, setMonth] = React.useState<Date | undefined>(dateValue);

    React.useEffect(() => {
        if (dateValue) setInputValue(formatDate(dateValue));
    }, [dateValue]);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const d = new Date(e.target.value);
        setInputValue(e.target.value);
        if (isValidDate(d)) {
            onChange(d);
            setMonth(d);
        }
    }

    return (
        <div className="flex flex-col gap-1">
            <Label htmlFor={name} className="px-1">{label}</Label>
            <div className="relative flex gap-2">
                <Input
                    id={name}
                    name={name}
                    value={inputValue}
                    placeholder="1 January 2025"
                    className="bg-background pr-10"
                    onChange={handleInputChange}
                    onKeyDown={e => {
                        if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            setOpen(true);
                        }
                    }}
                    required={required}
                />
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            id={`${name}-picker`}
                            variant="ghost"
                            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                            type="button"
                        >
                            <CalendarIcon className="size-3.5" />
                            <span className="sr-only">Select date</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="end"
                        alignOffset={-8}
                        sideOffset={10}
                    >
                        <Calendar
                            mode="single"
                            selected={dateValue}
                            captionLayout="dropdown"
                            month={month}
                            onMonthChange={setMonth}
                            onSelect={date => {
                                if (date) {
                                    onChange(date);
                                    setInputValue(formatDate(date));
                                }
                                setOpen(false);
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}

function formatDate(date: Date | undefined) {
    if (!date) return '';
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

function isValidDate(date: Date | undefined) {
    if (!date) return false;
    return !isNaN(date.getTime());
}

// Add Combobox component for category and framework selection
function Combobox({
    label,
    name,
    options,
    value,
    onChange,
    loading = false,
    placeholder = "Pilih..."
}: {
    label: string;
    name: string;
    options: { id: string; name: string }[];
    value: string;
    onChange: (value: string) => void;
    loading?: boolean;
    placeholder?: string;
}) {
    const [open, setOpen] = React.useState(false);
    // Find the selected option by id, not name
    const selectedOption = options.find((opt) => opt.id === value);
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={name}>{label}</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                        type="button"
                        disabled={loading}
                    >
                        {selectedOption ? selectedOption.name : placeholder}
                        <ChevronsUpDown className="opacity-50 ml-2" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full min-w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder={`Cari ${label.toLowerCase()}...`} className="h-9" />
                        <CommandList>
                            <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                            <CommandGroup>
                                {options.map((opt) => (
                                    <CommandItem
                                        key={opt.id}
                                        value={opt.id}
                                        onSelect={(currentValue) => {
                                            onChange(currentValue === value ? '' : currentValue);
                                            setOpen(false);
                                        }}
                                    >
                                        {opt.name}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                value === opt.id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}

interface ModalFormProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    loading: boolean;
    form: Omit<Proyek, 'id' | 'createdAt' | 'updatedAt'>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    addProyek: () => void;
    categories: { id: string; name: string }[];
    frameworks: { id: string; name: string }[];
    loadingCategories: boolean;
    loadingFrameworks: boolean;
    addLink: () => void;
    updateLink: (idx: number, field: 'label' | 'url', value: string) => void;
    removeLink: (idx: number) => void;
    addDeposit: () => void;
    updateDeposit: (idx: number, field: 'label' | 'price' | 'percent', value: string | number) => void;
    removeDeposit: (idx: number) => void;
    addAccount: () => void;
    updateAccount: (idx: number, field: 'label' | 'email' | 'password', value: string) => void;
    removeAccount: (idx: number) => void;
}

export default function ModalForm({
    open,
    setOpen,
    loading,
    form,
    handleInputChange,
    handleImageChange,
    addProyek,
    categories,
    frameworks,
    loadingCategories,
    loadingFrameworks,
    addLink,
    updateLink,
    removeLink,
    addDeposit,
    updateDeposit,
    removeDeposit,
    addAccount,
    updateAccount,
    removeAccount
}: ModalFormProps) {
    // Handler for date change
    function handleDateChange(name: string, date: Date | null) {
        if (!date) return;
        // Use Timestamp.fromDate for Firestore compatibility
        handleInputChange({
            target: {
                name,
                value: date.toISOString().split('T')[0],
                type: 'date',
            }
        } as React.ChangeEvent<HTMLInputElement>);
    }

    // --- Tambahkan state untuk preview gambar ---
    const [previewImage, setPreviewImage] = React.useState<string | null>(null);

    // Sinkronisasi previewImage dengan thumbnail saat edit
    React.useEffect(() => {
        if (open && form.thumbnail && !previewImage) {
            setPreviewImage(form.thumbnail);
        }
        if (!open) {
            setPreviewImage(null);
        }
    }, [form.thumbnail, open, previewImage]);

    // --- Bungkus handleImageChange agar update preview juga ---
    function handleImageChangeWithPreview(e: React.ChangeEvent<HTMLInputElement>) {
        handleImageChange(e);
        const file = e.target.files && e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewImage(url);
        } else {
            setPreviewImage(null);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90 transition-colors px-6 py-2 rounded-lg">
                    Add Proyek
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        {form.title ? 'Edit Project' : 'Create Project'}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        {form.title ? 'Edit the details below to update the project' : 'Fill in the details below to create new project'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={e => { e.preventDefault(); addProyek(); }} className="space-y-6 overflow-y-auto pr-2 py-4">
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="title" className="px-1">Judul Proyek</Label>
                            <Input
                                type="text"
                                name="title"
                                id="title"
                                placeholder="Judul Proyek"
                                value={form.title || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="status" className="px-1">Status</Label>
                            <select
                                name="status"
                                id="status"
                                value={form.status || 'draft'}
                                onChange={handleInputChange}
                                className="border border-input rounded-lg px-4 py-2 bg-background text-foreground"
                                required
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="description">Deskripsi Proyek</Label>
                        <Textarea
                            name="description"
                            id="description"
                            placeholder="Deskripsi Proyek"
                            value={form.description || ''}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="nama_user" className="px-1">Nama User</Label>
                            <Input
                                type="text"
                                name="nama_user"
                                id="nama_user"
                                placeholder="Nama User"
                                value={form.nama_user || ''}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="price" className="px-1">Harga Proyek</Label>
                            <div className="relative flex items-center">
                                <span className="absolute left-3 text-muted-foreground text-sm">Rp</span>
                                <Input
                                    type="text"
                                    name="price"
                                    id="price"
                                    placeholder="Harga Proyek"
                                    value={form.price > 0 ? formatIDR(form.price) : ''}
                                    onChange={e => {
                                        const raw = e.target.value.replace(/\./g, '');
                                        const num = Number(raw);
                                        handleInputChange({
                                            ...e,
                                            target: { ...e.target, name: 'price', value: num.toString(), type: 'number' }
                                        });
                                    }}
                                    min={0}
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium">Accounts</label>
                        {form.accounts && form.accounts.length > 0 && form.accounts.map((account, idx) => (
                            <div key={idx} className="flex gap-2 mb-1 items-end">
                                <Input
                                    type="text"
                                    placeholder="Label Account"
                                    value={account.label || ''}
                                    onChange={e => updateAccount(idx, 'label', e.target.value)}
                                    className="w-1/3"
                                />
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={account.email || ''}
                                    onChange={e => updateAccount(idx, 'email', e.target.value)}
                                    className="w-1/3"
                                />
                                <Input
                                    type="text"
                                    placeholder="Password"
                                    value={account.password || ''}
                                    onChange={e => updateAccount(idx, 'password', e.target.value)}
                                    className="w-1/3"
                                />

                                <Button
                                    type="button"
                                    variant="destructive" size="sm"
                                    onClick={() => removeAccount(idx)}
                                    className="px-2"
                                >
                                    Hapus
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            onClick={addAccount}
                            className="w-full"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Account
                        </Button>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
                        {/* Progres Combobox */}
                        <Combobox
                            label="Progres"
                            name="progres"
                            options={[
                                { id: 'pending', name: 'Pending' },
                                { id: 'progress', name: 'Progress' },
                                { id: 'revisi', name: 'Revisi' },
                                { id: 'selesai', name: 'Selesai' },
                            ]}
                            value={form.progres || ''}
                            onChange={val => handleInputChange({
                                target: { name: 'progres', value: val, type: 'text' }
                            } as React.ChangeEvent<HTMLInputElement>)}
                            placeholder="Pilih Progres"
                        />
                        {/* Category Combobox */}
                        <Combobox
                            label="Kategori"
                            name="category"
                            options={categories}
                            value={form.category || ''}
                            onChange={val => handleInputChange({
                                target: { name: 'category', value: val, type: 'text' }
                            } as React.ChangeEvent<HTMLInputElement>)}
                            loading={loadingCategories}
                            placeholder="Pilih Kategori"
                        />
                        {/* Framework Combobox */}
                        {/* Multi-select Framework dengan Checkbox di Popover */}
                        <div className="flex flex-col gap-2">
                            <Label>Framework</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-between"
                                        type="button"
                                        disabled={loadingFrameworks}
                                    >
                                        {Array.isArray(form.framework) && form.framework.length > 0
                                            ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {form.framework.map((fw: string) => {
                                                        const fwObj = frameworks.find(f => f.id === fw) || { name: fw };
                                                        return <span key={fw} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">{fwObj.name}</span>;
                                                    })}
                                                </div>
                                            )
                                            : <span className="text-muted-foreground">Pilih Framework</span>
                                        }
                                        <ChevronsUpDown className="opacity-50 ml-2" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full min-w-[200px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Cari framework..." className="h-9" />
                                        <CommandList>
                                            <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                            <CommandGroup>
                                                {frameworks.map((opt) => (
                                                    <CommandItem
                                                        key={opt.id}
                                                        value={opt.id}
                                                        onSelect={() => {
                                                            let newArr = Array.isArray(form.framework) ? [...form.framework] : [];
                                                            if (newArr.includes(opt.id)) {
                                                                newArr = newArr.filter(fw => fw !== opt.id);
                                                            } else {
                                                                newArr.push(opt.id);
                                                            }
                                                            // Simulasikan event agar handler form tetap konsisten
                                                            handleInputChange({
                                                                target: { name: 'framework', value: newArr, type: 'custom' }
                                                            } as unknown as React.ChangeEvent<HTMLInputElement>);
                                                        }}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Checkbox checked={Array.isArray(form.framework) && form.framework.includes(opt.id)} />
                                                        {opt.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    {/* Date pickers for start_date and end_date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <DatePicker
                            label="Tanggal Mulai"
                            name="start_date"
                            value={form.start_date}
                            onChange={date => handleDateChange('start_date', date)}
                            required
                        />

                        <DatePicker
                            label="Tanggal Selesai"
                            name="end_date"
                            value={form.end_date}
                            onChange={date => handleDateChange('end_date', date)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium">Deposit</label>
                        {(form.deposit && form.deposit.length > 0 ? form.deposit : [{ label: '', price: 0, percent: 0 }]).map((d, idx) => (
                            <div key={idx} className="flex gap-2 mb-1 items-end">
                                <Input
                                    type="text"
                                    placeholder="Label"
                                    value={d.label || ''}
                                    onChange={e => updateDeposit(idx, 'label', e.target.value)}
                                    className="w-1/3"
                                />
                                <div className="w-1/3 flex flex-col gap-1">
                                    <div className="relative flex items-center">
                                        <span className="absolute left-3 text-muted-foreground text-sm">Rp</span>
                                        <Input
                                            type="text"
                                            placeholder="Nominal"
                                            value={d.price > 0 ? formatIDR(d.price) : ''}
                                            onChange={e => {
                                                const raw = e.target.value.replace(/\./g, '');
                                                const num = Number(raw);
                                                updateDeposit(idx, 'price', num);
                                            }}
                                            min={0}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <div className="relative flex items-center w-1/3">
                                    <span className="absolute left-3 text-muted-foreground text-sm">%</span>
                                    <Input
                                        type="number"
                                        placeholder="Persen (%)"
                                        value={String(d.percent || 0)}
                                        onChange={e => updateDeposit(idx, 'percent', Number(e.target.value))}
                                        min={0}
                                        max={100}
                                        className="pl-8"
                                    />
                                </div>
                                <Button type="button" variant="destructive" size="sm" onClick={() => removeDeposit(idx)}>
                                    Hapus
                                </Button>
                            </div>
                        ))}
                        <Button type="button" size="sm" onClick={addDeposit}>
                            Tambah Deposit
                        </Button>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium">Link</label>
                        {form.link && form.link.length > 0 && form.link.map((l: { label: string; url: string }, idx: number) => (
                            <div key={idx} className="flex gap-2 mb-1">
                                <Input
                                    type="text"
                                    placeholder="Label"
                                    value={l.label || ''}
                                    onChange={e => updateLink(idx, 'label', e.target.value)}
                                    className="w-1/3"
                                />
                                <Input
                                    type="url"
                                    placeholder="URL"
                                    value={l.url || ''}
                                    onChange={e => updateLink(idx, 'url', e.target.value)}
                                    className="w-2/3"
                                />
                                <Button type="button" variant="destructive" size="sm" onClick={() => removeLink(idx)}>
                                    Hapus
                                </Button>
                            </div>
                        ))}
                        <Button type="button" size="sm" onClick={addLink}>
                            Tambah Link
                        </Button>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="image" className="px-1">Gambar Proyek</Label>
                        {/* Input file hanya muncul jika tidak ada preview */}
                        {previewImage === null ? (
                            <ContextMenu>
                                <ContextMenuTrigger asChild>
                                    <div className="flex flex-col items-center justify-center border border-dashed border-input rounded-lg p-6 cursor-pointer hover:bg-accent transition-colors relative group" style={{ minHeight: 120 }}
                                        onClick={() => document.getElementById('image-input')?.click()}
                                    >
                                        <Camera className="w-10 h-10 text-muted-foreground group-hover:text-primary mb-2" />
                                        <span className="text-sm text-muted-foreground">Klik atau klik kanan untuk upload gambar</span>
                                        <Input
                                            type="file"
                                            id="image-input"
                                            accept="image/*"
                                            onChange={handleImageChangeWithPreview}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            style={{ pointerEvents: 'none' }}
                                            tabIndex={-1}
                                        />
                                    </div>
                                </ContextMenuTrigger>
                                <ContextMenuContent>
                                    <ContextMenuItem onSelect={() => document.getElementById('image-input')?.click()}>
                                        Upload Gambar
                                    </ContextMenuItem>
                                </ContextMenuContent>
                            </ContextMenu>
                        ) : (
                            <>
                                <Image
                                    width={1080}
                                    height={1080}
                                    src={previewImage}
                                    alt="Preview Gambar Proyek"
                                    className="mt-2 max-h-48 rounded border object-contain"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="mt-2 w-fit"
                                    onClick={() => setPreviewImage(null)}
                                >
                                    Hapus Gambar
                                </Button>
                            </>
                        )}
                    </div>
                    <DialogFooter className="flex gap-2 justify-end">
                        <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 py-2 rounded-lg transition-colors">
                            {loading ? 'Menambah...' : 'Tambah'}
                        </Button>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" className="border-border px-4 py-2 rounded-lg">Batal</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
