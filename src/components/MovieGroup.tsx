import { OSCAR_ICON_URL } from "../constants.ts"
import type { Movie } from "../data.ts"

export type MovieGroupProps = {
    movieId: number
    nominations: string[]
    winnedCategories: Set<string>
    movies: Movie[]
    watchedMovies: Set<number>
    toggleWatchedMovie: (id: number) => void
}

const MovieGroup = ({
    movieId,
    nominations,
    winnedCategories,
    movies,
    watchedMovies,
    toggleWatchedMovie,
}: MovieGroupProps) => {
    const movie = movies[movieId]
    const watched = watchedMovies.has(movieId)
    return (
        <div className="pt-2 pb-6">
            <div className="flex items-start gap-4">
                <label
                    className={`group relative flex w-[200px] shrink-0 max-[640px]:w-[80px] flex-col gap-2 rounded-[18px] border px-4 py-4 max-[640px]:px-2 max-[640px]:py-2 text-left shadow-card transition duration-200 ease-out hover:-translate-y-1 hover:shadow-card-hover ${
                        watched
                            ? "border-[#9cc4aa] bg-[linear-gradient(180deg,#e3f3ea_0%,#d4eadf_100%)] text-[#1f5a3a] line-through hover:border-[#6fb08e] dark:border-[#2f4a3a] dark:bg-[linear-gradient(180deg,#23382c_0%,#1c2c22_100%)] dark:text-[#bde1c8] dark:hover:border-[#3b5c48]"
                            : "border-border bg-[linear-gradient(180deg,#fff8ed_0%,#f3e7d6_100%)] text-ink hover:border-[#d8b070] dark:bg-[linear-gradient(180deg,#2a2219_0%,#201913_100%)] dark:text-[#f1e8dc] dark:hover:border-[#7a5b2b]"
                    }`}
                >
                    <div className="flex flex-col gap-2">
                        <input
                            type="checkbox"
                            checked={watched}
                            onChange={() => toggleWatchedMovie(movieId)}
                            aria-label={`Toggle ${movie.title} as watched`}
                            className="h-4 w-4 accent-accent"
                        />
                        {movie.poster && (
                            <img
                                src={movie.poster}
                                alt={`${movie.title} poster`}
                                onError={event => {
                                    event.currentTarget.style.display = "none"
                                }}
                                className="w-[80%] max-[640px]:w-full rounded-[10px] border-2 border-[#e1d2bf] shadow-poster transition duration-200 ease-out group-hover:scale-[1.04] dark:border-[#3a2e22] dark:shadow-poster-dark"
                            />
                        )}
                    </div>
                </label>
                <div className="flex flex-1 flex-col gap-1 py-2">
                    <h2 className="mb-0 text-[1.45rem] max-[640px]:text-[1.1rem]">
                        {movie.title}
                    </h2>
                    <span className="text-sm text-muted">
                        ({nominations.length} {nominations.length === 1 ? "nomination" : "nominations"})
                    </span>
                    <ul className="m-0 hidden max-[640px]:hidden min-[641px]:flex list-none flex-col gap-1 p-0 mt-2">
                        {nominations.map(category => {
                            const isWinner = winnedCategories.has(category)
                            const detail = movie[category as keyof Movie]
                            return (
                                <li
                                    key={category}
                                    className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-ink dark:text-[#f1e8dc]"
                                >
                                    <span className="inline-flex w-[1em] shrink-0 items-center justify-center">
                                        {isWinner && (
                                            <img
                                                src={OSCAR_ICON_URL}
                                                alt="Winner"
                                                className="h-[1em] w-auto"
                                            />
                                        )}
                                    </span>
                                    <span className="font-semibold">{category}</span>
                                    {typeof detail === "string" && detail && (
                                        <span className="text-muted">
                                            — {detail}
                                        </span>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
            <ul className="m-0 flex list-none flex-col gap-1 p-0 mt-2 min-[641px]:hidden">
                {nominations.map(category => {
                    const isWinner = winnedCategories.has(category)
                    const detail = movie[category as keyof Movie]
                    return (
                        <li
                            key={category}
                            className="flex items-start gap-2 rounded-lg px-3 py-1.5 text-sm text-ink dark:text-[#f1e8dc]"
                        >
                            <span className="inline-flex w-[1em] shrink-0 items-center justify-center mt-0.5">
                                {isWinner && (
                                    <img
                                        src={OSCAR_ICON_URL}
                                        alt="Winner"
                                        className="h-[1em] w-auto"
                                    />
                                )}
                            </span>
                            <span className="flex flex-col">
                                <span className="font-semibold">{category}</span>
                                {typeof detail === "string" && detail && (
                                    <span className="text-muted">
                                        {detail}
                                    </span>
                                )}
                            </span>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default MovieGroup
