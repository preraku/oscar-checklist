import PropTypes from "prop-types"

export default {
    movie: {
        id: PropTypes.number.isRequired,
        award: PropTypes.string.isRequired,
        movies: PropTypes.arrayOf(PropTypes.object).isRequired,
        watchedMovies: PropTypes.instanceOf(Set).isRequired,
        toggleWatchedMovie: PropTypes.func.isRequired,
    },
    category: {
        name: PropTypes.string.isRequired,
        movies: PropTypes.arrayOf(PropTypes.object).isRequired,
        nominees: PropTypes.arrayOf(PropTypes.number).isRequired,
        watchedMovies: PropTypes.instanceOf(Set).isRequired,
        toggleWatchedMovie: PropTypes.func.isRequired,
    },
    stats: {
        movies: PropTypes.arrayOf(PropTypes.object).isRequired,
        totalNominations: PropTypes.number.isRequired,
        watchedMovies: PropTypes.instanceOf(Set).isRequired,
        nominationsCleared: PropTypes.number.isRequired,
        isScrolled: PropTypes.bool.isRequired,
        divRef: PropTypes.object.isRequired,
    },
    app: {
        year: PropTypes.string,
    },
}
