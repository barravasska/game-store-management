"use server"

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// --- FUNGSI LOGIN ---
export async function login(formData: FormData) {
    // 1. Tambahkan await
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // 2. Gunakan signInWithPassword untuk login (BUKAN signUp)
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return redirect('/auth/login?message=Email atau password salah')
    }

    revalidatePath('/', 'layout')
    redirect('/') // Balik ke beranda kalau sukses
}

// --- FUNGSI REGISTER / SIGNUP ---
export async function signup(formData: FormData) {
    // 3. Tambahkan await juga di sini
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // 4. Gunakan signUp untuk membuat akun baru
    const { error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        return redirect('/auth/register?message=Gagal mendaftar. Coba lagi.')
    }

    // Supabase biasanya butuh verifikasi email, tapi kita arahkan dulu ke halaman sukses/login
    revalidatePath('/', 'layout')
    redirect('/auth/login?message=Cek email kamu untuk verifikasi!')
}