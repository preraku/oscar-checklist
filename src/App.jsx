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

const Category = ({ name, nominees, watchedMovies, toggleWatchedMovie }) => {
    return (
        <div className="category">
            <h2>{name}</h2>
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
                        zIndex: "1000",
                        padding: "0",
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

    return (
        <>
            <h1>Oscar Checklist</h1>
            <button onClick={clearWatched}>Clear All</button>
            <Stats
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
        </>
    )
}

export default App
