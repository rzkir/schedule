import { useState, useRef, useEffect, ChangeEvent } from 'react';

import { useAuth } from '@/utils/context/AuthContext';

import { db, auth } from '@/utils/firebase/firebase';

import { updateDoc, doc } from 'firebase/firestore';

import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

import toast from 'react-hot-toast';

import imagekitInstance from '@/utils/imagekit/Imagekit';

export default function useManagementProfile() {
    const { user, loading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Initialize form data when profile loads
    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.displayName || '',
                email: user.email,
            });
        }
    }, [user]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Format file tidak didukung. Gunakan JPG, PNG, atau WebP');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Ukuran file terlalu besar. Maksimal 5MB');
            return;
        }
        setIsUploadingPhoto(true);
        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = async () => {
                const base64data = reader.result;
                if (typeof base64data !== 'string') {
                    toast.error('Terjadi kesalahan saat memproses gambar');
                    setIsUploadingPhoto(false);
                    return;
                }
                const base64String = base64data.split(',')[1];
                try {
                    const uploadResponse = await imagekitInstance.upload({
                        file: base64String,
                        fileName: `profile_${user.uid}_${Date.now()}.jpg`,
                        folder: '/profiles',
                    });
                    if (uploadResponse.url) {
                        await updateDoc(doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string, user.uid), {
                            photo_url: uploadResponse.url,
                            updated_at: new Date().toISOString(),
                        });
                        toast.success('Photo profile berhasil diperbarui!');
                        window.location.reload();
                    }
                } catch (error) {
                    console.error('Upload error:', error);
                    toast.error('Terjadi kesalahan saat mengupload photo');
                } finally {
                    setIsUploadingPhoto(false);
                }
            };
        } catch (error) {
            console.error('FileReader error:', error);
            toast.error('Terjadi kesalahan saat memproses gambar');
            setIsUploadingPhoto(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleSaveProfile = async () => {
        if (!user) return;
        setIsSubmitting(true);
        try {
            await updateDoc(doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string, user.uid), {
                full_name: formData.full_name,
                updated_at: new Date().toISOString(),
            });
            toast.success('Profile berhasil diperbarui!');
            setIsEditing(false);
        } catch {
            toast.error('Terjadi kesalahan saat memperbarui profile');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChangePassword = async () => {
        if (!passwordData.currentPassword) {
            toast.error('Password lama harus diisi');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Password baru dan konfirmasi password tidak cocok');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            toast.error('Password minimal 6 karakter');
            return;
        }
        setIsSubmitting(true);
        try {
            if (!auth.currentUser || !user) throw new Error('User tidak ditemukan');
            const credential = EmailAuthProvider.credential(
                user.email,
                passwordData.currentPassword
            );
            await reauthenticateWithCredential(auth.currentUser, credential);
            await updatePassword(auth.currentUser, passwordData.newPassword);
            toast.success('Password berhasil diubah! Anda akan logout dalam 3 detik...');
            setIsEditingPassword(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            setTimeout(async () => {
                window.location.href = '/signin';
            }, 3000);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'code' in error) {
                const err = error as { code?: string };
                if (err.code === 'auth/wrong-password') {
                    toast.error('Password lama salah');
                } else if (err.code === 'auth/too-many-requests') {
                    toast.error('Terlalu banyak percobaan. Silakan coba lagi nanti.');
                } else {
                    toast.error('Terjadi kesalahan saat mengubah password');
                }
            } else {
                toast.error('Terjadi kesalahan saat mengubah password');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setFormData({
            full_name: user?.displayName || '',
            email: user?.email || '',
        });
    };

    const cancelPasswordEdit = () => {
        setIsEditingPassword(false);
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
        setShowNewPassword(false);
        setShowConfirmPassword(false);
    };

    return {
        user,
        loading,
        isEditing,
        setIsEditing,
        isEditingPassword,
        setIsEditingPassword,
        isUploadingPhoto,
        setIsUploadingPhoto,
        fileInputRef,
        formData,
        setFormData,
        passwordData,
        setPasswordData,
        isSubmitting,
        setIsSubmitting,
        showNewPassword,
        setShowNewPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        handleInputChange,
        handlePasswordChange,
        handlePhotoUpload,
        triggerFileInput,
        handleSaveProfile,
        handleChangePassword,
        cancelEdit,
        cancelPasswordEdit,
    };
}
