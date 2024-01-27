import PropTypes from "prop-types"

export default {
    movie: {
        id: PropTypes.number.isRequired,
        award: PropTypes.string.isRequired,
        watchedMovies: PropTypes.instanceOf(Set).isRequired,
        toggleWatchedMovie: PropTypes.func.isRequired,
    },
    category: {
        name: PropTypes.string.isRequired,
        nominees: PropTypes.arrayOf(PropTypes.number).isRequired,
        watchedMovies: PropTypes.instanceOf(Set).isRequired,
        toggleWatchedMovie: PropTypes.func.isRequired,
    },
    stats: {
        watchedMovies: PropTypes.instanceOf(Set).isRequired,
        nominationsCleared: PropTypes.number.isRequired,
        isScrolled: PropTypes.bool.isRequired,
        divRef: PropTypes.object.isRequired,
    },
}
