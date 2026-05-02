import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import { createClient } from "@/lib/supabase/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GameMarket - Jual Beli Akun Game Terpercaya",
  description: "Marketplace akun Valorant, MLBB, PUBGM paling aman.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Ambil role user dari tabel profiles
  let role: string | null = null;
  let cartCount = 0;
  
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    role = profile?.role ?? null;

    // Ambil jumlah item di keranjang
    const { count } = await supabase
        .from('cart_items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
    
    cartCount = count || 0;
  }

  return (
    <html lang="id">
      <body className={`${inter.className} bg-slate-950 text-slate-50 min-h-screen flex flex-col`}>
        {/* Kita oper data user, role, dan cartCount ke Navbar */}
        <Navbar user={user} role={role} cartCount={cartCount} />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}