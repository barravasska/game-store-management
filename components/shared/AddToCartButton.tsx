"use client"

import { useState } from 'react'
import { addToCart } from '@/actions/cart'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

export default function AddToCartButton({ accountId }: { accountId: string }) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleAddToCart = async () => {
        setIsLoading(true)
        try {
            const result = await addToCart(accountId)
            
            if (result.error) {
                // Konfigurasi alert untuk error
                Swal.fire({
                    title: 'Gagal!',
                    text: result.error,
                    icon: 'error',
                    background: '#0f172a', // slate-900
                    color: '#f8fafc', // slate-50
                    confirmButtonColor: '#3b82f6', // blue-500
                })

                if (result.error === "Kamu harus login terlebih dahulu") {
                    router.push('/auth/login')
                }
            } else if (result.success) {
                // Konfigurasi alert untuk sukses
                Swal.fire({
                    title: 'Berhasil!',
                    text: result.success,
                    icon: 'success',
                    background: '#0f172a',
                    color: '#f8fafc',
                    confirmButtonColor: '#10b981', // emerald-500
                    timer: 2000,
                    showConfirmButton: false
                })
            }
        } catch (error) {
            console.error(error)
            Swal.fire({
                title: 'Error!',
                text: 'Terjadi kesalahan sistem',
                icon: 'error',
                background: '#0f172a',
                color: '#f8fafc',
                confirmButtonColor: '#3b82f6',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20 text-lg flex items-center justify-center gap-2"
        >
            <span>{isLoading ? 'Memproses...' : '🛒 Masukkan ke Keranjang'}</span>
        </button>
    )
}
