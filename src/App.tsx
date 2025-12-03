import { useState, useRef, useEffect, useCallback } from "react"
import "./App.css"
import { filmData } from "./data.ts"
import type { Movie } from "./data.ts"


// const API_URL = "http://localhost:8787"
const API_URL = "https://my-app.preraku.workers.dev"

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
            <div ref={divRef}>
                <p>
                    Total Movies: {movies.length} - Movies Watched:{" "}
                    {watchedMovies.size}
                </p>
                <p>
                    Total Nominations*: {totalNominations} - Nominations
                    Watched: {nominationsCleared}
                </p>
            </div>
            {isScrolled && (
                <div
                    style={{
                        position: "fixed",
                        top: "0",
                        width: "100%",
                        backgroundColor: "#242424",
                        zIndex: "998",
                        padding: "0",
                        flex: "row",
                    }}
                >
                    <p>
                        Total Movies: {movies.length} - Movies Watched:{" "}
                        {watchedMovies.size}
                    </p>
                    <p>
                        Total Nominations*: {totalNominations} - Nominations
                        Watched: {nominationsCleared}
                    </p>
                </div>
            )}
        </>
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

    useEffect(() => {
        const currentDiv = divRef.current
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsScrolled(!entry.isIntersecting)
            },
            { threshold: 1 },
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
            `I've watched ${watchedMovies.size}/${movies.length} movies and ${nominationsCleared}/${totalNominations} nominations for the 2024 Oscars.\n` +
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

    return (
        <>
            <h1>Oscars Checklist</h1>
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
                <button className="header-buttons" onClick={clearWatched}>
                    Clear All
                </button>
                <button className="header-buttons" onClick={share}>
                    {isCopied ? "Copied! ✅" : "Copy and Share!"}
                </button>
            </div>
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

            <Stats
                movies={movies}
                totalNominations={totalNominations}
                watchedMovies={watchedMovies}
                nominationsCleared={nominationsCleared}
                isScrolled={isScrolled}
                divRef={divRef}
            />
            <div>
                {awards.map(award => {
                    return (
                        <Category
                            key={award.name}
                            id={award.name}
                            name={award.name}
                            nominees={award.nominees}
                            movies={movies}
                            watchedMovies={watchedMovies}
                            toggleWatchedMovie={toggleWatchedMovie}
                        />
                    )
                })}
            </div>
            <p>{originalSongDisclaimers[year]}</p>
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
        </>
    )
}

export default App
