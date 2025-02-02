import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import { Routes, Route, HashRouter } from "react-router"
import "./index.css"

const years = ["2024", "2025"]

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");
ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <HashRouter>
            <Routes>
                <Route path="/" element={<App />} />
                {years.map(year => (
                    <Route
                        key={year}
                        path={`/years/${year}`}
                        element={<App year={year} />}
                    />
                ))}
            </Routes>
        </HashRouter>
    </React.StrictMode>,
)
