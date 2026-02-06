import {
    useState,
    useRef,
    useEffect,
    useCallback,
    useMemo,
    useLayoutEffect,
    type CSSProperties,
} from "react"
import { availableYears, filmData } from "./data.ts"
import type { Movie } from "./data.ts"

// const API_URL = "http://localhost:8787"
const API_URL = "https://my-app.preraku.workers.dev"

const slugify = (value: string) => {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
}

const getAwardFromUrl = () => {
    if (typeof window === "undefined") return ""
    const params = new URLSearchParams(window.location.search)
    return params.get("award") ?? ""
}

const setAwardInUrl = (id: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set("award", id)
    window.history.replaceState(null, "", url.toString())
}

type MovieProps = {
    id: number
    award: string
    movies: Movie[]
    watchedMovies: Set<number>
    toggleWatchedMovie: (id: number) => void
}

const Movie = ({ id, award, movies, watchedMovies, toggleWatchedMovie }: MovieProps) => {
    const watched = watchedMovies.has(id)
    const movie = movies[id]
    const baseClasses =
        "group flex flex-[1_1_180px] max-[640px]:flex-[0_1_calc(50%-0.5rem)] flex-col gap-2 rounded-[18px] border px-4 py-4 text-left shadow-[0_14px_24px_rgba(34,24,16,0.12)] transition duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_18px_32px_rgba(34,24,16,0.18)] max-w-[230px] max-[640px]:max-w-none min-[961px]:max-w-none"
    const unwatchedClasses =
        "border-[color:var(--border)] bg-[linear-gradient(180deg,#fff8ed_0%,#f3e7d6_100%)] text-[color:var(--ink)] hover:border-[#d8b070] dark:border-[#3a2e22] dark:bg-[linear-gradient(180deg,#2a2219_0%,#201913_100%)] dark:text-[#f1e8dc] dark:hover:border-[#7a5b2b]"
    const watchedClasses =
        "border-[#9cc4aa] bg-[linear-gradient(180deg,#e3f3ea_0%,#d4eadf_100%)] text-[#1f5a3a] line-through hover:border-[#6fb08e] dark:border-[#2f4a3a] dark:bg-[linear-gradient(180deg,#23382c_0%,#1c2c22_100%)] dark:text-[#bde1c8] dark:hover:border-[#3b5c48]"

    return (
        <label className={`${baseClasses} ${watched ? watchedClasses : unwatchedClasses}`}>
            <div className="flex flex-col gap-2">
                <input
                    type="checkbox"
                    checked={watched}
                    onChange={() => toggleWatchedMovie(id)}
                    aria-label={`Toggle ${movie.title} as watched`}
                    className="h-4 w-4 accent-[color:var(--accent)]"
                />
                <h3 className="text-[1.05rem] text-[color:var(--ink)] dark:text-[#f4ede3]">
                    {movie.title}
                </h3>
                {movie.poster && (
                    <img
                        src={movie.poster}
                        alt={`${movie.title} poster`}
                        className="w-[44%] rounded-[10px] border-2 border-[#e1d2bf] shadow-[0_8px_16px_rgba(25,18,12,0.15)] transition duration-200 ease-out group-hover:scale-[1.04] dark:border-[#3a2e22] dark:shadow-[0_10px_18px_rgba(0,0,0,0.45)]"
                    />
                )}
                {award in movie && (
                    <p className="text-sm text-[color:var(--muted)] dark:text-[#c0b4a5]">
                        {movie[award as keyof Movie]}
                    </p>
                )}
            </div>
        </label>
    )
}

type CategoryProps = {
    id: string
    name: string
    nominees: number[]
    movies: Movie[]
    watchedMovies: Set<number>
    toggleWatchedMovie: (id: number) => void
}

