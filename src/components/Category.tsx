import { OSCAR_ICON_URL } from "../constants.ts"
import type { Movie } from "../data.ts"
import MovieCard from "./MovieCard.tsx"

export type CategoryProps = {
    id: string
    name: string
    nominees: number[]
    winner?: number | number[]
    movies: Movie[]
    watchedMovies: Set<number>
    toggleWatchedMovie: (id: number) => void
}

const Category = ({
    id,
    name,
    nominees,
    winner,
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
                    src={OSCAR_ICON_URL}
                    alt=""
                    className="h-[1em] w-auto translate-y-[-0.1em]"
                />
                {`for ${name} `}
                <span className="text-sm text-muted">
                    ({watchedMoviesInCategory}/{totalMoviesInCategory})
                </span>
            </h2>
            <div className="flex flex-wrap gap-4 max-[960px]:justify-center min-[961px]:grid min-[961px]:grid-cols-5 min-[961px]:gap-3">
                {nominees.map(nominee => {
                    return (
                        <MovieCard
                            id={nominee}
                            key={`${name}:${movies[nominee].title}`}
                            award={name}
                            movies={movies}
                            watchedMovies={watchedMovies}
                            toggleWatchedMovie={toggleWatchedMovie}
                            isWinner={Array.isArray(winner) ? winner.includes(nominee) : winner === nominee}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default Category
