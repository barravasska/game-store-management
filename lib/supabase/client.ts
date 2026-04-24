import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    // Pastikan kamu udah masukin URL dan Anon Key di file .env.local
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}