const Category = ({
    id,
    name,
    nominees,
    movies,
    watchedMovies,
    toggleWatchedMovie,
}: CategoryProps) => {
    const totalMoviesInCategory = nominees.length
    const watchedMoviesInCategory = nominees.filter(movie =>
        watchedMovies.has(movie),
    ).length
    return (
        <div
            className="scroll-mt-[calc(var(--floating-stats-height,64px)+0.25rem)] pt-2"
            id={id}
        >
            <h2 className="mb-3 flex items-center gap-2 text-[1.45rem]">
                <img
                    src="/oscar-checklist/oscar_gold.svg"
                    alt=""
                    className="h-[1em] w-auto translate-y-[-0.1em]"
                />
                {`for ${name} `}
                <span className="text-sm text-[color:var(--muted)] dark:text-[#c0b4a5]">
                    ({watchedMoviesInCategory}/{totalMoviesInCategory})
                </span>
            </h2>
            <div className="flex flex-wrap gap-4 max-[960px]:justify-center min-[961px]:grid min-[961px]:grid-cols-5 min-[961px]:gap-3">
                {nominees.map(nominee => {
                    return (
                        <Movie
                            id={nominee}
                            key={`${name}:${movies[nominee].title}`}
                            award={name}
                            movies={movies}
                            watchedMovies={watchedMovies}
                            toggleWatchedMovie={toggleWatchedMovie}
                        />
                    )
                })}
            </div>
        </div>
    )
}

type StatsProps = {
    movies: Movie[]
    totalNominations: number
    watchedMovies: Set<number>
    nominationsCleared: number
    isScrolled: boolean
    divRef: React.RefObject<HTMLDivElement>
    suppressConfetti: boolean
}

