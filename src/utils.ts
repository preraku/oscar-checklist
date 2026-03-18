export const slugify = (value: string) => {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
}

export const getAwardFromUrl = () => {
    if (typeof window === "undefined") return ""
    const params = new URLSearchParams(window.location.search)
    return params.get("award") ?? ""
}

export const setAwardInUrl = (id: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set("award", id)
    window.history.replaceState(null, "", url.toString())
}
