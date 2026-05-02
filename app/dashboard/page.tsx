import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { deleteAccount } from '@/actions/accounts'
import Link from 'next/link'
import Image from 'next/image'
import EmptyState from '@/components/shared/EmptyState'

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Ambil data akun milik user yang sedang login
    const { data: myAccounts } = await supabase
        .from('accounts')
        .select(`
      *,
      games ( name )
    `)
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard Penjual</h1>
                    <p className="text-slate-400">Kelola semua akun game yang kamu posting di sini.</p>
                </div>
                <Link href="/sell" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all">
                    + Jual Akun Baru
                </Link>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950 border-b border-slate-800">
                                <th className="p-4 text-sm font-semibold text-slate-300">Produk</th>
                                <th className="p-4 text-sm font-semibold text-slate-300">Game</th>
                                <th className="p-4 text-sm font-semibold text-slate-300">Harga</th>
                                <th className="p-4 text-sm font-semibold text-slate-300">Status</th>
                                <th className="p-4 text-sm font-semibold text-slate-300 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {myAccounts && myAccounts.length > 0 ? (
                                myAccounts.map((acc) => (
                                    <tr key={acc.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-slate-800 rounded-lg relative overflow-hidden flex-shrink-0">
                                                    {acc.image_url && (
                                                        <Image src={acc.image_url} alt="" fill className="object-cover" />
                                                    )}
                                                </div>
                                                <span className="font-medium text-slate-200 line-clamp-1">{acc.title}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-400 text-sm">{acc.games?.name}</td>
                                        <td className="p-4 font-semibold text-white">{formatRupiah(acc.price)}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${acc.status === 'available' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
                                                }`}>
                                                {acc.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {acc.status === 'available' && (
                                                    <form action={async () => {
                                                        "use server"
                                                        const { markAsSold } = await import('@/actions/accounts')
                                                        await markAsSold(acc.id)
                                                    }}>
                                                        <button className="p-2 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors text-sm font-medium">
                                                            Terjual
                                                        </button>
                                                    </form>
                                                )}
                                                <form action={async () => {
                                                    "use server"
                                                    await deleteAccount(acc.id)
                                                }}>
                                                    <button className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors text-sm font-medium">
                                                        Hapus
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-8">
                                        <EmptyState
                                            icon="🏷️"
                                            title="Belum ada dagangan"
                                            description="Anda belum memiliki akun game yang dijual. Mulai posting akun game pertama Anda sekarang!"
                                            actionLabel="Jual Akun Baru"
                                            actionHref="/sell"
                                        />
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