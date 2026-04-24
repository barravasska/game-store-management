import { createClient } from '@/lib/supabase/server'
import SettingsForm from '@/components/shared/SettingsForm'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Ambil data profil saat ini
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

    return (
        <div className="p-4 md:p-10 max-w-2xl">
            <h1 className="text-3xl font-bold text-white mb-2">Pengaturan Profil</h1>
            <p className="text-slate-400 mb-8">Kelola informasi publik dan identitas tokomu.</p>

            {/* SettingsForm adalah Client Component agar bisa pakai useActionState */}
            <SettingsForm profile={profile} />
        </div>
    )
}