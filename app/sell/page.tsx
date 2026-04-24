import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SellForm from '@/components/shared/SellForm'

export default async function SellPage() {
    const supabase = await createClient()

    // Proteksi halaman: Jika belum login, tendang ke halaman login
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    // Ambil daftar game untuk dropdown select
    const { data: games } = await supabase.from('games').select('*')

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
                <h1 className="text-3xl font-bold text-white mb-2">Jual Akun Baru</h1>
                <p className="text-slate-400 mb-8">Isi detail akun game yang ingin kamu jual dengan jujur.</p>

                {/* SellForm adalah Client Component yang pakai useActionState */}
                <SellForm games={games ?? []} />
            </div>
        </div>
    )
}