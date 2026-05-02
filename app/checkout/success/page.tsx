import Link from 'next/link'

export default function CheckoutSuccessPage({
    searchParams
}: {
    searchParams: Promise<{ tx: string }>
}) {
    // Parameter tx bisa diambil dari promise di Next.js 15
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl text-center">
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 border-4 border-emerald-500/30">
                    ✓
                </div>
                
                <h1 className="text-3xl font-extrabold text-white mb-2">Pembayaran Berhasil!</h1>
                <p className="text-slate-400 mb-8 leading-relaxed">
                    Terima kasih telah berbelanja di GameMarket. Akun game yang Anda beli telah kami amankan.
                </p>

                <div className="space-y-4">
                    <Link href="/dashboard/purchases" className="block w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20">
                        Lihat Riwayat Pembelian
                    </Link>
                    <Link href="/" className="block w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all">
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    )
}
