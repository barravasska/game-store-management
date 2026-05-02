import Link from 'next/link'

interface EmptyStateProps {
    icon: string;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
}

export default function EmptyState({ icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
    return (
        <div className="bg-slate-900 border border-slate-800 p-12 rounded-3xl text-center shadow-lg w-full flex flex-col items-center justify-center">
            <div className="text-6xl mb-6 bg-slate-800/50 w-24 h-24 rounded-full flex items-center justify-center">
                {icon}
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                {description}
            </p>
            {actionLabel && actionHref && (
                <Link 
                    href={actionHref} 
                    className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl inline-block transition-transform hover:scale-105 shadow-lg shadow-blue-600/20"
                >
                    {actionLabel}
                </Link>
            )}
        </div>
    )
}
