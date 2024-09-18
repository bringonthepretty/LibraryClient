export default function Pagination({currentPage, maxPage, onPageChanged}: {currentPage: number, maxPage: number, onPageChanged: (page: number) => Promise<void>}) {
    const pages: number[] = [];
    
    if (currentPage > 1) {
        pages.push(1)
    }
    if (currentPage > 2) {
        pages.push(currentPage - 1)
    }
    pages.push(currentPage)
    if (currentPage < maxPage - 1) {
        pages.push(currentPage + 1)
    }
    if (currentPage < maxPage) {
        pages.push(maxPage)
    }
    
    const pagesHtml = pages.map(page => {
        if (page == currentPage) {
            return <div key={page} className="inline">
                <button className="m-2 inline rounded-md border border-input w-10 h-10 bg-yellow-100 content-center" onClick={() => onPageChanged(page)}>{page}</button>
            </div>   
        } else {
            return <div key={page} className="inline">
                <button className="m-2 inline rounded-md border border-input w-10 h-10 content-center" onClick={() => onPageChanged(page)}>{page}</button>
            </div>
        }
    })
    
    return (
        <div className="flex justify-center ml-auto mb-3">
            {pagesHtml}
        </div>
    )
}