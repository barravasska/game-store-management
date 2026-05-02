import { createClient } from '@/lib/supabase/server'
import { deleteAccount } from '@/actions/accounts'
import Image from 'next/image'

// Force dynamic agar Admin selalu melihat data paling fresh
export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    // Ambil SEMUA akun dari database (tidak difilter pakai eq('seller_id', user.id) lagi)
    const { data: allAccounts } = await supabase
        .from('accounts')
        .select(`
      *,
      games ( name ),
      profiles ( username, email )
    `)
        .order('created_at', { ascending: false })

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white">Monitoring Postingan</h1>
                <p className="text-slate-400">Pantau dan kelola seluruh jualan yang ada di GameMarket.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950 border-b border-slate-800">
                                <th className="p-4 text-sm font-semibold text-slate-300">Produk</th>
                                <th className="p-4 text-sm font-semibold text-slate-300">Penjual</th>
                                <th className="p-4 text-sm font-semibold text-slate-300">Harga</th>
                                <th className="p-4 text-sm font-semibold text-slate-300">Status</th>
                                <th className="p-4 text-sm font-semibold text-slate-300 text-right">Tindakan Admin</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {allAccounts && allAccounts.length > 0 ? (
                                allAccounts.map((acc: any) => (
                                    <tr key={acc.id} className="hover:bg-rose-500/[0.02] transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-800 rounded-lg relative overflow-hidden flex-shrink-0">
                                                    {acc.image_url && (
                                                        <Image src={acc.image_url} alt="" fill className="object-cover" />
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-slate-200 line-clamp-1 block text-sm">{acc.title}</span>
                                                    <span className="text-[10px] text-blue-400 font-medium">{acc.games?.name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm text-slate-300 font-medium">{acc.profiles?.username || 'Anonim'}</p>
                                        </td>
                                        <td className="p-4 font-bold text-white text-sm">{formatRupiah(acc.price)}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${acc.status === 'available' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
                                                }`}>
                                                {acc.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {/* Tombol Ubah Status Khusus Admin */}
                                                <form action={async () => {
                                                    "use server"
                                                    const { toggleAccountStatus } = await import('@/actions/accounts')
                                                    await toggleAccountStatus(acc.id, acc.status)
                                                }}>
                                                    <button className="px-3 py-1.5 text-xs bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white rounded-lg transition-all font-bold">
                                                        Ubah ke {acc.status === 'available' ? 'Sold' : 'Available'}
                                                    </button>
                                                </form>

                                                {/* Tombol Hapus Khusus Admin */}
                                                <form action={async () => {
                                                    "use server"
                                                    await deleteAccount(acc.id) // Action ini sudah kita buat sebelumnya
                                                }}>
                                                    <button className="px-3 py-1.5 text-xs bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white rounded-lg transition-all font-bold">
                                                        Hapus Paksa
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center text-slate-500 italic">
                                        Belum ada data postingan di server.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
} 