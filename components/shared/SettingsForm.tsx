"use client"

import { useActionState } from 'react'
import { updateProfile } from '@/actions/profiles'
import Image from 'next/image'
import SubmitButton from '@/components/ui/SubmitButton'

interface Profile {
    username: string | null
    avatar_url: string | null
}



export default function SettingsForm({ profile }: { profile: Profile | null }) {
    const [state, formAction] = useActionState(updateProfile, { error: null, success: null })

    return (
        <form action={formAction} className="space-y-8 bg-slate-900 border border-slate-800 p-8 rounded-2xl">
            {/* Notifikasi Status */}
            {state?.error && (
                <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {state.error}
                </div>
            )}
            {state?.success && (
                <div className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm">
                    {state.success}
                </div>
            )}

            {/* Avatar Section */}
            <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 bg-slate-800 rounded-full overflow-hidden border-2 border-blue-500/20">
                    {profile?.avatar_url ? (
                        <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl text-slate-500 font-bold">
                            {profile?.username?.charAt(0).toUpperCase() || '?'}
                        </div>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Foto Profil</label>
                    <input
                        type="file"
                        name="avatar"
                        accept="image/*"
                        className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20 cursor-pointer"
                    />
                </div>
            </div>

            <input type="hidden" name="currentAvatarUrl" value={profile?.avatar_url || ''} />

            {/* Username Section */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Username Publik</label>
                <div className="relative">
                    <span className="absolute left-4 top-3.5 text-slate-500">@</span>
                    <input
                        name="username"
                        type="text"
                        defaultValue={profile?.username || ''}
                        placeholder="ghifary_vasska"
                        className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-blue-500 outline-none transition-all"
                        required
                    />
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                    Ini adalah nama yang akan muncul di setiap postingan jualanmu.
                </p>
            </div>

            <SubmitButton label="Simpan Perubahan" loadingLabel="Menyimpan..." />
        </form>
    )
}
