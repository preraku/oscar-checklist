import {
    useState,
    useRef,
    useEffect,
    useCallback,
    useMemo,
    useLayoutEffect,
} from "react"
import "./App.css"
import { filmData } from "./data.ts"
import type { Movie } from "./data.ts"


// const API_URL = "http://localhost:8787"
const API_URL = "https://my-app.preraku.workers.dev"

const slugify = (value: string) => {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
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
    const watchedClass = watched ? "watched" : "unwatched"
    const movie = movies[id]
    return (
        <label className={`movie-box ${watchedClass}`}>
            <div>
                <input
                    type="checkbox"
                    checked={watched}
                    onChange={() => toggleWatchedMovie(id)}
                    aria-label={`Toggle ${movie.title} as watched`}
                />
                <h3>{movie.title}</h3>
                {movie.poster && (
                    <img
                        src={movie.poster}
                        alt={`${movie.title} poster`}
                        className="poster"
                    />
                )}
                {award in movie && <p>{movie[award as keyof Movie]}</p>}
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
        <div className="category" id={id}>
            <h2>
                <img 
                    src="/oscar-checklist/oscar_gold.svg" 
                    alt="" 
                    className="category-icon"
                    style={{
                        height: "1em",
                        width: "auto",
                        marginRight: "0.5em",
                        verticalAlign: "middle"
                    }}
                />
                {`for ${name} `}
                <span className="category-stats">
                    ({watchedMoviesInCategory}/{totalMoviesInCategory})
                </span>
            </h2>
            <div className="movies-row">
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
}

const Stats = ({
    movies,
    totalNominations,
    watchedMovies,
    nominationsCleared,
    isScrolled,
    divRef,
}: StatsProps) => {
    return (
        <>
            <div ref={divRef} className="stats-row">
                <p>
                    Movies Seen: {watchedMovies.size}/{movies.length}
                </p>
                <p>
                    Nominations Seen*: {nominationsCleared}/
                    {totalNominations}
                </p>
            </div>
            {isScrolled && (
                <div className="stats-row floating-stats">
                    <p>
                        Movies Seen: {watchedMovies.size}/{movies.length}
                    </p>
                    <p>
                        Nominations Seen*: {nominationsCleared}/
                        {totalNominations}
                    </p>
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
        <aside className="toc-card" aria-label="Awards table of contents">
            <div className="toc-header">
                <span className="toc-icon">★</span>
                <p className="toc-label-heading">Jump to an award</p>
                {showCloseButton && (
                    <button
                        type="button"
                        className="toc-close"
                        onClick={onClose}
                        aria-label="Hide awards list"
                    >
                        ×
                    </button>
                )}
            </div>
            <ul className="toc-list">
                {awards.map((award, index) => (
                    <li
                        key={award.id}
                        className={`toc-item ${
                            activeAwardId === award.id ? "active" : ""
                        }`}
                        style={{ animationDelay: `${index * 45}ms` }}
                    >
                        <button
                            type="button"
                            onClick={() => onJump(award.id)}
                            aria-current={
                                activeAwardId === award.id ? "true" : undefined
                            }
                        >
                            <span className="toc-bullet" aria-hidden="true" />
                            <span className="toc-item-name">{award.name}</span>
                        </button>
                    </li>
                ))}
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
        const movies = await response.json()
        return new Set(movies)
    } catch (error) {
        console.error("Error loading user movies:", error)
        return new Set()
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

function App({ year = "2025" }: AppProps) {
    const { movies, awards, movieToNomsMap, totalNominations } = filmData[year]
    const awardSections = useMemo(
        () =>
            awards.map(award => ({
                id: `award-${slugify(award.name)}`,
                name: award.name,
                count: award.nominees.length,
            })),
        [awards],
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
        const movies = await loadWatchedMovies(year)
        setWatchedMovies(movies)
        setNominationsCleared(
            [...movies].reduce((acc, movieId) => {
                return acc + (movieToNomsMap.get(movieId)!.length)
            }, 0),
        )
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
        const hash = window.location.hash.replace("#", "")
        if (!hash) {
            setActiveAwardId(awardSections[0].id)
            return
        }
        const target = document.getElementById(hash)
        if (target) {
            setActiveAwardId(hash)
            target.scrollIntoView({ behavior: "smooth", block: "start" })
        }
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
                    nominationsCleared - movieToNomsMap.get(id)!.length,
                )
            } else {
                newWatchedMovies.add(id)
                setNominationsCleared(
                    nominationsCleared + movieToNomsMap.get(id)!.length,
                )
            }
            localStorage.setItem(
                WATCHED_MOVIES_KEY,
                JSON.stringify([...newWatchedMovies]),
            )
            // push to backend
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
        const url = window.location.origin + window.location.pathname
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
                    // If logging in, fetch and update user's movies
                    await pullWatchedMovies()
                } else {
                    // If signing up, push current movies to the backend
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
        window.history.replaceState(null, "", `#${id}`)
        if (isMobileView) {
            setIsTocOpen(false)
        }
    }

    const toggleToc = () => setIsTocOpen(prev => !prev)

    return (
        <div className="page-shell">
            <header className="page-header" ref={headerRef}>
                <div className="title-stack">
                    <h1>Oscars Checklist</h1>
                </div>
                <div className="header-controls">
                    {token ? (
                        <>
                            <button
                                className="header-buttons"
                                onClick={handleLogout}
                            >
                                Logout {username}
                            </button>
                        </>
                    ) : (
                        <button
                            className="header-buttons"
                            onClick={() => setIsAuthMenuOpen(!isAuthMenuOpen)}
                        >
                            Login to Save
                        </button>
                    )}
                    <button className="header-buttons" onClick={toggleToc}>
                        {isTocOpen ? "Hide Awards List" : "Show Awards List"}
                    </button>
                    <button className="header-buttons" onClick={clearWatched}>
                        Clear All
                    </button>
                    <button className="header-buttons" onClick={share}>
                        {isCopied ? "Copied! ✅" : "Copy and Share!"}
                    </button>
                </div>
            </header>
            {isAuthMenuOpen && !token && (
                <div className="auth-modal">
                    <div className="auth-modal-content">
                        <button
                            className="close-button"
                            onClick={() => setIsAuthMenuOpen(false)}
                        >
                            ×
                        </button>
                        <h2>{isLoginMode ? "Login" : "Sign Up"}</h2>
                        {error && <p className="error">{error}</p>}
                        <form onSubmit={handleAuth} id="auth-form">
                            <input
                                type="text"
                                id="username"
                                name="username"
                                autoComplete="username"
                                autoCapitalize="none"
                                placeholder="Username"
                                required
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
                            />
                            <button type="submit" form="auth-form">
                                {isLoginMode ? "Login" : "Sign Up"}
                            </button>
                        </form>
                        <button
                            onClick={() => setIsLoginMode(!isLoginMode)}
                            className="toggle-auth"
                        >
                            {isLoginMode
                                ? "Need an account? Sign up"
                                : "Have an account? Login"}
                        </button>
                    </div>
                </div>
            )}

            <div className={`app-shell ${isTocOpen ? "with-toc" : "no-toc"}`}>
                {isTocOpen && (
                    <TableOfContents
                        awards={awardSections}
                        activeAwardId={activeAwardId}
                        onJump={jumpToAward}
                        onClose={() => setIsTocOpen(false)}
                        showCloseButton={isMobileView}
                    />
                )}
                <main className="content-area">
                    <Stats
                        movies={movies}
                        totalNominations={totalNominations}
                        watchedMovies={watchedMovies}
                        nominationsCleared={nominationsCleared}
                        isScrolled={isScrolled}
                        divRef={divRef}
                    />
                    <div className="categories">
                        {awards.map((award, index) => {
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
                        <p className="disclaimer">
                            *{originalSongDisclaimers[year]}
                        </p>
                    )}
                    <footer>
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
                <button className="toc-fab" onClick={() => setIsTocOpen(true)}>
                    Awards
                </button>
            )}
        </div>
    )
}

export default App
