"use client"

import { useActionState } from 'react'
import { processCheckout } from '@/actions/checkout'
import SubmitButton from '@/components/ui/SubmitButton'

export default function CheckoutPage() {
    const [state, formAction] = useActionState(
        async (prevState: any, formData: FormData) => {
            const method = formData.get('payment_method') as string
            return await processCheckout(method)
        },
        { error: null }
    )

    return (
        <div className="container mx-auto px-4 py-12 max-w-xl">
            <h1 className="text-3xl font-bold text-white mb-8 text-center">Pembayaran</h1>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
                {state?.error && (
                    <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                        {state.error}
                    </div>
                )}

                <p className="text-slate-400 mb-6 text-center">
                    Pilih metode pembayaran untuk menyelesaikan transaksi Anda. (Ini adalah simulasi)
                </p>

                <form action={formAction} className="space-y-6">
                    <div className="space-y-4">
                        <label className="flex items-center gap-4 p-4 border border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-500/10">
                            <input type="radio" name="payment_method" value="transfer_bank" className="w-5 h-5 accent-blue-500" defaultChecked />
                            <div>
                                <h3 className="font-bold text-white">Transfer Bank Virtual Account</h3>
                                <p className="text-xs text-slate-500">BCA, Mandiri, BNI, BRI</p>
                            </div>
                        </label>

                        <label className="flex items-center gap-4 p-4 border border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-500/10">
                            <input type="radio" name="payment_method" value="qris" className="w-5 h-5 accent-blue-500" />
                            <div>
                                <h3 className="font-bold text-white">QRIS (Gopay, OVO, Dana)</h3>
                                <p className="text-xs text-slate-500">Scan QR Code</p>
                            </div>
                        </label>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                        <SubmitButton label="Bayar Sekarang (Simulasi)" loadingLabel="Memproses..." />
                    </div>
                </form>
            </div>
        </div>
    )
}