const Stats = ({
    movies,
    totalNominations,
    watchedMovies,
    nominationsCleared,
    isScrolled,
    divRef,
    suppressConfetti,
}: StatsProps) => {
    const createConfettiPieces = (count: number, palette: string[]) => {
        return Array.from({ length: count }, (_, index) => {
            const angle = Math.random() * Math.PI * 2
            const distance = 16 + Math.random() * 22
            const x = Math.cos(angle) * distance
            const y = Math.sin(angle) * distance
            const rotate = -40 + Math.random() * 80
            const delay = Math.random() * 180
            const color = palette[index % palette.length]

            return {
                id: index,
                style: {
                    "--x": `${x.toFixed(1)}px`,
                    "--y": `${y.toFixed(1)}px`,
                    "--r": `${rotate.toFixed(1)}deg`,
                    "--d": `${delay.toFixed(0)}ms`,
                    "--c": color,
                } as CSSProperties,
            }
        })
    }

    const [movieBurst, setMovieBurst] = useState(0)
    const [movieBurstMode, setMovieBurstMode] = useState<
        "static" | "floating" | null
    >(null)
    const [nominationsBurst, setNominationsBurst] = useState(0)
    const [nominationsBurstMode, setNominationsBurstMode] = useState<
        "static" | "floating" | null
    >(null)
    const prevMoviesRef = useRef(watchedMovies.size)
    const prevNominationsRef = useRef(nominationsCleared)
    const hasInitializedRef = useRef(false)
    const prevSuppressConfettiRef = useRef(suppressConfetti)
    const movieBurstTimeout = useRef<number | null>(null)
    const nominationsBurstTimeout = useRef<number | null>(null)

    useEffect(() => {
        if (suppressConfetti) {
            hasInitializedRef.current = true
            prevMoviesRef.current = watchedMovies.size
            prevNominationsRef.current = nominationsCleared
            prevSuppressConfettiRef.current = suppressConfetti
            return
        }
        if (prevSuppressConfettiRef.current) {
            prevSuppressConfettiRef.current = suppressConfetti
            prevMoviesRef.current = watchedMovies.size
            prevNominationsRef.current = nominationsCleared
            return
        }
        if (!hasInitializedRef.current) {
            hasInitializedRef.current = true
            prevMoviesRef.current = watchedMovies.size
            prevNominationsRef.current = nominationsCleared
            prevSuppressConfettiRef.current = suppressConfetti
            return
        }

        if (watchedMovies.size > prevMoviesRef.current) {
            setMovieBurst(prev => prev + 1)
            setMovieBurstMode(isScrolled ? "floating" : "static")
        }
        if (nominationsCleared > prevNominationsRef.current) {
            setNominationsBurst(prev => prev + 1)
            setNominationsBurstMode(isScrolled ? "floating" : "static")
        }

        prevMoviesRef.current = watchedMovies.size
        prevNominationsRef.current = nominationsCleared
        prevSuppressConfettiRef.current = suppressConfetti
    }, [watchedMovies.size, nominationsCleared, suppressConfetti])

    const showConfetti = isScrolled ? "floating" : "static"
    const showStatic = showConfetti === "static"
    const showFloating = showConfetti === "floating"

    useEffect(() => {
        if (movieBurst <= 0) return
        if (movieBurstTimeout.current) {
            window.clearTimeout(movieBurstTimeout.current)
        }
        movieBurstTimeout.current = window.setTimeout(() => {
            setMovieBurstMode(null)
        }, 900)
        return () => {
            if (movieBurstTimeout.current) {
                window.clearTimeout(movieBurstTimeout.current)
            }
        }
    }, [movieBurst])

    useEffect(() => {
        if (nominationsBurst <= 0) return
        if (nominationsBurstTimeout.current) {
            window.clearTimeout(nominationsBurstTimeout.current)
        }
        nominationsBurstTimeout.current = window.setTimeout(() => {
            setNominationsBurstMode(null)
        }, 900)
        return () => {
            if (nominationsBurstTimeout.current) {
                window.clearTimeout(nominationsBurstTimeout.current)
            }
        }
    }, [nominationsBurst])

    const moviePieces = useMemo(
        () =>
            createConfettiPieces(10, [
                "#ffe46b",
                "#7dffb1",
                "#ffc36a",
                "#8fffd2",
                "#ffdd84",
            ]),
        [movieBurst],
    )
    const nominationsPieces = useMemo(
        () =>
            createConfettiPieces(11, [
                "#ff9f93",
                "#ffd86b",
                "#88a9ff",
                "#ff8a80",
                "#ffbf59",
                "#7ea7ff",
            ]),
        [nominationsBurst],
    )

    const renderStat = (
        label: string,
        valueText: string,
        burstCount: number,
        confettiClass: string,
        pieces: { id: number; style: React.CSSProperties }[],
    ) => (
        <p className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)] sm:text-base">
            <span className="text-[color:var(--muted)] dark:text-[#d6c9b7]">
                {label}
            </span>{" "}
            <span className="relative inline-flex items-center gap-1">
                {valueText}
                {burstCount > 0 && (
                    <span
                        key={`${confettiClass}-${burstCount}`}
                        className={`confetti-burst ${confettiClass}`}
                        aria-hidden="true"
                    >
                        {pieces.map(piece => (
                            <span
                                key={piece.id}
                                className="confetti-piece"
                                style={piece.style}
                            />
                        ))}
                    </span>
                )}
            </span>
        </p>
    )

    return (
        <>
            <div
                ref={divRef}
                className="flex flex-wrap items-center justify-center gap-5 rounded-2xl border border-[color:var(--border)] bg-[linear-gradient(120deg,#fff5e6_0%,#f7e7cc_100%)] px-5 py-4 text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6)] dark:bg-[linear-gradient(120deg,#2b2219_0%,#241b14_100%)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
            >
                {renderStat(
                    "Movies Seen:",
                    `${watchedMovies.size}/${movies.length}`,
                    showStatic && movieBurstMode === "static" ? movieBurst : 0,
                    "confetti-movies",
                    moviePieces,
                )}
                {renderStat(
                    "Nominations Seen*:",
                    `${nominationsCleared}/${totalNominations}`,
                    showStatic && nominationsBurstMode === "static"
                        ? nominationsBurst
                        : 0,
                    "confetti-noms",
                    nominationsPieces,
                )}
            </div>
            {isScrolled && (
                <div className="fixed left-0 top-0 z-[998] flex w-full flex-wrap items-center justify-center gap-5 border-b border-[color:var(--border)] bg-[rgba(255,248,236,0.96)] px-4 py-3 text-center shadow-[0_10px_16px_rgba(28,19,12,0.12)] dark:bg-[rgba(27,21,16,0.96)] dark:shadow-[0_10px_16px_rgba(0,0,0,0.45)]">
                    {renderStat(
                        "Movies Seen:",
                        `${watchedMovies.size}/${movies.length}`,
                        showFloating && movieBurstMode === "floating"
                            ? movieBurst
                            : 0,
                        "confetti-movies",
                        moviePieces,
                    )}
                    {renderStat(
                        "Nominations Seen*:",
                        `${nominationsCleared}/${totalNominations}`,
                        showFloating && nominationsBurstMode === "floating"
                            ? nominationsBurst
                            : 0,
                        "confetti-noms",
                        nominationsPieces,
                    )}
                </div>
            )}
        </>
    )
}

