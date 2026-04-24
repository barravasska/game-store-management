"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function SearchFilter({ games }: { games: any[] }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [search, setSearch] = useState(searchParams.get('q') || '')
    const [game, setGame] = useState(searchParams.get('game') || '')
    const [minPrice, setMinPrice] = useState(searchParams.get('min') || '')
    const [maxPrice, setMaxPrice] = useState(searchParams.get('max') || '')

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const params = new URLSearchParams()
        if (search) params.set('q', search)
        if (game) params.set('game', game)
        if (minPrice) params.set('min', minPrice)
        if (maxPrice) params.set('max', maxPrice)

        router.push(`/?${params.toString()}`)
    }

    return (
        <form onSubmit={handleSearch} className="w-full bg-slate-900 border border-slate-800 p-6 rounded-2xl mb-10 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Keyword Search */}
                <div className="md:col-span-1">
                    <input
                        type="text"
                        placeholder="Cari judul akun..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-blue-500 outline-none text-sm"
                    />
                </div>

                {/* Game Filter */}
                <div>
                    <select
                        value={game}
                        onChange={(e) => setGame(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-blue-500 outline-none text-sm"
                    >
                        <option value="">Semua Game</option>
                        {games.map((g) => (
                            <option key={g.id} value={g.slug}>{g.name}</option>
                        ))}
                    </select>
                </div>

                {/* Price Range */}
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Min Rp"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-1/2 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-blue-500 outline-none text-sm"
                    />
                    <input
                        type="number"
                        placeholder="Max Rp"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-1/2 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-blue-500 outline-none text-sm"
                    />
                </div>

                {/* Submit Button */}
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all">
                    Cari Akun
                </button>
            </div>
        </form>
    )
}