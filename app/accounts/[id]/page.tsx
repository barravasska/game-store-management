import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

// Di Next.js 15, params harus di-await
export default async function AccountDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    // Ambil data detail akun beserta relasinya
    const { data: account, error } = await supabase
        .from('accounts')
        .select(`
      *,
      profiles ( username, avatar_url ),
      games ( name )
    `)
        .eq('id', id)
        .single()

    // Kalau akun tidak ditemukan / error, tampilkan halaman 404
    if (error || !account) {
        return notFound()
    }

    // Format Rupiah
    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
    }

    return (
        <div className="container mx-auto px-4 py-10 max-w-5xl">
            {/* Breadcrumb navigasi */}
            <div className="mb-8 text-sm text-slate-400">
                <Link href="/" className="hover:text-blue-400">Home</Link>
                <span className="mx-2">/</span>
                <span className="text-slate-200">{account.games?.name}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Kiri: Gambar Bukti Akun */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl aspect-video relative overflow-hidden shadow-2xl">
                    {account.image_url ? (
                        <Image
                            src={account.image_url}
                            alt={account.title}
                            fill
                            className="object-contain" // Pakai object-contain biar gambar akun terlihat penuh
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                            Tidak ada gambar bukti
                        </div>
                    )}
                </div>

                {/* Kanan: Detail Informasi */}
                <div className="flex flex-col">
                    <div className="mb-6">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-md uppercase tracking-wider border border-emerald-500/20">
                            {account.tier}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                        {account.title}
                    </h1>

                    <div className="flex items-center gap-3 mb-8 pb-8 border-b border-slate-800">
                        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 font-bold">
                            {account.profiles?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Penjual</p>
                            <p className="font-medium text-slate-200">{account.profiles?.username || 'Anonim'}</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-white mb-3">Deskripsi Akun</h3>
                        <p className="text-slate-400 whitespace-pre-wrap leading-relaxed">
                            {account.description || 'Tidak ada deskripsi tambahan.'}
                        </p>
                    </div>

                    <div className="mt-auto bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <p className="text-slate-400 text-sm mb-1">Harga Nett</p>
                        <p className="text-4xl font-extrabold text-white mb-6">
                            {formatRupiah(account.price)}
                        </p>

                        {/* Link WhatsApp dengan pesan otomatis */}
                        <Link
                            href={`https://wa.me/6281234567890?text=${encodeURIComponent(`Halo, saya tertarik dengan akun ${account.title} (${account.games?.name}) seharga ${formatRupiah(account.price)}. Apakah masih tersedia?`)}`}
                            target="_blank"
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20 text-lg flex items-center justify-center gap-2"
                        >
                            <span>Hubungi Penjual via WA</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
