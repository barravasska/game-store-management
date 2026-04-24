import Link from 'next/link'
import { login } from '@/actions/auth'

export default function LoginPage({
    searchParams,
}: {
    searchParams: { message: string }
}) {
    return (
        <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Selamat Datang Kembali</h1>
                    <p className="text-slate-400">Login ke GameMarket</p>
                </div>

                <form action={login} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="nama@email.com"
                            required
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                        />
                    </div>

                    {/* Menampilkan pesan error atau sukses */}
                    {searchParams?.message && (
                        <p className={`text-sm text-center py-2 rounded ${searchParams.message.includes('Cek email') ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'
                            }`}>
                            {searchParams.message}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        Masuk
                    </button>
                </form>

                <p className="text-center text-sm text-slate-400 mt-6">
                    Belum punya akun?{' '}
                    <Link href="/auth/register" className="text-blue-400 hover:underline">
                        Daftar sekarang
                    </Link>
                </p>
            </div>
        </div>
    )
}