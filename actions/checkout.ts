"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function processCheckout(paymentMethod: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    // 1. Ambil isi keranjang
    const { data: cartItems } = await supabase
        .from('cart_items')
        .select(`
            id,
            account_id,
            accounts ( price, status )
        `)
        .eq('user_id', user.id)

    if (!cartItems || cartItems.length === 0) {
        return { error: "Keranjang belanja kosong" }
    }

    // 2. Validasi apakah semua akun masih available
    for (const item of cartItems) {
        if (item.accounts?.status !== 'available') {
            return { error: "Salah satu akun di keranjangmu sudah terjual. Silakan hapus dan coba lagi." }
        }
    }

    // 3. Hitung total
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.accounts?.price || 0), 0)

    // 4. Buat Transaksi
    const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .insert({
            buyer_id: user.id,
            total_amount: totalAmount,
            status: 'success', // Kita anggap simulasi langsung sukses
            payment_method: paymentMethod
        })
        .select('id')
        .single()

    if (txError || !transaction) {
        console.error(txError)
        return { error: "Gagal memproses transaksi" }
    }

    // 5. Masukkan ke transaction_items dan update status accounts
    const transactionItemsData = cartItems.map(item => ({
        transaction_id: transaction.id,
        account_id: item.account_id,
        price: item.accounts?.price || 0
    }))

    const accountIds = cartItems.map(item => item.account_id)

    // Insert detail transaksi
    await supabase.from('transaction_items').insert(transactionItemsData)

    // Update status accounts jadi 'sold'
    await supabase.from('accounts')
        .update({ status: 'sold' })
        .in('id', accountIds)

    // 6. Hapus cart
    await supabase.from('cart_items').delete().eq('user_id', user.id)

    revalidatePath('/cart')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/purchases')
    revalidatePath('/')
    
    redirect(`/checkout/success?tx=${transaction.id}`)
}
