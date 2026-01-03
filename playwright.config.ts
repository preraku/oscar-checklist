import { defineConfig, devices } from "@playwright/test"

const PORT = 5173
const BASE_URL = `http://127.0.0.1:${PORT}`

export default defineConfig({
    testDir: "tests/e2e",
    retries: process.env.CI ? 2 : 0,
    use: {
        baseURL: BASE_URL,
        permissions: ["clipboard-read", "clipboard-write"],
        trace: "on-first-retry",
    },
    webServer: {
        command: `bun run dev -- --host 127.0.0.1 --port ${PORT}`,
        url: `${BASE_URL}/oscar-checklist/`,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
})
