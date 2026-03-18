import {
    useState,
    useRef,
    useEffect,
    useCallback,
    useMemo,
    useLayoutEffect,
} from "react"
import { availableYears, filmData } from "./data.ts"
import { API_URL, originalSongDisclaimers } from "./constants.ts"
import { slugify, getAwardFromUrl, setAwardInUrl } from "./utils.ts"
import { loadWatchedMovies, pushMoviesToBackend } from "./api.ts"
import Category from "./components/Category.tsx"
import MovieGroup from "./components/MovieGroup.tsx"
import Stats from "./components/Stats.tsx"
import TableOfContents from "./components/TableOfContents.tsx"

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
    const [viewMode, setViewMode] = useState<"category" | "movie">("category")

    const movieGroups = useMemo(() => {
        const groups = Array.from(movieToNomsMap.entries()).map(([movieId, nominations]) => {
            const winnedCategories = new Set<string>()
            normalizedAwards.forEach(award => {
                if (nominations.includes(award.name)) {
                    const w = award.winner
                    if (Array.isArray(w) ? w.includes(movieId) : w === movieId) {
                        winnedCategories.add(award.name)
                    }
                }
            })
            return { movieId, nominations, winnedCategories }
        })
        groups.sort((a, b) => {
            if (b.nominations.length !== a.nominations.length) {
                return b.nominations.length - a.nominations.length
            }
            return movies[a.movieId].title.localeCompare(movies[b.movieId].title)
        })
        return groups
    }, [movieToNomsMap, normalizedAwards, movies])

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
        timeoutId.current = window.setTimeout(() => {
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
        "rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-ink shadow-btn transition duration-200 ease-out hover:-translate-y-0.5 hover:border-accent hover:shadow-btn-hover"

    return (
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-6 text-left sm:px-6">
            <header
                className="flex flex-col gap-3 border-b-2 border-accent pb-6"
                ref={headerRef}
            >
                <h1 className="m-0 text-[clamp(2.2rem,3vw,3rem)]">
                    Oscars Checklist
                </h1>
                <div className="flex flex-wrap items-center gap-3">
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
                            className="ml-2 bg-transparent text-ink focus:outline-none"
                        >
                            {availableYears.map(availableYear => (
                                <option key={availableYear} value={availableYear}>
                                    {availableYear}
                                </option>
                            ))}
                        </select>
                    </label>
                    <button
                        className={headerButtonClass}
                        onClick={() => setViewMode(viewMode === "category" ? "movie" : "category")}
                    >
                        {viewMode === "category" ? "By Movie" : "By Category"}
                    </button>
                    {viewMode === "category" && (
                        <button className={headerButtonClass} onClick={toggleToc}>
                            {isTocOpen ? "Hide Awards List" : "Show Awards List"}
                        </button>
                    )}
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
                    <div className="relative w-full max-w-[420px] rounded-[20px] border border-border bg-card p-8 shadow-modal dark:shadow-modal-dark">
                        <button
                            className="absolute right-4 top-4 rounded-full p-2 text-xl text-ink transition hover:text-accent"
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
                                className="rounded-xl border border-border-strong bg-input-bg px-4 py-3 text-sm text-ink"
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
                                className="rounded-xl border border-border-strong bg-input-bg px-4 py-3 text-sm text-ink"
                            />
                            <button
                                type="submit"
                                form="auth-form"
                                className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-ink shadow-btn transition hover:-translate-y-0.5 hover:border-accent"
                            >
                                {isLoginMode ? "Login" : "Sign Up"}
                            </button>
                        </form>
                        <button
                            onClick={() => setIsLoginMode(!isLoginMode)}
                            className="mt-4 w-full text-sm font-medium text-[#2e6f78] transition hover:text-accent dark:text-[#8ec7cf]"
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
                    isTocOpen && viewMode === "category"
                        ? "grid-cols-[minmax(240px,280px)_1fr]"
                        : "grid-cols-1"
                } max-[960px]:grid-cols-1`}
            >
                {isTocOpen && viewMode === "category" && (
                    <TableOfContents
                        awards={awardSections}
                        activeAwardId={activeAwardId}
                        onJump={jumpToAward}
                        onClose={() => setIsTocOpen(false)}
                        showCloseButton={isMobileView}
                    />
                )}
                <main className="flex flex-col gap-6">
                    <Stats
                        moviesCount={movies.length}
                        awards={normalizedAwards}
                        totalNominations={totalNominations}
                        watchedMovies={watchedMovies}
                        nominationsCleared={nominationsCleared}
                        isScrolled={isScrolled}
                        divRef={divRef}
                        suppressConfetti={isHydrating}
                    />
                    {viewMode === "category" ? (
                        <div className="flex flex-col gap-6">
                            {normalizedAwards.map((award, index) => {
                                const section = awardSections[index]
                                return (
                                    <Category
                                        key={section.id}
                                        id={section.id}
                                        name={award.name}
                                        nominees={award.nominees}
                                        winner={award.winner}
                                        movies={movies}
                                        watchedMovies={watchedMovies}
                                        toggleWatchedMovie={toggleWatchedMovie}
                                    />
                                )
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6 divide-y-2 divide-[#d8c9b0] dark:divide-[#4a3d2e]">
                            {movieGroups.map(({ movieId, nominations, winnedCategories }) => (
                                <MovieGroup
                                    key={movieId}
                                    movieId={movieId}
                                    nominations={nominations}
                                    winnedCategories={winnedCategories}
                                    movies={movies}
                                    watchedMovies={watchedMovies}
                                    toggleWatchedMovie={toggleWatchedMovie}
                                />
                            ))}
                        </div>
                    )}
                    {originalSongDisclaimers[year] && (
                        <p className="m-0 text-sm text-muted">
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
            {!isTocOpen && viewMode === "category" && (
                <button
                    className="fixed bottom-4 right-4 z-[997] inline-flex items-center rounded-full border border-accent bg-card px-4 py-2 text-sm font-semibold text-ink shadow-fab transition hover:-translate-y-0.5 hover:border-accent-ink max-[960px]:inline-flex min-[961px]:hidden"
                    onClick={() => setIsTocOpen(true)}
                >
                    Awards
                </button>
            )}
        </div>
    )
}

export default App
