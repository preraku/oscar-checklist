import { availableYears } from "./data.ts"

const YearsIndex = () => {
    return (
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-4 py-6 sm:px-6">
            <header>
                <h1 className="m-0 text-[clamp(2.2rem,3vw,3rem)]">
                    Oscars Checklist
                </h1>
                <p className="mt-2 text-[color:var(--muted)]">
                    Select a year to open the checklist.
                </p>
            </header>
            <section className="rounded-[18px] border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-[0_18px_26px_rgba(24,17,10,0.12)]">
                <h2 className="text-2xl">Years</h2>
                <ul className="mt-4 grid list-none grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3 p-0">
                    {availableYears.map(year => (
                        <li key={year}>
                            <a
                                className="block rounded-[14px] border border-[color:var(--border)] bg-[linear-gradient(130deg,#fff7e8_0%,#f1e3d0_100%)] px-4 py-3 text-center font-semibold text-[color:var(--ink)] transition duration-200 ease-out hover:-translate-y-0.5 hover:border-[color:var(--accent)] hover:text-[color:var(--accent-ink)] hover:shadow-[0_10px_18px_rgba(24,17,10,0.16)] dark:bg-[linear-gradient(130deg,#2b2219_0%,#201913_100%)] dark:hover:border-[color:var(--accent)] dark:hover:text-[color:var(--accent-ink)] dark:hover:shadow-[0_10px_18px_rgba(0,0,0,0.45)]"
                                href={`#/years/${year}`}
                            >
                                {year}
                            </a>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    )
}

export default YearsIndex
