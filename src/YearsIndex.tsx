import "./YearsIndex.css"
import { availableYears } from "./data.ts"

const YearsIndex = () => {
    return (
        <div className="years-index">
            <header className="years-index__header">
                <h1>Oscars Checklist</h1>
                <p>Select a year to open the checklist.</p>
            </header>
            <section className="years-index__section">
                <h2>Years</h2>
                <ul className="years-index__list">
                    {availableYears.map(year => (
                        <li key={year}>
                            <a
                                className="years-index__link"
                                href={`#/years/${year}`}
                            >
                                {year}
                            </a>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    )
}

export default YearsIndex
