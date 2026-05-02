import DashboardNav from '@/components/shared/DashboardNav'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 border-t border-slate-800/50">

            {/* Sidebar (Kiri di Desktop, Atas di Mobile) */}
            <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-4 md:p-6 flex-shrink-0">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 hidden md:block">
                    Menu Penjual
                </h2>

                <DashboardNav />

                {/* Informasi Bantuan / Tips */}
                <div className="hidden md:block mt-10 p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-400 font-medium mb-2">💡 Tips Cepat Laku</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                        Pastikan harga wajar dan sertakan screenshot inventory yang lengkap untuk menarik pembeli.
                    </p>
                </div>
            </aside>

            {/* Main Content Area (Kanan di Desktop, Bawah di Mobile) */}
            <main className="flex-1 w-full bg-slate-950">
                {/* Children di sini adalah app/dashboard/page.tsx yang kita buat sebelumnya */}
                {children}
            </main>

        </div>
    )
}