import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import { Routes, Route, HashRouter } from "react-router"
import "./index.css"

const years = ["2024", "2025"]

ReactDOM.createRoot(document.getElementById("root")).render(
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
