"use client"

import { useFormStatus } from 'react-dom'

interface SubmitButtonProps {
    label: string;
    loadingLabel?: string;
}

export default function SubmitButton({ label, loadingLabel = "Memproses..." }: SubmitButtonProps) {
    // useFormStatus akan otomatis mendeteksi apakah form di sekitarnya sedang di-submit ke Server Action
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className={`w-full py-4 text-white font-bold rounded-xl transition-all shadow-lg ${pending
                ? 'bg-blue-600/50 cursor-not-allowed shadow-none'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                }`}
        >
            {pending ? (
                <span className="flex items-center justify-center gap-2">
                    {/* Ikon Loading SVG */}
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {loadingLabel}
                </span>
            ) : (
                label
            )}
        </button>
    )
}