import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { removeFromCart } from '@/actions/cart'
import EmptyState from '@/components/shared/EmptyState'

export default async function CartPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login?message=Silakan login untuk melihat keranjang')

    // Ambil isi keranjang
    const { data: cartItems } = await supabase
        .from('cart_items')
        .select(`
            id,
            account_id,
            accounts (
                id,
                title,
                price,
                image_url,
                status,
                games ( name )
            )
        `)
        .eq('user_id', user.id)

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
    }

    const validItems = cartItems?.filter(item => item.accounts?.status === 'available') || []
    const invalidItems = cartItems?.filter(item => item.accounts?.status !== 'available') || []

    const totalAmount = validItems.reduce((sum, item) => sum + (item.accounts?.price || 0), 0)

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            <h1 className="text-3xl font-bold text-white mb-8">Keranjang Belanja</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Daftar Item */}
                <div className="lg:col-span-2 space-y-4">
                    {cartItems && cartItems.length > 0 ? (
                        <>
                            {validItems.map(item => (
                                <div key={item.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex gap-4 items-center">
                                    <div className="w-24 h-24 bg-slate-800 rounded-xl relative overflow-hidden flex-shrink-0">
                                        {item.accounts?.image_url ? (
                                            <Image src={item.accounts.image_url} alt="" fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">No Image</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-white text-lg line-clamp-1">{item.accounts?.title}</h3>
                                        <p className="text-sm text-slate-400 mb-2">{item.accounts?.games?.name}</p>
                                        <p className="font-extrabold text-blue-400">{formatRupiah(item.accounts?.price || 0)}</p>
                                    </div>
                                    <form action={async () => {
                                        "use server"
                                        await removeFromCart(item.id)
                                    }}>
                                        <button className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors">
                                            🗑️
                                        </button>
                                    </form>
                                </div>
                            ))}

                            {/* Item yang sudah terjual (invalid) */}
                            {invalidItems.map(item => (
                                <div key={item.id} className="bg-slate-900/50 border border-red-500/20 p-4 rounded-2xl flex gap-4 items-center opacity-75">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-400 line-clamp-1 strike">{item.accounts?.title}</h3>
                                        <p className="text-xs text-red-400 mt-1">Akun ini sudah terjual / ditarik penjual.</p>
                                    </div>
                                    <form action={async () => {
                                        "use server"
                                        await removeFromCart(item.id)
                                    }}>
                                        <button className="px-4 py-2 text-sm bg-slate-800 text-white rounded-lg">
                                            Hapus
                                        </button>
                                    </form>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="col-span-full">
                            <EmptyState
                                icon="🛒"
                                title="Keranjang Kosong"
                                description="Anda belum menambahkan akun game apapun ke dalam keranjang. Silakan telusuri katalog kami untuk menemukan akun impian Anda."
                                actionLabel="Cari Akun Game"
                                actionHref="/"
                            />
                        </div>
                    )}
                </div>

                {/* Ringkasan */}
                {validItems.length > 0 && (
                    <div className="lg:col-span-1">
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl sticky top-24">
                            <h3 className="text-xl font-bold text-white mb-6">Ringkasan Belanja</h3>
                            
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-slate-300">
                                    <span>Total Harga ({validItems.length} akun)</span>
                                    <span className="font-medium text-white">{formatRupiah(totalAmount)}</span>
                                </div>
                                <div className="flex justify-between text-slate-300">
                                    <span>Biaya Layanan</span>
                                    <span className="font-medium text-emerald-400">Gratis</span>
                                </div>
                            </div>

                            <div className="border-t border-slate-800 pt-6 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-white font-bold">Total Tagihan</span>
                                    <span className="text-2xl font-extrabold text-blue-400">{formatRupiah(totalAmount)}</span>
                                </div>
                            </div>

                            <Link 
                                href="/checkout"
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20 text-center block"
                            >
                                Lanjut ke Pembayaran
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
