import { useState, useRef, useEffect } from "react"
import "./App.css"
import { movies, awards, awardsMap, totalNominations } from "./data"
import proptypes from "./proptypes"

const Movie = ({ id, award, watchedMovies, toggleWatchedMovie }) => {
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

const Stats = ({ watchedMovies, nominationsCleared, isScrolled, divRef }) => {
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

function App() {
    const [watchedMovies, setWatchedMovies] = useState(
        new Set(JSON.parse(localStorage.getItem("watchedMovies"))),
    )
    const [nominationsCleared, setNominationsCleared] = useState(
        [...watchedMovies].reduce((acc, movieId) => {
            return acc + awardsMap.get(movieId).length
        }, 0),
    )
    const [isScrolled, setIsScrolled] = useState(false)
    const divRef = useRef(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isCopied, setIsCopied] = useState(false)

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
                "watchedMovies",
                JSON.stringify([...newWatchedMovies]),
            )
            return newWatchedMovies
        })
    }

    const clearWatched = () => {
        setWatchedMovies(new Set())
        setNominationsCleared(0)
        localStorage.setItem("watchedMovies", JSON.stringify([]))
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

    return (
        <>
            <h1>Oscars Checklist</h1>
            <button className="header-buttons" onClick={clearWatched}>
                Clear All
            </button>
            <button className="header-buttons" onClick={share}>
                {isCopied ? "Copied! ✅" : "Copy and Share!"}
            </button>
            <button
                className="toc-button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                {isMenuOpen ? "Close" : "≡"}
            </button>
            <Stats
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
                            watchedMovies={watchedMovies}
                            toggleWatchedMovie={toggleWatchedMovie}
                        />
                    )
                })}
            </div>
            <p>
                * Barbie has two nominations for Best Original Song. They have
                been combined here and are counting as one nomination.
            </p>
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
