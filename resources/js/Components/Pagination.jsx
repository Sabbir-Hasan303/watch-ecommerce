import { ChevronLeft, ChevronRight } from "lucide-react"

/**
 * ? Pagination Component
 * Beautiful pagination UI with smart page number display
 * Shows first, last, current, and nearby pages with ellipsis for skipped pages
 */
export default function Pagination({
    currentPage = 1,
    totalPages = 1,
    onPageChange = () => {},
    paginationInfo = {}
}) {
    // * Don't show pagination if only one page
    if (totalPages <= 1) {
        return null
    }

    return (
        <>
            {/* Pagination Controls */}
            <div className="mt-12 flex items-center justify-center gap-2">
                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // ? Show first, last, current, and nearby pages
                        const isVisible =
                            page === 1 ||
                            page === totalPages ||
                            Math.abs(page - currentPage) <= 1

                        if (!isVisible && page !== 2 && page !== totalPages - 1) {
                            return null
                        }

                        if (page === 2 && currentPage > 3 && currentPage < totalPages - 2) {
                            return (
                                <span key="ellipsis-start" className="px-2 text-gray-400">
                                    …
                                </span>
                            )
                        }

                        if (page === totalPages - 1 && currentPage > 3 && currentPage < totalPages - 2) {
                            return (
                                <span key="ellipsis-end" className="px-2 text-gray-400">
                                    …
                                </span>
                            )
                        }

                        return (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`min-w-[40px] h-10 rounded-lg font-medium transition-all ${
                                    currentPage === page
                                        ? 'bg-black text-white shadow-md'
                                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                                }`}
                            >
                                {page}
                            </button>
                        )
                    })}
                </div>

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Page Info */}
            <div className="mt-6 text-center text-sm text-gray-500">
                Showing {paginationInfo.from || 0} to {paginationInfo.to || 0} of {paginationInfo.total || 0} products
            </div>
        </>
    )
}