type TableOfContentsProps = {
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
            className="sticky top-[calc(1rem+var(--floating-stats-offset,0px))] max-h-[calc(100vh-var(--floating-stats-offset,0px)-2rem)] overflow-auto rounded-[18px] border border-[color:var(--border)] bg-[color:var(--card)] p-4 shadow-[0_18px_26px_rgba(28,19,12,0.14)] animate-float-in"
            aria-label="Awards table of contents"
        >
            <div className="mb-3 flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[radial-gradient(circle,#f4c977_0%,#d19a2a_100%)] font-semibold text-[#2c2014] shadow-[0_0_18px_rgba(209,154,42,0.4)]">
                    ★
                </span>
                <p className="m-0 font-semibold text-[color:var(--ink)]">
                    Jump to an award
                </p>
                {showCloseButton && (
                    <button
                        type="button"
                        className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[color:var(--border)] bg-white/70 text-lg leading-none text-[color:var(--ink)] transition hover:border-[color:var(--accent)] dark:bg-[rgba(32,25,19,0.8)]"
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
                                        ? "border-[color:var(--accent)] bg-[rgba(209,154,42,0.18)] shadow-[0_12px_20px_rgba(30,21,13,0.16)] dark:bg-[rgba(240,179,79,0.16)]"
                                        : "border-transparent bg-[rgba(249,240,228,0.7)] hover:translate-x-1 hover:border-[#d19a2a] hover:bg-[rgba(247,231,204,0.9)] hover:shadow-[0_10px_18px_rgba(30,21,13,0.12)] dark:bg-[rgba(32,25,19,0.75)] dark:hover:border-[#b07b2c] dark:hover:bg-[rgba(54,41,29,0.85)] dark:hover:shadow-[0_10px_18px_rgba(0,0,0,0.4)]"
                                }`}
                            >
                                <span
                                    className={`h-3 w-3 rounded-full bg-[linear-gradient(145deg,#f1bf63,#d47c2d)] shadow-[0_0_10px_rgba(209,154,42,0.6)] transition-transform ${
                                        isActive ? "scale-110" : "scale-90"
                                    }`}
                                    aria-hidden="true"
                                />
                                <span className="flex-1 font-semibold text-[color:var(--ink)] dark:text-[#f1e8dc]">
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

const loadWatchedMovies = async (year: string): Promise<Set<number>> => {
    if (!localStorage.getItem("token")) {
        const localMovies = localStorage.getItem(`watchedMovies-${year}`)
        if (!localMovies) return new Set()
        const watchedMovies = new Set(JSON.parse(localMovies) as number[])
        return watchedMovies
    }

    try {
        const response = await fetch(
            `${API_URL}/api/v1/movies?` +
                new URLSearchParams({
                    year,
                }),
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            },
        )
        if (!response.ok) {
            throw new Error(`Movies request failed: ${response.status}`)
        }
        const movies = await response.json()
        if (!Array.isArray(movies)) {
            throw new Error("Movies response was not an array")
        }
        return new Set(movies)
    } catch (error) {
        console.error("Error loading user movies:", error)
        const localMovies = localStorage.getItem(`watchedMovies-${year}`)
        if (!localMovies) return new Set()
        try {
            return new Set(JSON.parse(localMovies) as number[])
        } catch {
            return new Set()
        }
    }
}

const pushMoviesToBackend = async (movies: number[], year: string) => {
    if (!localStorage.getItem("token")) return

    try {
        await fetch(`${API_URL}/api/v1/movies`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ movies, year }),
        })
    } catch (error) {
        console.error("Error syncing movies:", error)
    }
}

const originalSongDisclaimers: Record<string, string> = {
    2024: "Barbie has two nominations for Best Original Song. They have been combined here and are counting as one nomination.",
    2025: "Emilia Pérez has two nominations for Best Original Song. They have been combined here and are counting as one nomination.",
}

type AppProps = {
    year?: string
}

function App({ year = "2026" }: AppProps) {
    const { movies, awards, movieToNomsMap, totalNominations } = filmData[year]
    const normalizedAwards = useMemo(
        () =>
            awards.map(award => ({
                ...award,
                nominees: Array.from(new Set(award.nominees)),
            })),
        [awards],
    )
    const awardSections = useMemo(
        () =>
            normalizedAwards.map(award => ({
                id: `award-${slugify(award.name)}`,
                name: award.name,
                count: award.nominees.length,
            })),
        [normalizedAwards],
    )
    const [watchedMovies, setWatchedMovies] = useState<Set<number>>(new Set())
    const [nominationsCleared, setNominationsCleared] = useState(0)
    const [username, setUsername] = useState(
        localStorage.getItem("username") || "",
    )
    const [token, setToken] = useState(localStorage.getItem("token") || "")
    const [isLoginMode, setIsLoginMode] = useState(true)
    const [error, setError] = useState("")
    const [isScrolled, setIsScrolled] = useState(false)
    const [isHydrating, setIsHydrating] = useState(true)
    const divRef = useRef(null)
    const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const [activeAwardId, setActiveAwardId] = useState(
        awardSections[0]?.id ?? "",
    )
    const [isMobileView, setIsMobileView] = useState(() => {
        if (typeof window === "undefined") return false
        return window.innerWidth <= 960
    })
    const [isTocOpen, setIsTocOpen] = useState(() => {
        if (typeof window === "undefined") return true
        return window.innerWidth > 960
    })
    const headerRef = useRef<HTMLDivElement | null>(null)

    const WATCHED_MOVIES_KEY = `watchedMovies-${year}`

    const pullWatchedMovies = useCallback(async () => {
        setIsHydrating(true)
        try {
            const movies = await loadWatchedMovies(year)
            setWatchedMovies(movies)
            setNominationsCleared(
                [...movies].reduce((acc, movieId) => {
                    const nominations = movieToNomsMap.get(movieId)
                    return nominations ? acc + nominations.length : acc
                }, 0),
            )
        } finally {
            setIsHydrating(false)
        }
    }, [movieToNomsMap, year])

    useEffect(() => {
        pullWatchedMovies()
    }, [pullWatchedMovies])

    useLayoutEffect(() => {
        const setHeaderHeight = () => {
            const height = headerRef.current?.offsetHeight ?? 0
            document.documentElement.style.setProperty(
                "--header-height",
                `${height}px`,
            )
        }

        setHeaderHeight()
        window.addEventListener("resize", setHeaderHeight)
        return () => window.removeEventListener("resize", setHeaderHeight)
    }, [])

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 960
            setIsMobileView(mobile)
            if (mobile && isTocOpen) {
                setIsTocOpen(false)
            }
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [isTocOpen])

    useEffect(() => {
        if (!awardSections.length) return
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveAwardId(entry.target.id)
                    }
                })
            },
            {
                rootMargin: "0px 0px -40% 0px",
                threshold: [0],
            },
        )

        awardSections.forEach(section => {
            const element = document.getElementById(section.id)
            if (element) observer.observe(element)
        })

        return () => observer.disconnect()
    }, [awardSections])

    useEffect(() => {
        if (!awardSections.length) return
        const awardFromUrl = getAwardFromUrl()
        if (!awardFromUrl) {
            setActiveAwardId(awardSections[0].id)
            return
        }
        const target = document.getElementById(awardFromUrl)
        if (target) {
            setActiveAwardId(awardFromUrl)
            target.scrollIntoView({ behavior: "smooth", block: "start" })
            return
        }
        setActiveAwardId(awardSections[0].id)
    }, [awardSections])

    useEffect(() => {
        const currentDiv = divRef.current
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsScrolled(!entry.isIntersecting)
            },
            { threshold: 0 },
        )

        if (currentDiv) {
            observer.observe(currentDiv)
        }

        return () => {
            if (currentDiv) {
                observer.unobserve(currentDiv)
            }
        }
    }, [])

    useEffect(() => {
        document.documentElement.style.setProperty(
            "--floating-stats-offset",
            isScrolled ? "64px" : "0px",
        )
    }, [isScrolled])

    const toggleWatchedMovie = (id: number) => {
        setWatchedMovies(prev => {
            const newWatchedMovies = new Set(prev)
            if (newWatchedMovies.has(id)) {
                newWatchedMovies.delete(id)
                setNominationsCleared(
                    nominationsCleared -
                        (movieToNomsMap.get(id)?.length ?? 0),
                )
            } else {
                newWatchedMovies.add(id)
                setNominationsCleared(
                    nominationsCleared +
                        (movieToNomsMap.get(id)?.length ?? 0),
                )
            }
            localStorage.setItem(
                WATCHED_MOVIES_KEY,
                JSON.stringify([...newWatchedMovies]),
            )
            pushMoviesToBackend([...newWatchedMovies], year)
            return newWatchedMovies
        })
    }

    const clearWatched = () => {
        setWatchedMovies(new Set())
        setNominationsCleared(0)
        localStorage.setItem(WATCHED_MOVIES_KEY, JSON.stringify([]))
        pushMoviesToBackend([], year)
    }

    const timeoutId = useRef<number | null>(null)
    const share = async () => {
        const baseUrl = window.location.origin + window.location.pathname
        const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
        const url = `${normalizedBaseUrl}#/years/${year}`
        const text =
            `I've watched ${watchedMovies.size}/${movies.length} movies and ${nominationsCleared}/${totalNominations} nominations for the ${year} Oscars.\n` +
            `How about you? ${url}`

        navigator.clipboard.writeText(text)
        setIsCopied(true)

        if (timeoutId.current !== null) {
            clearTimeout(timeoutId.current)
        }
        timeoutId.current = setTimeout(() => {
            setIsCopied(false)
        }, 3000)
    }

    const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const username = formData.get("username")
        const password = formData.get("password")

        try {
            const endpoint = isLoginMode ? "/auth/login" : "/auth/signup"
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            })
            const data = await response.json()

            if (response.ok) {
                setUsername(username as string)
                setToken(data.token)
                localStorage.setItem("username", username as string)
                localStorage.setItem("token", data.token)
                setError("")

                if (isLoginMode) {
                    await pullWatchedMovies()
                } else {
                    await pushMoviesToBackend([...watchedMovies], year)
                }
            } else {
                setError(data.message || "Authentication failed")
            }
        } catch {
            setError("Network error occurred")
        }
    }

    const handleLogout = () => {
        setUsername("")
        setToken("")
        setError("")
        localStorage.removeItem("username")
        localStorage.removeItem("token")
        clearWatched()
        setIsAuthMenuOpen(false)
    }

    const jumpToAward = (id: string) => {
        const target = document.getElementById(id)
        if (!target) return
        target.scrollIntoView({ behavior: "smooth", block: "start" })
        setActiveAwardId(id)
        setAwardInUrl(id)
        if (isMobileView) {
            setIsTocOpen(false)
        }
    }

    const toggleToc = () => setIsTocOpen(prev => !prev)
    const handleYearSelect = (selectedYear: string) => {
        if (selectedYear === year) return
        window.location.hash = `/years/${selectedYear}`
    }

    const headerButtonClass =
        "rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-2 text-sm font-semibold text-[color:var(--ink)] shadow-[0_10px_18px_rgba(21,14,8,0.12)] transition duration-200 ease-out hover:-translate-y-0.5 hover:border-[color:var(--accent)] hover:shadow-[0_14px_24px_rgba(21,14,8,0.16)]"

    return (
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-6 text-left sm:px-6">
            <header
                className="relative flex flex-col gap-4 overflow-hidden rounded-[20px] border border-[color:var(--border)] bg-[linear-gradient(140deg,#fffaf2_0%,#f5e7d5_100%)] p-5 shadow-[0_24px_36px_rgba(27,18,11,0.16)] dark:bg-[linear-gradient(140deg,#2a2219_0%,#19130e_100%)]"
                ref={headerRef}
            >
                <div className="pointer-events-none absolute -right-20 -top-28 h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(210,155,42,0.3),transparent_70%)] opacity-80" />
                <div className="relative z-10">
                    <h1 className="m-0 text-[clamp(2.2rem,3vw,3rem)]">
                        Oscars Checklist
                    </h1>
                </div>
                    <div className="relative z-10 flex flex-wrap items-center gap-3">
                    {token ? (
                        <button className={headerButtonClass} onClick={handleLogout}>
                            Logout
                        </button>
                    ) : (
                        <button
                            className={headerButtonClass}
                            onClick={() => setIsAuthMenuOpen(!isAuthMenuOpen)}
                        >
                            Login to Save
                        </button>
                    )}
                    <label
                        className={`${headerButtonClass} inline-flex items-center cursor-pointer`}
                    >
                        Year:
                        <select
                            value={year}
                            onChange={event => handleYearSelect(event.target.value)}
                            aria-label="Select awards year"
                            className="ml-2 bg-transparent text-[color:var(--ink)] focus:outline-none"
                        >
                            {availableYears.map(availableYear => (
                                <option key={availableYear} value={availableYear}>
                                    {availableYear}
                                </option>
                            ))}
                        </select>
                    </label>
                    <button className={headerButtonClass} onClick={toggleToc}>
                        {isTocOpen ? "Hide Awards List" : "Show Awards List"}
                    </button>
                    <button className={headerButtonClass} onClick={clearWatched}>
                        Reset
                    </button>
                    <button className={headerButtonClass} onClick={share}>
                        {isCopied ? "Copied! ✅" : "Share!"}
                    </button>
                </div>
            </header>
            {isAuthMenuOpen && !token && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[rgba(18,12,8,0.55)] px-4 dark:bg-[rgba(6,4,2,0.7)]">
                    <div className="relative w-full max-w-[420px] rounded-[20px] border border-[color:var(--border)] bg-[color:var(--card)] p-8 shadow-[0_24px_44px_rgba(20,14,8,0.25)] dark:shadow-[0_24px_44px_rgba(0,0,0,0.55)]">
                        <button
                            className="absolute right-4 top-4 rounded-full p-2 text-xl text-[color:var(--ink)] transition hover:text-[color:var(--accent)]"
                            onClick={() => setIsAuthMenuOpen(false)}
                        >
                            ×
                        </button>
                        <h2 className="mb-4 text-2xl">
                            {isLoginMode ? "Login" : "Sign Up"}
                        </h2>
                        {error && (
                            <p className="mb-4 text-center text-sm text-[#c43f2b] dark:text-[#ff9b87]">
                                {error}
                            </p>
                        )}
                        <form onSubmit={handleAuth} id="auth-form" className="flex flex-col gap-4">
                            <input
                                type="text"
                                id="username"
                                name="username"
                                autoComplete="username"
                                autoCapitalize="none"
                                placeholder="Username"
                                required
                                className="rounded-xl border border-[color:var(--border-strong)] bg-[color:var(--input-bg)] px-4 py-3 text-sm text-[color:var(--ink)]"
                            />
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Password"
                                autoComplete={
                                    isLoginMode
                                        ? "current-password"
                                        : "new-password"
                                }
                                required
                                className="rounded-xl border border-[color:var(--border-strong)] bg-[color:var(--input-bg)] px-4 py-3 text-sm text-[color:var(--ink)]"
                            />
                            <button
                                type="submit"
                                form="auth-form"
                                className="rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-3 text-sm font-semibold text-[color:var(--ink)] shadow-[0_10px_18px_rgba(21,14,8,0.12)] transition hover:-translate-y-0.5 hover:border-[color:var(--accent)]"
                            >
                                {isLoginMode ? "Login" : "Sign Up"}
                            </button>
                        </form>
                        <button
                            onClick={() => setIsLoginMode(!isLoginMode)}
                            className="mt-4 w-full text-sm font-medium text-[#2e6f78] transition hover:text-[color:var(--accent)] dark:text-[#8ec7cf]"
                        >
                            {isLoginMode
                                ? "Need an account? Sign up"
                                : "Have an account? Login"}
                        </button>
                    </div>
                </div>
            )}

            <div
                className={`grid gap-5 ${
                    isTocOpen
                        ? "grid-cols-[minmax(240px,280px)_1fr]"
                        : "grid-cols-1"
                } max-[960px]:grid-cols-1`}
            >
                {isTocOpen && (
                    <TableOfContents
                        awards={awardSections}
                        activeAwardId={activeAwardId}
                        onJump={jumpToAward}
                        onClose={() => setIsTocOpen(false)}
                        showCloseButton={isMobileView}
                    />
                )}
                <main className="flex flex-col gap-6 rounded-[20px] border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-[0_20px_30px_rgba(24,17,10,0.12)]">
                    <Stats
                        movies={movies}
                        totalNominations={totalNominations}
                        watchedMovies={watchedMovies}
                        nominationsCleared={nominationsCleared}
                        isScrolled={isScrolled}
                        divRef={divRef}
                        suppressConfetti={isHydrating}
                    />
                    <div className="flex flex-col gap-6">
                        {normalizedAwards.map((award, index) => {
                            const section = awardSections[index]
                            return (
                                <Category
                                    key={section.id}
                                    id={section.id}
                                    name={award.name}
                                    nominees={award.nominees}
                                    movies={movies}
                                    watchedMovies={watchedMovies}
                                    toggleWatchedMovie={toggleWatchedMovie}
                                />
                            )
                        })}
                    </div>
                    {originalSongDisclaimers[year] && (
                        <p className="m-0 text-sm text-[color:var(--muted)] dark:text-[#c0b4a5]">
                            *{originalSongDisclaimers[year]}
                        </p>
                    )}
                    <footer className="text-center">
                        <a
                            href="https://github.com/preraku/oscar-checklist"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img
                                src="https://img.shields.io/badge/View%20on%20GitHub-goldenrod?&logo=github&"
                                alt="View on GitHub"
                            />
                        </a>
                    </footer>
                </main>
            </div>
            {!isTocOpen && (
                <button
                    className="fixed bottom-4 right-4 z-[997] inline-flex items-center rounded-full border border-[color:var(--accent)] bg-[color:var(--card)] px-4 py-2 text-sm font-semibold text-[color:var(--ink)] shadow-[0_16px_24px_rgba(24,17,10,0.14)] transition hover:-translate-y-0.5 hover:border-[color:var(--accent-ink)] max-[960px]:inline-flex min-[961px]:hidden"
                    onClick={() => setIsTocOpen(true)}
                >
                    Awards
                </button>
            )}
        </div>
    )
}

export default App
