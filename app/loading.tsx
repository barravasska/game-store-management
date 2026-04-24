export default function Loading() {
    // Bikin array kosong berisi 8 item untuk nampilin 8 skeleton card
    const skeletons = Array.from({ length: 8 })

    return (
        <div className="flex-1 flex flex-col items-center justify-start pb-32">
            {/* Skeleton Hero Section */}
            <section className="w-full flex flex-col items-center justify-center px-4 pt-24 pb-20">
                <div className="animate-pulse flex flex-col items-center max-w-3xl w-full">
                    <div className="h-8 w-48 bg-slate-800 rounded-full mb-6"></div>
                    <div className="h-16 w-3/4 bg-slate-800 rounded-xl mb-4"></div>
                    <div className="h-16 w-full bg-slate-800 rounded-xl mb-8"></div>
                    <div className="h-12 w-1/2 bg-slate-800 rounded-xl mb-10"></div>
                    <div className="flex gap-4">
                        <div className="h-14 w-40 bg-slate-800 rounded-xl"></div>
                        <div className="h-14 w-40 bg-slate-800 rounded-xl"></div>
                    </div>
                </div>
            </section>

            {/* Skeleton Grid Produk */}
            <section className="w-full max-w-7xl px-4 mt-10">
                <div className="h-8 w-48 bg-slate-800 rounded-lg mb-8 animate-pulse"></div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {skeletons.map((_, i) => (
                        <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden animate-pulse">
                            {/* Gambar Skeleton */}
                            <div className="h-48 bg-slate-800"></div>
                            {/* Info Skeleton */}
                            <div className="p-5">
                                <div className="h-3 w-16 bg-slate-700 rounded mb-2"></div>
                                <div className="h-5 w-full bg-slate-700 rounded mb-1"></div>
                                <div className="h-5 w-2/3 bg-slate-700 rounded mb-4"></div>

                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-800">
                                    <div className="h-6 w-24 bg-slate-700 rounded"></div>
                                    <div className="h-3 w-16 bg-slate-700 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}