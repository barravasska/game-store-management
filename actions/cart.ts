"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addToCart(accountId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Kamu harus login terlebih dahulu" }

    // Cek apakah produk masih available
    const { data: account } = await supabase
        .from('accounts')
        .select('status')
        .eq('id', accountId)
        .single()

    if (!account || account.status !== 'available') {
        return { error: "Akun ini sudah tidak tersedia" }
    }

    // Insert ke cart_items
    const { error } = await supabase.from('cart_items').insert({
        user_id: user.id,
        account_id: accountId
    })

    if (error) {
        console.error("Error addToCart:", error)
        if (error.code === '23505') { // Unique violation
            return { error: "Akun ini sudah ada di keranjangmu" }
        }
        return { error: `Gagal menambahkan ke keranjang: ${error.message}` }
    }

    revalidatePath('/cart')
    revalidatePath('/', 'layout')
    return { success: "Berhasil ditambahkan ke keranjang" }
}

export async function removeFromCart(cartItemId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)
        .eq('user_id', user.id)

    if (error) {
        return { error: "Gagal menghapus item" }
    }

    revalidatePath('/cart')
    return { success: true }
}

export async function getCartCount() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return 0

    const { count } = await supabase
        .from('cart_items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    return count || 0
}
