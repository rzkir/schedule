"use client"

import React from 'react'

import { Card, CardHeader, CardContent } from '@/components/ui/card'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'

import { Label } from '@/components/ui/label'

import { User, Lock, Save, Edit, X, Camera, Eye, EyeOff } from 'lucide-react'

import { FormatIndoDate } from '@/lib/formatDate'

import useManagementProfile from '@/components/dashboard/profile/lib/useManagementProfile'

import ProfileSkelaton from "@/components/dashboard/profile/ProfileSkelaton"

export default function ProfileLayout() {
    const {
        user,
        loading,
        isEditing,
        setIsEditing,
        isEditingPassword,
        setIsEditingPassword,
        isUploadingPhoto,
        fileInputRef,
        formData,
        handleInputChange,
        passwordData,
        handlePasswordChange,
        isSubmitting,
        showNewPassword,
        setShowNewPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        handlePhotoUpload,
        triggerFileInput,
        handleSaveProfile,
        handleChangePassword,
        cancelEdit,
        cancelPasswordEdit,
    } = useManagementProfile()

    if (loading) {
        return (
            <ProfileSkelaton />
        )
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center text-foreground">
                    <h2 className="text-xl font-semibold text-muted-foreground">Profile tidak ditemukan</h2>
                    <p className="text-sm text-muted-foreground">Silakan login untuk melihat profile Anda</p>
                </div>
            </div>
        )
    }

    return (
        <section className="space-y-6">
            {/* Profile Header */}
            <Card className="flex flex-col md:flex-row items-center gap-6 p-6 bg-card text-card-foreground">
                <div className="relative">
                    <Avatar className="w-20 h-20">
                        {user.photo_url ? (
                            <AvatarImage src={user.photo_url} alt={user.displayName} />
                        ) : (
                            <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                                {user.displayName?.charAt(0) || 'U'}
                            </AvatarFallback>
                        )}
                    </Avatar>

                    <Button
                        size="sm"
                        variant="secondary"
                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0"
                        onClick={triggerFileInput}
                        disabled={isUploadingPhoto}
                    >
                        {isUploadingPhoto ? (
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Camera className="w-4 h-4" />
                        )}
                    </Button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold truncate">{user.displayName || 'Nama tidak tersedia'}</h2>
                    <p className="text-muted-foreground truncate">{user.email}</p>

                    <div className="flex flex-col gap-1 mt-2 text-xs text-muted-foreground">
                        <span>Dibuat: {FormatIndoDate(user.createdAt)}</span>
                        <span>Diperbarui: {FormatIndoDate(user.updatedAt)}</span>
                    </div>
                </div>
            </Card>

            {/* Profile Information Form */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between bg-card text-card-foreground">
                    <div className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        <h3 className="font-semibold text-lg">Informasi Profile</h3>
                    </div>
                    {!isEditing ? (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            className="border-border text-foreground hover:bg-muted"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={cancelEdit}
                                disabled={isSubmitting}
                                className="border-border text-foreground hover:bg-muted"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Batal
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSaveProfile}
                                disabled={isSubmitting}
                                className="bg-primary text-primary-foreground hover:bg-primary/80"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </div>
                    )}
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="full_name">Nama Lengkap</Label>
                            <Input
                                id="full_name"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Masukkan nama lengkap"
                                className="bg-background text-foreground border-border"
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                disabled={true} // Email tidak bisa diubah
                                placeholder="Masukkan email"
                                className="bg-muted text-muted-foreground border-border"
                            />
                            <p className="text-xs text-muted-foreground">Email tidak dapat diubah</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Password Change Form */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between bg-card text-card-foreground">
                    <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        <h3 className="font-semibold text-lg">Ubah Password</h3>
                    </div>
                    {!isEditingPassword ? (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditingPassword(true)}
                            className="border-border text-foreground hover:bg-muted"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Password
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={cancelPasswordEdit}
                                disabled={isSubmitting}
                                className="border-border text-foreground hover:bg-muted"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Batal
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleChangePassword}
                                disabled={isSubmitting}
                                className="bg-primary text-primary-foreground hover:bg-primary/80"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isSubmitting ? 'Menyimpan...' : 'Simpan Password'}
                            </Button>
                        </div>
                    )}
                </CardHeader>
                <CardContent className="space-y-4">
                    {isEditingPassword ? (
                        <>
                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="currentPassword">Password Lama</Label>
                                <Input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Masukkan password lama"
                                    className="bg-background text-foreground border-border"
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="newPassword">Password Baru</Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        name="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Masukkan password baru"
                                        className="pr-10 bg-background text-foreground border-border"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-muted"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Konfirmasi password baru"
                                        className="pr-10 bg-background text-foreground border-border"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-muted"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Lock className="w-4 h-4" />
                            <span>Password Anda aman</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    )
}