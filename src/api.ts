import { API_URL } from "./constants.ts"

export const loadWatchedMovies = async (year: string): Promise<Set<number>> => {
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
        if (!response.ok) {
            throw new Error(`Movies request failed: ${response.status}`)
        }
        const movies = await response.json()
        if (!Array.isArray(movies)) {
            throw new Error("Movies response was not an array")
        }
        return new Set(movies)
    } catch (error) {
        console.error("Error loading user movies:", error)
        const localMovies = localStorage.getItem(`watchedMovies-${year}`)
        if (!localMovies) return new Set()
        try {
            return new Set(JSON.parse(localMovies) as number[])
        } catch {
            return new Set()
        }
    }
}

export const pushMoviesToBackend = async (movies: number[], year: string) => {
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
