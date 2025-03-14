export default function Loading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#030014]">
            <div className="relative">
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-75 blur animate-pulse"></div>
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-black">
                    <div className="h-10 w-10 rounded-full border-2 border-t-indigo-500 border-r-transparent border-b-purple-600 border-l-transparent animate-spin"></div>
                </div>
            </div>
        </div>
    )
}

