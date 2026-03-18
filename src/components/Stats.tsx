import {
    useState,
    useRef,
    useEffect,
    useMemo,
    type CSSProperties,
} from "react"
import type { Award } from "../data.ts"

export type StatsProps = {
    moviesCount: number
    awards: Award[]
    totalNominations: number
    watchedMovies: Set<number>
    nominationsCleared: number
    isScrolled: boolean
    divRef: React.RefObject<HTMLDivElement>
    suppressConfetti: boolean
}

const Stats = ({
    moviesCount,
    awards,
    totalNominations,
    watchedMovies,
    nominationsCleared,
    isScrolled,
    divRef,
    suppressConfetti,
}: StatsProps) => {
    const winnerStats = useMemo(() => {
        const awardsWithWinners = awards.filter(a => a.winner !== undefined)
        const totalWinnerAwards = awardsWithWinners.length
        const winnerAwardsSeen = awardsWithWinners.filter(a => {
            const w = a.winner!
            return Array.isArray(w) ? w.every(id => watchedMovies.has(id)) : watchedMovies.has(w)
        }).length
        const uniqueWinnerMovieIds = new Set(awardsWithWinners.flatMap(a => Array.isArray(a.winner!) ? a.winner! : [a.winner!]))
        const totalWinnerMovies = uniqueWinnerMovieIds.size
        const winnerMoviesSeen = [...uniqueWinnerMovieIds].filter(id => watchedMovies.has(id)).length
        return { totalWinnerAwards, winnerAwardsSeen, totalWinnerMovies, winnerMoviesSeen }
    }, [awards, watchedMovies])
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
    const isScrolledRef = useRef(isScrolled)
    const movieBurstTimeout = useRef<number | null>(null)
    const nominationsBurstTimeout = useRef<number | null>(null)

    useEffect(() => {
        isScrolledRef.current = isScrolled
    }, [isScrolled])

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
            setMovieBurstMode(isScrolledRef.current ? "floating" : "static")
        }
        if (nominationsCleared > prevNominationsRef.current) {
            setNominationsBurst(prev => prev + 1)
            setNominationsBurstMode(isScrolledRef.current ? "floating" : "static")
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

    /* eslint-disable react-hooks/exhaustive-deps -- burst counters force new random positions per burst */
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
    /* eslint-enable react-hooks/exhaustive-deps */

    const renderStat = (
        label: string,
        valueText: string,
        burstCount: number,
        confettiClass: string,
        pieces: { id: number; style: React.CSSProperties }[],
    ) => (
        <p className="flex items-center gap-2 text-sm font-semibold text-ink sm:text-base">
            <span className="text-muted dark:text-[#d6c9b7]">
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
                className="flex flex-wrap items-center justify-center gap-5 border-b-2 border-accent px-1 pb-6 text-center"
            >
                {renderStat(
                    "Movies:",
                    `${watchedMovies.size}/${moviesCount}`,
                    showStatic && movieBurstMode === "static" ? movieBurst : 0,
                    "confetti-movies",
                    moviePieces,
                )}
                {renderStat(
                    "Nominations*:",
                    `${nominationsCleared}/${totalNominations}`,
                    showStatic && nominationsBurstMode === "static"
                        ? nominationsBurst
                        : 0,
                    "confetti-noms",
                    nominationsPieces,
                )}
                {winnerStats.totalWinnerMovies > 0 && renderStat(
                    "Winners (Movies):",
                    `${winnerStats.winnerMoviesSeen}/${winnerStats.totalWinnerMovies}`,
                    0,
                    "",
                    [],
                )}
                {winnerStats.totalWinnerAwards > 0 && renderStat(
                    "Winners (Awards):",
                    `${winnerStats.winnerAwardsSeen}/${winnerStats.totalWinnerAwards}`,
                    0,
                    "",
                    [],
                )}
            </div>
            {isScrolled && (
                <div className="fixed left-0 top-0 z-[998] flex w-full flex-wrap items-center justify-center gap-5 border-b border-border bg-[rgba(255,248,236,0.96)] px-4 py-3 text-center shadow-floating dark:bg-[rgba(27,21,16,0.96)] dark:shadow-floating-dark">
                    {renderStat(
                        "Movies:",
                        `${watchedMovies.size}/${moviesCount}`,
                        showFloating && movieBurstMode === "floating"
                            ? movieBurst
                            : 0,
                        "confetti-movies",
                        moviePieces,
                    )}
                    {renderStat(
                        "Nominations*:",
                        `${nominationsCleared}/${totalNominations}`,
                        showFloating && nominationsBurstMode === "floating"
                            ? nominationsBurst
                            : 0,
                        "confetti-noms",
                        nominationsPieces,
                    )}
                    {winnerStats.totalWinnerMovies > 0 && renderStat(
                        "Winners (Movies):",
                        `${winnerStats.winnerMoviesSeen}/${winnerStats.totalWinnerMovies}`,
                        0,
                        "",
                        [],
                    )}
                    {winnerStats.totalWinnerAwards > 0 && renderStat(
                        "Winners (Awards):",
                        `${winnerStats.winnerAwardsSeen}/${winnerStats.totalWinnerAwards}`,
                        0,
                        "",
                        [],
                    )}
                </div>
            )}
        </>
    )
}

export default Stats
