import { useState, useRef, useEffect, useCallback } from "react"
import "./App.css"
import { filmData } from "./data"
import proptypes from "./proptypes"

// const API_URL = "http://localhost:8787"
const API_URL = "https://my-app.preraku.workers.dev"

const Movie = ({ id, award, movies, watchedMovies, toggleWatchedMovie }) => {
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
                {award in movie && <p>{movie[award]}</p>}
            </div>
        </label>
    )
}
Movie.propTypes = proptypes.movie

const Category = ({
    id,
    name,
    nominees,
    movies,
    watchedMovies,
    toggleWatchedMovie,
}) => {
    const totalMoviesInCategory = nominees.length
    const watchedMoviesInCategory = nominees.filter(movie =>
        watchedMovies.has(movie),
    ).length
    return (
        <div className="category" id={id}>
            <h2>
                {name}{" "}
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
Category.propTypes = proptypes.category

const Stats = ({
    movies,
    totalNominations,
    watchedMovies,
    nominationsCleared,
    isScrolled,
    divRef,
}) => {
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
Stats.propTypes = proptypes.stats

const loadWatchedMovies = async year => {
    if (!localStorage.getItem("token")) {
        const watchedMovies = new Set(
            JSON.parse(localStorage.getItem(`watchedMovies-${year}`)),
        )
        console.log("localwatchedMovies", watchedMovies)
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

const pushMoviesToBackend = async (movies, year) => {
    if (!localStorage.getItem("token")) return

    try {
        console.log(
            "pushing movies to backend",
            JSON.stringify({ movies, year }),
        )
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

const originalSongDisclaimers = {
    2024: "Barbie has two nominations for Best Original Song. They have been combined here and are counting as one nomination.",
    2025: "Emilia Pérez has two nominations for Best Original Song. They have been combined here and are counting as one nomination.",
}

function App({ year = "2025" }) {
    const { movies, awards, awardsMap, totalNominations } = filmData[year]
    const [watchedMovies, setWatchedMovies] = useState(new Set())
    const [nominationsCleared, setNominationsCleared] = useState(0)
    const [username, setUsername] = useState(
        localStorage.getItem("username") || "",
    )
    const [token, setToken] = useState(localStorage.getItem("token") || "")
    const [isLoginMode, setIsLoginMode] = useState(true)
    const [error, setError] = useState("")
    const [isScrolled, setIsScrolled] = useState(false)
    const divRef = useRef(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false)
    const [isCopied, setIsCopied] = useState(false)

    const WATCHED_MOVIES_KEY = `watchedMovies-${year}`

    const pullWatchedMovies = useCallback(async () => {
        const movies = await loadWatchedMovies(year)
        setWatchedMovies(movies)
        setNominationsCleared(
            [...movies].reduce((acc, movieId) => {
                return acc + awardsMap.get(movieId).length
            }, 0),
        )
    }, [awardsMap, year])

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

    const toggleWatchedMovie = id => {
        setWatchedMovies(prev => {
            const newWatchedMovies = new Set(prev)
            if (newWatchedMovies.has(id)) {
                newWatchedMovies.delete(id)
                setNominationsCleared(
                    nominationsCleared - awardsMap.get(id).length,
                )
            } else {
                newWatchedMovies.add(id)
                setNominationsCleared(
                    nominationsCleared + awardsMap.get(id).length,
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

    const timeoutId = useRef(null)
    const share = async () => {
        const url = window.location.origin + window.location.pathname
        const text =
            `I've watched ${watchedMovies.size}/${movies.length} movies and ${nominationsCleared}/${totalNominations} nominations for the 2024 Oscars.\n` +
            `How about you? ${url}`

        navigator.clipboard.writeText(text)
        setIsCopied(true)

        clearTimeout(timeoutId.current)
        timeoutId.current = setTimeout(() => {
            setIsCopied(false)
        }, 3000)
    }

    const handleAuth = async e => {
        e.preventDefault()
        const formData = new FormData(e.target)
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
                setUsername(username)
                setToken(data.token)
                localStorage.setItem("username", username)
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
        } catch (err) {
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

            <button
                className="toc-button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                {isMenuOpen ? "Close" : "≡"}
            </button>

            <Stats
                movies={movies}
                totalNominations={totalNominations}
                watchedMovies={watchedMovies}
                nominationsCleared={nominationsCleared}
                isScrolled={isScrolled}
                divRef={divRef}
            />
            {isMenuOpen && (
                <div className="toc" onClick={() => setIsMenuOpen(false)}>
                    <h2>Table of Contents</h2>
                    <ul style={{ listStyleType: "none" }}>
                        {awards.map(award => (
                            <li key={award.name}>
                                <a href={`#${award.name}`}>{award.name}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
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

App.propTypes = proptypes.app

export default App
