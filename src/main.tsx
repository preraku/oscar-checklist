import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import YearsIndex from "./YearsIndex.tsx"
import { availableYears } from "./data.ts"
import { Routes, Route, HashRouter } from "react-router"
import "./index.css"

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");
ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <HashRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/years" element={<YearsIndex />} />
                <Route path="/years/" element={<YearsIndex />} />
                {availableYears.map(year => (
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
