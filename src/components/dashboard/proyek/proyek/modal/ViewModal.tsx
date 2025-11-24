import React from 'react'
import Image from 'next/image';
import { Proyek } from '@/types/Proyek';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { formatIDR } from '@/lib/formatPrice';

interface ViewModalProps {
    open: boolean;
    onClose: () => void;
    proyek: Proyek | null;
}

export default function ViewModal({ open, onClose, proyek }: ViewModalProps) {
    if (!proyek) return null;

    return (
        <Dialog open={open} onOpenChange={(val) => { if (!val) onClose(); }}>
            <DialogContent showCloseButton={false} className="sm:max-w-6xl max-h-[95vh] overflow-hidden bg-background flex flex-col p-0  border-0 shadow-none">
                {/* Visually hidden DialogTitle for accessibility */}
                <DialogTitle className="sr-only">Detail Proyek</DialogTitle>
                {/* Hero Image Section */}
                <div className="relative h-40 xs:h-52 sm:h-64 md:h-80 w-full group flex-shrink-0 overflow-hidden">
                    <Image
                        src={proyek.thumbnail || '/placeholder.png'}
                        alt={proyek.title || 'Project'}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105 rounded-t-xl"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent rounded-t-xl">
                        <div className="p-4 sm:p-8 h-full flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <div className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium backdrop-blur-md transition-all duration-300
                                        ${proyek.status === 'published'
                                            ? 'bg-primary/20 text-primary hover:bg-primary/30'
                                            : proyek.status === 'draft'
                                                ? 'bg-muted text-muted-foreground hover:bg-muted/80'
                                                : 'bg-destructive/20 text-destructive hover:bg-destructive/30'}
                                    `}>
                                        <span className={`w-2 h-2 rounded-full mr-2
                                            ${proyek.status === 'published'
                                                ? 'bg-primary'
                                                : proyek.status === 'draft'
                                                    ? 'bg-muted-foreground'
                                                    : 'bg-destructive'}
                                        `}></span>
                                        {proyek.status || '-'}
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="btn btn-circle btn-sm bg-white/10 backdrop-blur-md border-0 hover:bg-white/20 text-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className='px-4 py-2 bg-white/50 rounded-2xl backdrop-blur-2xl'>
                                <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-600">{proyek.title}</h2>
                                <p className="line-clamp-2 text-sm sm:text-base text-gray-600">{proyek.description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content - Scrollable */}
                <div className="p-4 sm:p-8 space-y-6 sm:space-y-10 overflow-y-auto flex-grow bg-background rounded-b-xl">
                    {/* Stats Cards */}
                    <div className="bg-gradient-to-br from-accent/50 to-accent/30 p-4 sm:p-6 rounded-2xl hover:shadow-lg transition-all duration-300 border border-border">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-accent/20 rounded-lg">
                                <span className="h-5 w-5 text-accent-foreground">⏳</span>
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-accent-foreground">Progres</span>
                        </div>
                        {/* Timeline Horizontal */}
                        <div className="flex flex-wrap items-center justify-between w-full mt-4 gap-2">
                            {(['pending', 'progress', 'revisi', 'selesai'] as const).map((step, idx, arr) => {
                                const stepLabels: Record<'pending' | 'progress' | 'revisi' | 'selesai', string> = { pending: 'Pending', progress: 'Progress', revisi: 'Revisi', selesai: 'Selesai' };
                                const stepColors: Record<'pending' | 'progress' | 'revisi' | 'selesai', { bg: string; text: string; border: string; bgActive: string; textActive: string; borderActive: string }> = {
                                    pending: {
                                        bg: 'bg-yellow-100',
                                        text: 'text-yellow-800',
                                        border: 'border-yellow-300',
                                        bgActive: 'bg-yellow-500',
                                        textActive: 'text-white',
                                        borderActive: 'border-yellow-500'
                                    },
                                    progress: {
                                        bg: 'bg-blue-100',
                                        text: 'text-blue-800',
                                        border: 'border-blue-300',
                                        bgActive: 'bg-blue-500',
                                        textActive: 'text-white',
                                        borderActive: 'border-blue-500'
                                    },
                                    revisi: {
                                        bg: 'bg-orange-100',
                                        text: 'text-orange-800',
                                        border: 'border-orange-300',
                                        bgActive: 'bg-orange-500',
                                        textActive: 'text-white',
                                        borderActive: 'border-orange-500'
                                    },
                                    selesai: {
                                        bg: 'bg-green-100',
                                        text: 'text-green-800',
                                        border: 'border-green-300',
                                        bgActive: 'bg-green-500',
                                        textActive: 'text-white',
                                        borderActive: 'border-green-500'
                                    },
                                };
                                const currentIdx = arr.indexOf(proyek.progres);
                                const isActive = idx <= currentIdx;
                                const color = stepColors[step];
                                return (
                                    <React.Fragment key={step}>
                                        <div className="flex flex-col items-center min-w-[48px]">
                                            <div
                                                className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 text-xs sm:text-sm font-bold transition-all duration-300
                                                        ${isActive
                                                        ? `${color.bgActive} ${color.textActive} ${color.borderActive}`
                                                        : `${color.bg} ${color.text} ${color.border}`}
                                                    `}
                                            >
                                                {isActive ? <span>✓</span> : idx + 1}
                                            </div>
                                            <span className={`mt-2 text-[10px] sm:text-xs font-medium ${isActive ? color.textActive : color.text}`}>{stepLabels[step]}</span>
                                        </div>
                                        {idx < arr.length - 1 && (
                                            <div className={`flex-1 h-1 mx-1 sm:mx-2 transition-all duration-300 ${idx < currentIdx ? color.bgActive : 'bg-gray-200'}`}></div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="bg-gradient-to-br from-chart-2/20 to-chart-2/10 p-4 sm:p-6 rounded-2xl hover:shadow-lg transition-all duration-300 border border-border">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-chart-2/20 rounded-lg">
                                    <span className="h-5 w-5 text-chart-2">💰</span>
                                </div>
                                <span className="text-xs sm:text-sm font-medium text-chart-2">Harga</span>
                            </div>
                            <p className="text-xl sm:text-2xl font-bold text-foreground">Rp{formatIDR(Number(proyek.price))}</p>
                        </div>

                        <div className="bg-gradient-to-br from-chart-1/20 to-chart-1/10 p-4 sm:p-6 rounded-2xl hover:shadow-lg transition-all duration-300 border border-border">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-chart-1/20 rounded-lg">
                                    <span className="h-5 w-5 text-chart-1">🏷️</span>
                                </div>
                                <span className="text-xs sm:text-sm font-medium text-chart-1">Kategori</span>
                            </div>
                            <p className="text-xl sm:text-2xl font-bold text-foreground">{proyek.category}</p>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-4 sm:space-y-8">
                            {/* Project Details */}
                            <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                                <h3 className="text-lg sm:text-xl font-semibold text-card-foreground mb-4 sm:mb-6 flex items-center gap-2">
                                    <span className="h-5 w-5 text-primary">📄</span>
                                    Detail Proyek
                                </h3>
                                <div className="space-y-2 sm:space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-muted-foreground text-xs sm:text-base">Kategori:</span>
                                        <span className="px-3 sm:px-4 py-1 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-medium">
                                            {proyek.category}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-muted-foreground text-xs sm:text-base">Framework:</span>
                                        <span className="px-3 sm:px-4 py-1 bg-accent/10 text-accent-foreground rounded-full text-xs sm:text-sm font-medium">
                                            {Array.isArray(proyek.framework) && proyek.framework.length > 0 ? (
                                                proyek.framework.map((fw, i) => {
                                                    const key = typeof fw === 'string' ? fw : (fw && typeof fw === 'object' && 'name' in fw && typeof (fw as { name: string }).name === 'string') ? (fw as { name: string }).name : `framework-${i}`;
                                                    const displayText = typeof fw === 'string' ? fw : (fw && typeof fw === 'object' && 'name' in fw && typeof (fw as { name: string }).name === 'string') ? (fw as { name: string }).name : String(fw);
                                                    return <span key={key}>{displayText}{i < proyek.framework.length - 1 ? ', ' : ''}</span>;
                                                })
                                            ) : '-'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* Kolom Baru: Info User & Accounts */}
                            <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                                <h3 className="text-lg sm:text-xl font-semibold text-card-foreground mb-4 sm:mb-6 flex items-center gap-2">
                                    <span className="h-5 w-5 text-chart-2">👤</span>
                                    Info User & Accounts
                                </h3>
                                <div className="space-y-2 sm:space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-muted-foreground text-xs sm:text-base">Nama User:</span>
                                        <span className="px-3 sm:px-4 py-1 bg-chart-2/10 text-chart-2 rounded-full text-xs sm:text-sm font-medium">
                                            {proyek.nama_user || '-'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <span className="text-muted-foreground text-xs sm:text-base">Accounts:</span>
                                        {Array.isArray(proyek.accounts) && proyek.accounts.length > 0 ? (
                                            <div className="flex flex-col space-y-2">
                                                {proyek.accounts.map((account, idx) => (
                                                    <div key={idx} className="bg-muted rounded-lg p-2 sm:p-3 flex flex-col">
                                                        <span className="font-semibold text-primary text-xs sm:text-base">{account.label || 'Account ' + (idx + 1)}</span>
                                                        <span className="text-accent-foreground text-xs sm:text-base">{account.email || '-'}</span>
                                                        <span className="text-destructive text-xs sm:text-base">{account.password || '-'}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground text-xs sm:text-sm">Tidak ada accounts</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* Card Link Terkait */}
                            <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                                <h3 className="text-lg sm:text-xl font-semibold text-card-foreground mb-4 sm:mb-6 flex items-center gap-2">
                                    <span className="h-5 w-5 text-primary">🔗</span>
                                    Link Terkait
                                </h3>
                                {Array.isArray(proyek.link) && proyek.link.length > 0 ? (
                                    <ul className="space-y-2">
                                        {proyek.link.map((l) => (
                                            <li key={l.id} className="bg-muted rounded-lg p-2 sm:p-3 flex flex-col">
                                                <span className="font-semibold text-primary text-xs sm:text-base">{l.label}</span>
                                                <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-primary underline break-all text-xs sm:text-base">{l.url}</a>
                                                <span className="text-[10px] sm:text-xs text-muted-foreground mt-1">Updated: {l.updatedAt && typeof l.updatedAt.toDate === 'function' ? l.updatedAt.toDate().toLocaleString() : '-'}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span className="text-muted-foreground text-xs sm:text-sm">Tidak ada link</span>
                                )}
                            </div>

                        </div>

                        {/* Right Column */}
                        <div className="space-y-4 sm:space-y-8 flex-col flex">
                            {/* Timeline */}
                            <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                                <h3 className="text-lg sm:text-xl font-semibold text-card-foreground mb-4 sm:mb-6 flex items-center gap-2">
                                    <span className="h-5 w-5 text-accent-foreground">🕒</span>
                                    Timeline
                                </h3>
                                <div className="space-y-4 sm:space-y-6">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-chart-2/20 rounded-lg">
                                            <span className="h-5 w-5 text-chart-2">🟢</span>
                                        </div>
                                        <div>
                                            <p className="text-xs sm:text-sm font-medium text-card-foreground">Created</p>
                                            <p className="text-xs sm:text-sm text-muted-foreground">{proyek.createdAt && typeof proyek.createdAt.toDate === 'function' ? proyek.createdAt.toDate().toLocaleString() : '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-primary/20 rounded-lg">
                                            <span className="h-5 w-5 text-primary">🔄</span>
                                        </div>
                                        <div>
                                            <p className="text-xs sm:text-sm font-medium text-card-foreground">Last Updated</p>
                                            <p className="text-xs sm:text-sm text-muted-foreground">{proyek.updatedAt && typeof proyek.updatedAt.toDate === 'function' ? proyek.updatedAt.toDate().toLocaleString() : '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card Deposit Timeline */}
                            <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                                <h3 className="text-lg sm:text-xl font-semibold text-card-foreground mb-4 sm:mb-6 flex items-center gap-2">
                                    <span className="h-5 w-5 text-accent-foreground">💸</span>
                                    Deposit Timeline
                                </h3>
                                {Array.isArray(proyek.deposit) && proyek.deposit.length > 0 ? (
                                    <ol className="relative border-l-2 border-accent ml-2 sm:ml-4">
                                        {proyek.deposit.map((d, idx) => (
                                            <li key={d.id || idx} className="mb-6 sm:mb-8 ml-2 sm:ml-4">
                                                <div className="absolute -left-4 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-accent/20 rounded-full border-2 border-accent">
                                                    <span className="text-accent-foreground font-bold text-xs sm:text-base">{idx + 1}</span>
                                                </div>
                                                <div className="pl-4">
                                                    <div className="font-semibold text-accent-foreground text-xs sm:text-base">{d.label}</div>
                                                    <div className="text-xs sm:text-sm text-muted-foreground">Percent: <span className="font-medium text-card-foreground">{d.percent}%</span></div>
                                                    <div className="text-xs sm:text-sm text-muted-foreground">Price: <span className="font-medium text-chart-2">Rp{formatIDR(Number(d.price))}</span></div>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                ) : (
                                    <span className="text-muted-foreground text-xs sm:text-sm">Tidak ada deposit</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
