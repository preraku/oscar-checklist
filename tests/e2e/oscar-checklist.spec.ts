import { test, expect, type Page } from "@playwright/test"

const YEAR = "2025"
const BASE_PATH = `/oscar-checklist/#/years/${YEAR}`

const getMoviesSeenCount = async (page: Page) => {
    const statsRow = page.locator(".stats-row").first()
    const moviesStat = statsRow
        .locator(".stat-metric")
        .filter({ hasText: /Movies Seen:/ })
    await expect(moviesStat).toBeVisible()
    const valueText = await moviesStat.locator(".stat-value").innerText()
    const [seenText, totalText] = valueText.split("/").map(part => part.trim())
    return { seen: Number(seenText), total: Number(totalText) }
}

const getStoredWatchedCount = async (page: Page) => {
    return page.evaluate((year) => {
        const raw = localStorage.getItem(`watchedMovies-${year}`)
        if (!raw) return 0
        try {
            const parsed = JSON.parse(raw)
            return Array.isArray(parsed) ? parsed.length : 0
        } catch {
            return 0
        }
    }, YEAR)
}

test("renders checklist and toggles watched state", async ({ page }) => {
    await page.goto(BASE_PATH)
    await expect(
        page.getByRole("heading", { name: "Oscars Checklist" }),
    ).toBeVisible()

    const before = await getMoviesSeenCount(page)
    expect(before.total).toBeGreaterThan(0)

    const checkbox = page.getByRole("checkbox").first()
    await checkbox.check()
    await expect(checkbox).toBeChecked()

    const after = await getMoviesSeenCount(page)
    expect(after.seen).toBe(before.seen + 1)

    await checkbox.uncheck()
    await expect(checkbox).not.toBeChecked()

    const reset = await getMoviesSeenCount(page)
    expect(reset.seen).toBe(before.seen)
})

test("reset clears watched movies", async ({ page }) => {
    await page.goto(BASE_PATH)
    const checkboxes = page.getByRole("checkbox")
    const count = await checkboxes.count()
    expect(count).toBeGreaterThan(1)

    await checkboxes.nth(0).check()
    await checkboxes.nth(1).check()
    await expect(checkboxes.nth(0)).toBeChecked()
    await expect(checkboxes.nth(1)).toBeChecked()

    const stored = await getStoredWatchedCount(page)
    expect(stored).toBeGreaterThanOrEqual(2)

    await page.getByRole("button", { name: "Reset" }).click()
    await expect(checkboxes.nth(0)).not.toBeChecked()
    await expect(checkboxes.nth(1)).not.toBeChecked()

    const storedAfter = await getStoredWatchedCount(page)
    expect(storedAfter).toBe(0)
})

test("toc navigation updates the url and scrolls", async ({ page }) => {
    await page.goto(BASE_PATH)
    const tocButton = page.locator(".toc-list button").first()
    await expect(tocButton).toBeVisible()
    await tocButton.click()
    await expect(page).toHaveURL(/award=award-/)

    const awardId = new URL(page.url()).searchParams.get("award")
    expect(awardId).toBeTruthy()

    const section = page.locator(`#${awardId}`)
    await expect(section).toBeVisible()
    await expect(section).toBeInViewport()
})

test("year menu switches the route", async ({ page }) => {
    await page.goto(BASE_PATH)
    await page.getByRole("button", { name: `Year: ${YEAR}` }).click()
    await page.getByRole("option", { name: "2024" }).click()
    await expect(page).toHaveURL(/#\/years\/2024/)
})

test("share copies progress to clipboard", async ({ page }) => {
    await page.goto(BASE_PATH)
    await page.getByRole("button", { name: "Share!" }).click()
    await expect(page.getByRole("button", { name: /Copied!/ })).toBeVisible()

    const text = await page.evaluate(() => navigator.clipboard.readText())
    expect(text).toContain("I've watched")
    expect(text).toContain(`#/years/${YEAR}`)
})

test.describe("mobile layout", () => {
    test.use({ viewport: { width: 375, height: 812 } })

    test("toc fab opens the awards list", async ({ page }) => {
        await page.goto(BASE_PATH)
        const fab = page.getByRole("button", { name: "Awards", exact: true })
        await expect(fab).toBeVisible()
        await fab.click()
        await expect(
            page.getByRole("complementary", {
                name: "Awards table of contents",
            }),
        ).toBeVisible()
    })
})
