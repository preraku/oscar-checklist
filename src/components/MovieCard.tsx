import { OSCAR_ICON_URL } from "../constants.ts"
import type { Movie } from "../data.ts"

export type MovieCardProps = {
    id: number
    award: string
    movies: Movie[]
    watchedMovies: Set<number>
    toggleWatchedMovie: (id: number) => void
    isWinner?: boolean
}

const MovieCard = ({ id, award, movies, watchedMovies, toggleWatchedMovie, isWinner }: MovieCardProps) => {
    const watched = watchedMovies.has(id)
    const movie = movies[id]
    const baseClasses =
        "group relative flex flex-[1_1_180px] max-[640px]:flex-[0_1_calc(50%-0.5rem)] flex-col gap-2 rounded-[18px] border px-4 py-4 text-left shadow-card transition duration-200 ease-out hover:-translate-y-1 hover:shadow-card-hover max-w-[230px] max-[640px]:max-w-none min-[961px]:max-w-none"
    const unwatchedClasses =
        "border-border bg-[linear-gradient(180deg,#fff8ed_0%,#f3e7d6_100%)] text-ink hover:border-[#d8b070] dark:bg-[linear-gradient(180deg,#2a2219_0%,#201913_100%)] dark:text-[#f1e8dc] dark:hover:border-[#7a5b2b]"
    const watchedClasses =
        "border-[#9cc4aa] bg-[linear-gradient(180deg,#e3f3ea_0%,#d4eadf_100%)] text-[#1f5a3a] line-through hover:border-[#6fb08e] dark:border-[#2f4a3a] dark:bg-[linear-gradient(180deg,#23382c_0%,#1c2c22_100%)] dark:text-[#bde1c8] dark:hover:border-[#3b5c48]"
    const winnerUnwatchedClasses =
        "border-[#d4a843] bg-[linear-gradient(180deg,#fff9e0_0%,#f5e4b0_100%)] text-ink hover:border-[#c49530] shadow-[0_10px_28px_rgba(190,150,40,0.35)] hover:shadow-[0_14px_36px_rgba(190,150,40,0.45)] dark:border-[#5a4a20] dark:bg-[linear-gradient(180deg,#2a2410_0%,#211d0e_100%)] dark:text-[#f5ecd0] dark:hover:border-[#7a6530] dark:shadow-[0_10px_28px_rgba(200,160,40,0.25)] dark:hover:shadow-[0_14px_36px_rgba(200,160,40,0.35)]"
    const winnerWatchedClasses =
        "border-[#b8c87a] bg-[linear-gradient(180deg,#f0f5d8_0%,#e2eac2_100%)] text-[#3a5a1f] line-through hover:border-[#a0b060] shadow-[0_10px_28px_rgba(160,150,40,0.3)] hover:shadow-[0_14px_36px_rgba(160,150,40,0.4)] dark:border-[#3a4a28] dark:bg-[linear-gradient(180deg,#242e1c_0%,#1c2416_100%)] dark:text-[#c8dea8] dark:hover:border-[#4a5a34] dark:shadow-[0_10px_28px_rgba(180,150,40,0.2)] dark:hover:shadow-[0_14px_36px_rgba(180,150,40,0.3)]"

    const stateClasses = isWinner
        ? (watched ? winnerWatchedClasses : winnerUnwatchedClasses)
        : (watched ? watchedClasses : unwatchedClasses)

    return (
        <label className={`${baseClasses} ${stateClasses}`}>
            {isWinner && (
                <img
                    src={OSCAR_ICON_URL}
                    alt="Winner"
                    className="winner-badge pointer-events-none absolute -top-[8px] -right-[6px] z-10 w-[20px] rotate-12 drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]"
                />
            )}
            <div className="flex flex-col gap-2">
                <input
                    type="checkbox"
                    checked={watched}
                    onChange={() => toggleWatchedMovie(id)}
                    aria-label={`Toggle ${movie.title} as watched`}
                    className="h-4 w-4 accent-accent"
                />
                <h3 className="text-[1.05rem] text-ink">
                    {movie.title}
                </h3>
                {movie.poster && (
                    <img
                        src={movie.poster}
                        alt={`${movie.title} poster`}
                        onError={event => {
                            event.currentTarget.style.display = "none"
                        }}
                        className="w-[44%] rounded-[10px] border-2 border-[#e1d2bf] shadow-poster transition duration-200 ease-out group-hover:scale-[1.04] dark:border-[#3a2e22] dark:shadow-poster-dark"
                    />
                )}
                {award in movie && (
                    <p className="text-sm text-muted">
                        {movie[award as keyof Movie]}
                    </p>
                )}
            </div>
        </label>
    )
}

export default MovieCard
