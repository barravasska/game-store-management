import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import EmptyState from '@/components/shared/EmptyState'

export default async function PurchasesPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Ambil riwayat transaksi buyer beserta detail akun dan game-nya
    const { data: transactions } = await supabase
        .from('transactions')
        .select(`
            id,
            total_amount,
            status,
            created_at,
            transaction_items (
                id,
                price,
                accounts (
                    id,
                    title,
                    image_url,
                    games ( name ),
                    profiles ( username )
                )
            )
        `)
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false })

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        })
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white mb-2">Riwayat Pembelian</h1>
                <p className="text-slate-400">Daftar semua akun game yang pernah Anda beli.</p>
            </div>

            <div className="space-y-6">
                {transactions && transactions.length > 0 ? (
                    transactions.map((tx) => (
                        <div key={tx.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
                            <div className="px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950/50">
                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-1">Tanggal Transaksi</p>
                                    <p className="text-sm font-bold text-slate-300">{formatDate(tx.created_at)}</p>
                                </div>
                                <div className="flex flex-col sm:items-end">
                                    <p className="text-xs text-slate-500 font-medium mb-1">Status</p>
                                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-lg uppercase tracking-wider border border-emerald-500/20 inline-block">
                                        {tx.status}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 divide-y divide-slate-800/50">
                                {tx.transaction_items?.map((item: any) => (
                                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row gap-6 items-start md:items-center">
                                        <div className="w-24 h-24 bg-slate-800 rounded-xl relative overflow-hidden flex-shrink-0 border border-slate-700">
                                            {item.accounts?.image_url ? (
                                                <Image src={item.accounts.image_url} alt="" fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500">No Image</div>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-white text-lg mb-1">{item.accounts?.title || 'Akun tidak diketahui'}</h3>
                                            <p className="text-sm text-slate-400 mb-2">{item.accounts?.games?.name}</p>
                                            <p className="text-xs text-slate-500">Penjual: <span className="font-medium text-slate-300">{item.accounts?.profiles?.username || 'Anonim'}</span></p>
                                        </div>

                                        <div className="flex flex-col md:items-end w-full md:w-auto mt-4 md:mt-0 gap-4">
                                            <p className="font-extrabold text-blue-400 text-xl">{formatRupiah(item.price)}</p>
                                            <Link
                                                href={`https://wa.me/6281234567890?text=${encodeURIComponent(`Halo, saya pembeli akun ${item.accounts?.title}. Saya ingin konfirmasi/klaim akun.`)}`}
                                                target="_blank"
                                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold rounded-lg transition-colors text-sm text-center border border-slate-700 w-full md:w-auto"
                                            >
                                                Chat Penjual
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <EmptyState
                        icon="🎮"
                        title="Belum ada riwayat pembelian"
                        description="Anda belum pernah melakukan pembelian akun. Ayo temukan akun impian Anda sekarang dan mulai bermain!"
                        actionLabel="Eksplor Akun Game"
                        actionHref="/"
                    />
                )}
            </div>
        </div>
    )
}
