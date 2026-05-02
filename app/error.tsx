"use client"

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Bisa diintegrasikan dengan Sentry atau log service lainnya di sini
        console.error("Global Error Caught:", error)
    }, [error])

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-[70vh]">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-orange-500"></div>
                
                <div className="w-24 h-24 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">
                    ⚠️
                </div>
                
                <h1 className="text-2xl font-extrabold text-white mb-3">Oops! Terjadi Kesalahan</h1>
                <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                    Sistem kami mengalami sedikit gangguan atau koneksi terputus. Jangan khawatir, teknisi kami sudah dinotifikasi.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={() => reset()}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20"
                    >
                        Coba Lagi
                    </button>
                    <Link
                        href="/"
                        className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all block"
                    >
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    )
}
