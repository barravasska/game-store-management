"use client"

import { useActionState } from 'react'
import { createAccount } from '@/actions/accounts'
import SubmitButton from '@/components/ui/SubmitButton'

interface Game {
    id: string
    name: string
}



export default function SellForm({ games }: { games: Game[] }) {
    const [state, formAction] = useActionState(createAccount, { error: null })

    return (
        <form action={formAction} className="space-y-6">
            {/* Tampilkan error dari server jika ada */}
            {state?.error && (
                <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {state.error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Judul Postingan</label>
                <input
                    name="title"
                    placeholder="Contoh: Akun Valorant Full Skin Bundle Kuronami"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-blue-500 outline-none"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Pilih Game</label>
                    <select
                        name="game_id"
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-blue-500 outline-none"
                        required
                    >
                        <option value="">Pilih Game</option>
                        {games?.map((game) => (
                            <option key={game.id} value={game.id}>{game.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Tier / Rank</label>
                    <input
                        name="tier"
                        placeholder="Ex: Ascendant / Mythic"
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-blue-500 outline-none"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Harga (Rp)</label>
                <input
                    name="price"
                    type="number"
                    placeholder="Contoh: 500000"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-blue-500 outline-none"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Deskripsi Detail</label>
                <textarea
                    name="description"
                    rows={4}
                    placeholder="Jelaskan detail skin, agen, atau kelebihan akunmu..."
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-blue-500 outline-none"
                ></textarea>
            </div>

            {/* Upload Screenshot */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Upload Bukti Screenshot</label>
                <input
                    name="image"
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20 cursor-pointer outline-none focus:border-blue-500"
                    required
                />
            </div>

            <SubmitButton label="Posting Sekarang" loadingLabel="Mengunggah Akun..." />
        </form>
    )
}
