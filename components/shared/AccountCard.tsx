"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

interface AccountCardProps {
    id: string;
    title: string;
    game: string;
    price: number;
    seller: string;
    tier: string;
    imageUrl?: string; // Tambahkan prop ini
}

export default function AccountCard({ id, title, game, price, seller, tier, imageUrl }: AccountCardProps) {
    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
    }

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all group"
        >
            <Link href={`/accounts/${id}`}>
                <div className="h-48 bg-slate-800 relative overflow-hidden">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600 italic text-sm">
                            No Preview
                        </div>
                    )}
                    <div className="absolute top-3 right-3 bg-slate-950/90 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded text-emerald-400 border border-emerald-500/20 uppercase">
                        {tier}
                    </div>
                </div>
            </Link>

            <div className="p-5">
                <p className="text-[10px] font-bold text-blue-500 mb-1 uppercase tracking-widest">{game}</p>
                <Link href={`/accounts/${id}`}>
                    <h3 className="text-sm font-bold text-white mb-4 line-clamp-2 hover:text-blue-400 transition-colors h-10">
                        {title}
                    </h3>
                </Link>

                <div className="flex items-center justify-between border-t border-slate-800/50 pt-4">
                    <p className="text-sm font-extrabold text-white">{formatRupiah(price)}</p>
                    <p className="text-[10px] text-slate-500 font-medium">Oleh {seller}</p>
                </div>
            </div>
        </motion.div>
    )
}