"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// prevState dibutuhkan oleh useActionState (React 19)
export async function createAccount(
    prevState: { error: string | null },
    formData: FormData
): Promise<{ error: string | null }> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Kamu harus login terlebih dahulu" }

    const title = formData.get('title') as string
    const game_id = formData.get('game_id') as string
    const price = parseInt(formData.get('price') as string)
    const tier = formData.get('tier') as string
    const description = formData.get('description') as string

    // 1. Ambil file gambar dari form
    const imageFile = formData.get('image') as File
    let imageUrl = ''

    // 2. Proses upload gambar ke Supabase Storage
    if (imageFile && imageFile.size > 0) {
        // Bikin nama file unik pakai timestamp biar nggak bentrok
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('account_images')
            .upload(fileName, imageFile)

        if (uploadError) {
            console.error("Gagal upload gambar:", uploadError)
            return { error: "Gagal upload gambar" }
        }

        // 3. Ambil Public URL dari gambar yang baru diupload
        const { data: publicUrlData } = supabase.storage
            .from('account_images')
            .getPublicUrl(uploadData.path)

        imageUrl = publicUrlData.publicUrl
    }

    // 4. Simpan semua data (termasuk URL gambar) ke tabel accounts
    const { error } = await supabase.from('accounts').insert({
        title,
        game_id,
        price,
        tier,
        description,
        image_url: imageUrl,
        seller_id: user.id,
    })

    if (error) {
        console.error(error)
        return { error: "Gagal memposting akun." }
    }

    revalidatePath('/')
    redirect('/')
}

export async function deleteAccount(accountId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    // Pastikan hanya pemilik yang bisa hapus (Security Check tambahan selain RLS)
    const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', accountId)
        .eq('seller_id', user.id)

    if (error) {
        return { error: "Gagal menghapus akun" }
    }

    revalidatePath('/dashboard')
    revalidatePath('/')
}