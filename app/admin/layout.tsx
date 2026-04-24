import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 1. Kalau belum login, lempar ke login
    if (!user) redirect('/login')

    // 2. Cek apakah role user ini adalah 'admin'
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    // 3. Kalau bukan admin, tendang ke beranda
    if (profile?.role !== 'admin') {
        redirect('/')
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 border-t border-slate-800/50">

            {/* Sidebar Admin Khusus */}
            <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-4 md:p-6 flex-shrink-0">
                <h2 className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-4 hidden md:block">
                    Admin Control
                </h2>

                <nav className="flex md:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                    <Link
                        href="/admin"
                        className="px-4 py-3 text-sm font-medium bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20 hover:bg-rose-500/20 transition-all flex items-center gap-3 whitespace-nowrap"
                    >
                        <span>🛡️</span> Semua Postingan
                    </Link>
                    <Link
                        href="/admin/users"
                        className="px-4 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all flex items-center gap-3 whitespace-nowrap"
                    >
                        <span>👥</span> Kelola Pengguna
                    </Link>
                </nav>
            </aside>

            <main className="flex-1 w-full bg-slate-950">
                {children}
            </main>

        </div>
    )
}