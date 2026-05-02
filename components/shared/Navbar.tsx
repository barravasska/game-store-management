"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Navbar({ user, role, cartCount = 0 }: { user: User | null; role: string | null; cartCount?: number }) {
    const supabase = createClient()
    const router = useRouter()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.refresh() // Refresh biar UI update
    }

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md"
        >
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold text-white tracking-wider">
                    GAME<span className="text-blue-500">MARKET</span>
                </Link>

                <div className="hidden md:flex gap-6 text-sm font-medium text-slate-300">
                    <Link href="/games/valorant" className="hover:text-white transition-colors">Valorant</Link>
                    <Link href="/games/mlbb" className="hover:text-white transition-colors">Mobile Legends</Link>
                    <Link href="/games/pubgm" className="hover:text-white transition-colors">PUBG Mobile</Link>
                </div>

                <div className="flex gap-4 items-center">
                    {user ? (
                        <>
                            {/* Icon Keranjang */}
                            <Link href="/cart" className="relative p-2 text-slate-300 hover:text-white transition-colors">
                                <span className="text-xl">🛒</span>
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            <Link href="/sell" className="hidden sm:block px-4 py-2 text-sm font-medium bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-600/20 transition-all">
                                + Jual Akun
                            </Link>
                            <Link href="/dashboard" className="hidden sm:block text-sm font-medium text-slate-300 hover:text-white transition-colors">
                                Dashboard
                            </Link>
                            {role === 'admin' && (
                                <Link
                                    href="/admin"
                                    className="hidden sm:flex px-4 py-2 text-sm font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg hover:bg-rose-500/20 transition-all items-center gap-1.5"
                                >
                                    🛡️ Admin
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-medium bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-all"
                            >
                                Keluar
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-white hover:text-blue-400 transition-colors">
                                Masuk
                            </Link>
                            <Link href="/auth/register" className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                                Daftar
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </motion.nav>
    )
}