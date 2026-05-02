"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardNav() {
    const pathname = usePathname()

    const navItems = [
        { href: '/dashboard', label: 'Kelola Dagangan', icon: '📊', exact: true },
        { href: '/dashboard/analytics', label: 'Analitik Toko', icon: '📈' },
        { href: '/sell', label: 'Jual Akun Baru', icon: '➕' },
        { href: '/dashboard/purchases', label: 'Riwayat Pembelian', icon: '🛒' },
        { href: '/dashboard/settings', label: 'Pengaturan Profil', icon: '⚙️' },
    ]

    return (
        <nav className="flex md:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {navItems.map((item) => {
                // Untuk '/dashboard', kita butuh exact match agar tidak aktif saat di '/dashboard/analytics'
                const isActive = item.exact 
                    ? pathname === item.href 
                    : pathname.startsWith(item.href)

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`px-4 py-3 text-sm font-medium rounded-xl transition-all flex items-center gap-3 whitespace-nowrap ${
                            isActive
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
                        }`}
                    >
                        <span>{item.icon}</span> {item.label}
                    </Link>
                )
            })}
        </nav>
    )
}
