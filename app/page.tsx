import Link from 'next/link'
import AccountCard from '@/components/shared/AccountCard'
import SearchFilter from '@/components/shared/SearchFilter'
import { createClient } from '@/lib/supabase/server'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; game?: string; min?: string; max?: string }>
}) {
  const { q, game, min, max } = await searchParams
  const supabase = await createClient()

  // Ambil data game untuk dropdown filter
  const { data: gamesList } = await supabase.from('games').select('*')

  // Mulai query dasar
  let query = supabase
    .from('accounts')
    .select(`
      id, title, price, tier, image_url,
      profiles ( username ),
      games!inner ( name, slug )
    `)
    .eq('status', 'available')

  // --- LOGIKA FILTER DINAMIS ---
  if (q) query = query.ilike('title', `%${q}%`)
  if (game) query = query.eq('games.slug', game)
  if (min) query = query.gte('price', parseInt(min))
  if (max) query = query.lte('price', parseInt(max))

  const { data: accounts } = await query.order('created_at', { ascending: false })

  return (
    <div className="flex-1 flex flex-col items-center justify-start pb-32">

      {/* Hero Section (Tanpa Animasi agar kompatibel dengan Server Component) */}
      <section className="w-full flex flex-col items-center justify-center px-4 pt-24 pb-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        <div className="text-center max-w-3xl">
          <span className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-semibold tracking-wide border border-blue-500/20 mb-6 inline-block">
            Marketplace Akun Game #1
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Temukan Akun <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Impianmu</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
            Platform jual beli akun Valorant, Mobile Legends, dan PUBG Mobile yang aman. Transaksi cepat, garansi anti hack-back.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#latest" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105">
              Jelajahi Akun
            </Link>
            <Link href="/sell" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-semibold transition-all">
              Mulai Jualan
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Products Section */}
      <section id="latest" className="w-full max-w-7xl px-4 mt-10">
        {/* Panggil Komponen SearchFilter */}
        <SearchFilter games={gamesList || []} />

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">
            {q || game || min || max ? 'Hasil Pencarian' : 'Akun Terbaru'}
          </h2>
        </div>

        {/* Render data dari Supabase */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {accounts && accounts.length > 0 ? (
            accounts.map((account: any) => (
              <AccountCard
                key={account.id}
                id={account.id}
                title={account.title}
                game={account.games?.name || 'Game Unknown'}
                price={account.price}
                seller={account.profiles?.username || 'Anonim'}
                tier={account.tier}
                imageUrl={account.image_url}
              />
            ))
          ) : (
            <p className="text-slate-400 col-span-full text-center py-10">Belum ada akun yang sesuai kriteria.</p>
          )}
        </div>
      </section>

    </div>
  )
}