export type TableOfContentsProps = {
    awards: {
        id: string
        name: string
        count: number
    }[]
    activeAwardId: string
    onJump: (id: string) => void
    onClose: () => void
    showCloseButton: boolean
}

const TableOfContents = ({
    awards,
    activeAwardId,
    onJump,
    onClose,
    showCloseButton,
}: TableOfContentsProps) => {
    return (
        <aside
            className="sticky top-[calc(1rem+var(--floating-stats-offset,0px))] max-h-[calc(100vh-var(--floating-stats-offset,0px)-2rem)] overflow-auto rounded-[18px] border border-border bg-card p-4 shadow-toc animate-float-in"
            aria-label="Awards table of contents"
        >
            <div className="mb-3 flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[radial-gradient(circle,#f4c977_0%,#d19a2a_100%)] font-semibold text-[#2c2014] shadow-[0_0_18px_rgba(209,154,42,0.4)]">
                    ★
                </span>
                <p className="m-0 font-semibold text-ink">
                    Jump to an award
                </p>
                {showCloseButton && (
                    <button
                        type="button"
                        className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-border bg-white/70 text-lg leading-none text-ink transition hover:border-accent dark:bg-[rgba(32,25,19,0.8)]"
                        onClick={onClose}
                        aria-label="Hide awards list"
                    >
                        ×
                    </button>
                )}
            </div>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {awards.map((award, index) => {
                    const isActive = activeAwardId === award.id
                    return (
                        <li
                            key={award.id}
                            className="animate-fade-up"
                            style={{ animationDelay: `${index * 45}ms` }}
                        >
                            <button
                                type="button"
                                onClick={() => onJump(award.id)}
                                aria-current={isActive ? "true" : undefined}
                                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition duration-200 ease-out ${
                                    isActive
                                        ? "border-accent bg-[rgba(209,154,42,0.18)] shadow-[0_12px_20px_rgba(30,21,13,0.16)] dark:bg-[rgba(240,179,79,0.16)]"
                                        : "border-transparent bg-[rgba(249,240,228,0.7)] hover:translate-x-1 hover:border-[#d19a2a] hover:bg-[rgba(247,231,204,0.9)] hover:shadow-[0_10px_18px_rgba(30,21,13,0.12)] dark:bg-[rgba(32,25,19,0.75)] dark:hover:border-[#b07b2c] dark:hover:bg-[rgba(54,41,29,0.85)] dark:hover:shadow-[0_10px_18px_rgba(0,0,0,0.4)]"
                                }`}
                            >
                                <span
                                    className={`h-3 w-3 rounded-full bg-[linear-gradient(145deg,#f1bf63,#d47c2d)] shadow-[0_0_10px_rgba(209,154,42,0.6)] transition-transform ${
                                        isActive ? "scale-110" : "scale-90"
                                    }`}
                                    aria-hidden="true"
                                />
                                <span className="flex-1 font-semibold text-ink dark:text-[#f1e8dc]">
                                    {award.name}
                                </span>
                            </button>
                        </li>
                    )
                })}
            </ul>
        </aside>
    )
}

export default TableOfContents
