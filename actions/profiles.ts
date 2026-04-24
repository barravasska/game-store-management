"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ProfileState = {
    error?: string | null
    success?: string | null
}

export async function updateProfile(prevState: ProfileState, formData: FormData): Promise<ProfileState> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const username = formData.get('username') as string
    const avatarFile = formData.get('avatar') as File
    let avatarUrl = formData.get('currentAvatarUrl') as string

    // 1. Proses Upload Avatar jika ada file baru
    if (avatarFile && avatarFile.size > 0) {
        const fileExt = avatarFile.name.split('.').pop()
        const fileName = `${user.id}-${Math.random().toString(36).substring(7)}.${fileExt}`

        const { data: uploadData } = await supabase.storage
            .from('avatars')
            .upload(fileName, avatarFile, { upsert: true })

        if (uploadData) {
            const { data } = supabase.storage.from('avatars').getPublicUrl(uploadData.path)
            avatarUrl = data.publicUrl
        }
    }

    // 2. Update tabel profiles
    const { error } = await supabase
        .from('profiles')
        .update({
            username,
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

    if (error) {
        return { error: "Username sudah digunakan atau terjadi kesalahan." }
    }

    revalidatePath('/dashboard/settings')
    return { success: "Profil berhasil diperbarui!" }
}