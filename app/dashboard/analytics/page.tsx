import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AnalyticsChart from '@/components/shared/AnalyticsChart'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Fetch all accounts owned by the user
    const { data: accounts } = await supabase
        .from('accounts')
        .select(`
            *,
            games ( name )
        `)
        .eq('seller_id', user.id)
        .order('created_at', { ascending: true })

    if (!accounts) {
        return <div className="p-10 text-white">Gagal memuat data analitik.</div>
    }

    // Hitung Metrik
    const totalProducts = accounts.length
    const soldAccounts = accounts.filter(acc => acc.status === 'sold')
    const availableAccounts = accounts.filter(acc => acc.status === 'available')
    
    const totalSales = soldAccounts.reduce((sum, acc) => sum + acc.price, 0)
    
    // Sort sold accounts by price descending to get top sellers
    const topProducts = [...soldAccounts].sort((a, b) => b.price - a.price).slice(0, 5)

    // Data untuk Grafik (Group by Bulan-Tahun)
    // Karena kita tidak memiliki 'sold_at', kita gunakan 'created_at' dari item yang 'sold' sebagai proxy.
    const chartDataMap = new Map<string, number>()
    
    soldAccounts.forEach(acc => {
        const date = new Date(acc.created_at)
        // Format: "Jan 26"
        const monthYear = date.toLocaleString('id-ID', { month: 'short', year: '2-digit' })
        
        const currentSales = chartDataMap.get(monthYear) || 0
        chartDataMap.set(monthYear, currentSales + acc.price)
    })

    const chartData = Array.from(chartDataMap.entries()).map(([name, sales]) => ({
        name,
        sales
    }))

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white mb-2">Analitik Toko</h1>
                <p className="text-slate-400">Pantau performa penjualan dan produk terlaris Anda.</p>
            </div>

            {/* Metrik Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Total Pendapatan</p>
                    <h3 className="text-3xl font-bold text-white">{formatRupiah(totalSales)}</h3>
                </div>
                
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Produk Terjual</p>
                    <h3 className="text-3xl font-bold text-white">{soldAccounts.length} <span className="text-sm font-medium text-slate-500">akun</span></h3>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Total Listing</p>
                    <h3 className="text-3xl font-bold text-white">{totalProducts} <span className="text-sm font-medium text-slate-500">akun</span></h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Grafik */}
                <div className="lg:col-span-2">
                    <AnalyticsChart data={chartData} />
                </div>

                {/* Top Produk */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center justify-between">
                        <span>Produk Termahal Terjual</span>
                        <span>🏆</span>
                    </h3>
                    
                    <div className="space-y-4">
                        {topProducts.length > 0 ? (
                            topProducts.map((product, index) => (
                                <div key={product.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800/50 transition-colors">
                                    <div className="w-8 text-center font-bold text-slate-500">#{index + 1}</div>
                                    <div className="w-10 h-10 bg-slate-800 rounded-lg relative overflow-hidden flex-shrink-0">
                                        {product.image_url ? (
                                            <Image src={product.image_url} alt="" fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600">No Img</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-200 truncate">{product.title}</p>
                                        <p className="text-[10px] text-slate-500 truncate">{product.games?.name}</p>
                                    </div>
                                    <div className="text-sm font-bold text-emerald-400">
                                        {formatRupiah(product.price)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-slate-500 text-sm italic">Belum ada produk yang terjual.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
