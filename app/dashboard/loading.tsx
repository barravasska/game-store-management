export default function DashboardLoading() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 animate-pulse">
                <div className="w-full">
                    <div className="h-8 w-64 bg-slate-800 rounded-lg mb-3"></div>
                    <div className="h-4 w-96 bg-slate-800 rounded-lg max-w-full"></div>
                </div>
                <div className="h-12 w-40 bg-slate-800 rounded-xl"></div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 animate-pulse">
                <div className="space-y-4">
                    <div className="h-10 w-full bg-slate-800 rounded-xl"></div>
                    <div className="h-16 w-full bg-slate-800/50 rounded-xl"></div>
                    <div className="h-16 w-full bg-slate-800/50 rounded-xl"></div>
                    <div className="h-16 w-full bg-slate-800/50 rounded-xl"></div>
                </div>
            </div>
        </div>
    )
}
