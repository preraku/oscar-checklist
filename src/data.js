const movies = [
    {
        id: 0,
        title: "American Fiction",
        "Best Actor": "Jeffrey Wright",
        "Best Supporting Actor": "Sterling K. Brown",
        imdb: "https://www.imdb.com/title/tt23561236",
        watched: false,
        poster: "https://www.movieposters.com/cdn/shop/files/american_fiction_510x.jpg",
    },
    {
        id: 1,
        title: "Anatomy of a Fall",
        "Best Director": "Justine Triet",
        "Best Actress": "Sandra Hüller",
        imdb: "https://www.imdb.com/title/tt23561237",
        watched: false,
        poster: "https://image.tmdb.org/t/p/original/hfZQilZXgESkS88MvSoGN4ttNau.jpg",
    },
    {
        id: 2,
        title: "Barbie",
        "Best Supporting Actor": "Ryan Gosling",
        "Best Supporting Actress": "America Ferrera",
        "Original Song*": "I’m Just Ken & What Was I Made For?*",
        imdb: "https://www.imdb.com/title/tt23561238",
        watched: false,
        poster: "https://m.media-amazon.com/images/I/71BgdzmFDAL._AC_UF894,1000_QL80_.jpg",
    },
    {
        id: 3,
        title: "The Holdovers",
        "Best Actor": "Paul Giamatti",
        "Best Supporting Actress": "Da’Vine Joy Randolph",
        imdb: "",
        poster: "https://m.media-amazon.com/images/M/MV5BNDc2MzNkMjMtZDY5NC00NmQ0LWI1NjctZjRhNWIzZjc4MGRiXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_FMjpg_UX1000_.jpg",
        watched: false,
    },
    {
        id: 4,
        title: "Killers of the Flower Moon",
        "Best Director": "Martin Scorsese",
        "Best Actress": "Lily Gladstone",
        "Best Supporting Actor": "Robert De Niro",
        "Original Song*": "Wahzhazhe (A Song For My People)",
        imdb: "https://www.imdb.com/title/tt23561240",
        watched: false,
        poster: "https://sm.ign.com/t/ign_nordic/photo/default/kotfm-embrace-1693334916643_fu6z.600.jpg",
    },
    {
        id: 5,
        title: "Maestro",
        "Best Actor": "Bradley Cooper",
        "Best Actress": "Carey Mulligan",
        imdb: "https://www.imdb.com/title/tt23561241",
        watched: false,
        poster: "https://i.ebayimg.com/images/g/8d8AAOSwAKVlHYJ2/s-l1200.webp",
    },
    {
        id: 6,
        title: "Oppenheimer",
        "Best Director": "Christopher Nolan",
        "Best Actor": "Cillian Murphy",
        "Best Supporting Actor": "Robert Downey Jr.",
        "Best Supporting Actress": "Emily Blunt",
        imdb: "https://www.imdb.com/title/tt23561242",
        watched: false,
        poster: "https://www.movieposters.com/cdn/shop/products/oppenheimer_rlapaqwn-_1_600x.jpg",
    },
    {
        id: 7,
        title: "Past Lives",
        imdb: "https://www.imdb.com/title/tt23561243",
        watched: false,
        poster: "https://www.movieposters.com/cdn/shop/products/scan003_70663bc2-b396-4858-84b9-eedbe2d4abfe_480x.progressive.jpg?v=1681920012",
    },
    {
        id: 8,
        title: "Poor Things",
        "Best Director": "Yorgos Lanthimos",
        "Best Actress": "Emma Stone",
        "Best Supporting Actor": "Mark Ruffalo",
        imdb: "https://www.imdb.com/title/tt23561244",
        watched: false,
        poster: "https://i.etsystatic.com/25432943/r/il/84b866/5571719029/il_570xN.5571719029_fmuc.jpg",
    },
    {
        id: 9,
        title: "The Zone of Interest",
        "Best Director": "Jonathan Glazer",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561245",
        watched: false,
        poster: "https://images.squarespace-cdn.com/content/v1/63bb3e8a824d7e2f7eedf0d3/1697549721415-SK6YNTL7Z4ZEOIES1Z5K/The%2BZone%2Bof%2BInterest%2B4.jpg?format=500w",
    },
    {
        id: 10,
        title: "Rustin",
        "Best Actor": "Colman Domingo",
        imdb: "https://www.imdb.com/title/tt23561246",
        watched: false,
        poster: "https://lh3.googleusercontent.com/proxy/byx7lPZL0FXpRK-18GcmOqP5hNk16MvEpsSzZNzG4-S9cytIsOVvlxtOawpUKocWp39t5u3TSJOMjf8iUwUacaUML8U6pE0L",
    },
    {
        id: 11,
        title: "Nyad",
        "Best Actress": "Annette Bening",
        "Best Supporting Actress": "Jodie Foster",
        imdb: "https://www.imdb.com/title/tt23561247",
        watched: false,
        poster: "https://m.media-amazon.com/images/I/61L0OaTT6DL._AC_UF894,1000_QL80_.jpg",
    },
    {
        id: 12,
        title: "The Color Purple",
        "Best Supporting Actress": "Danielle Brooks",
        imdb: "https://www.imdb.com/title/tt23561248",
        watched: false,
        poster: "https://i.ebayimg.com/images/g/yyAAAOSwdl1kbuIt/s-l1200.webp",
    },
    {
        id: 13,
        title: "The Teachers' Lounge",
        "International Feature": "Germany", // TODO: Replace with flag.
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://cdn.theatertoolkit.com/media/thelotent/features/posters/-ho00001627-Medium.jpg",
    },
    {
        id: 14,
        title: "Io Capitano",
        "International Feature": "Italy",
        imdb: "https://www.imdb.com/title/tt23561250",
        watched: false,
        poster: "https://m.media-amazon.com/images/M/MV5BYmUwNDM2MTQtZWE3ZC00OWM5LTg5YzctZmFhNWNkMzRhMzQ4XkEyXkFqcGdeQXVyMzIwNDY4NDI@._V1_.jpg",
    },
    {
        id: 15,
        title: "Perfect Days",
        "International Feature": "Japan",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://yc.cldmlk.com/8egh4pzb72gwe1mpt1vtez21a8/1702976504560_Poster.jpg",
    },
    {
        id: 16,
        title: "Society of the Snow",
        "International Feature": "Spain",
        imdb: "https://www.imdb.com/title/tt23561250",
        watched: false,
        poster: "https://lh3.googleusercontent.com/proxy/tFP2Qvj4_VVd9dlCimclQt8iwOiFii2Wu34Cg-boj47Cw6axzUa5qVjduKcNkKpsmEAwcbAdpJFLts7H4RYaqPreNT1O5qquTAigc_wv5UUqlIQ4MIchQmyqSQZ9HBsNDuXV",
    },
    {
        id: 17,
        title: "Flamin' Hot",
        "Original Song*": "The Fire Inside",
        imdb: "https://www.imdb.com/title/tt23561250",
        watched: false,
        poster: "https://i.ebayimg.com/images/g/WjIAAOSwbcVkWDLY/s-l400.jpg",
    },
    {
        id: 18,
        title: "American Symphony",
        "Original Song*": "It Never Went Away",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://m.media-amazon.com/images/M/MV5BOWI1MzYxYjEtMzkwNS00ZGU4LWFjZGUtMDM3OGY3MTM5MGY4XkEyXkFqcGdeQXVyMTUzOTczNzYx._V1_.jpg",
    },
    {
        id: 19,
        title: "May December",
        imdb: "https://www.imdb.com/title/tt23561250",
        watched: false,
        poster: "https://lh3.googleusercontent.com/proxy/1fyaeT9pCijHfdL1fvwX1fDnDS9ly-zLqb89IStKayA17Sn3XMBV_WQvrwAPsmJ1HMXLfRrdwOZNXzs5VinNsSStqTZutuRCLfk87EbihGEYyqs",
    },

    {
        id: 20,
        title: "The Boy and the Heron",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://cdn.posteritati.com/posters/000/000/069/999/the-boy-and-the-heron-md-web.jpg",
    },
    {
        id: 21,
        title: "Elemental",
        imdb: "https://www.imdb.com/title/tt23561250",
        watched: false,
        poster: "https://i.etsystatic.com/25432943/r/il/0b0319/5015973239/il_570xN.5015973239_8adn.jpg",
    },
    {
        id: 22,
        title: "Nimona",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://preview.redd.it/okay-never-mind-i-found-the-nimona-movie-poster-on-twitter-v0-13wjp5ntb9wa1.jpg?width=640&crop=smart&auto=webp&s=126ee7d5da9dc362e50e20008f23b95a90d74524",
    },
    {
        id: 23,
        title: "Spider-Man: Across the Spider-Verse",
        imdb: "https://www.imdb.com/title/tt23561250",
        watched: false,
        poster: "https://m.media-amazon.com/images/I/51rqjyXoySL._AC_.jpg",
    },
    {
        id: 24,
        title: "Robot Dreams",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://cdn.cinematerial.com/p/297x/onq8r4xm/robot-dreams-spanish-movie-poster-md.jpg?v=1698772003",
    },
    {
        id: 25,
        title: "Napoleon",
        imdb: "https://www.imdb.com/title/tt23561250",
        watched: false,
        poster: "https://i.ebayimg.com/images/g/trMAAOSw~ERlKAIH/s-l1200.webp",
    },
    {
        id: 26,
        title: "El Conde",
        imdb: "https://www.imdb.com/title/tt23561250",
        watched: false,
        poster: "https://lh3.googleusercontent.com/proxy/sO0CCTVhleoTXYvXtBbb1-3NEqa8PekUCh4odmy1h8cdM2Y2j474_JTDC2AZKfLmXpK_mZfhEncd6azzK8V3HnTCBWzw-Vx3bP71DEnD5t2bYJEdgucrIc8",
    },
    {
        id: 27,
        title: "Golda",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
    },
    {
        id: 28,
        title: "The Creator",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://i.etsystatic.com/27062086/r/il/4397ff/5332652257/il_570xN.5332652257_p2fd.jpg",
    },
    {
        id: 29,
        title: "Mission Impossible — Dead Reckoning Part One",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://i.ebayimg.com/images/g/N0AAAOSwAwtklta6/s-l1200.webp",
    },
    {
        id: 30,
        title: "Godzilla Minus One",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://upload.wikimedia.org/wikipedia/en/e/e0/Godzilla_Minus_One_Poster.jpeg",
    },
    {
        id: 31,
        title: "Guardians of the Galaxy Vol. 3",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://preview.redd.it/made-a-gotg3-poster-recently-wanted-a-more-retro-style-v0-84sh42npn8za1.png?width=640&crop=smart&auto=webp&s=af1f132fe69b62fde6e58f1b1f229d91b4ba0401",
    },
    {
        id: 32,
        title: "Indiana Jones and the Dial of Destiny",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://media.wdwnt.com/2022/12/Indiana-Jones-5.jpg",
    },
    {
        id: 33,
        title: "Bobi Wine: The People’s President",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://lh3.googleusercontent.com/proxy/Pp2HfgCtu1m-rHF51oNdpdCz2-rY153LXva-UD4mmPZX7Cdx5HBlD_ufNdIY7pqNlyz13k1skB_5J8kLyBR9wa4w0dfXL1mJjxoiX_zdWMLIyw7cqQcrHWAmq-60NcqH0A",
    },
    {
        id: 34,
        title: "The Eternal Memory",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://s3.amazonaws.com/nightjarprod/content/uploads/sites/130/2023/06/29184206/eternal-memory-poster.jpeg",
    },
    {
        id: 35,
        title: "Four Daughters",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://www.marinarts.org/wp-content/uploads/sites/www.marinarts.org/images/2023/11/Four-Daughters.jpg",
    },
    {
        id: 36,
        title: "To Kill a Tiger",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://d3lzcn6mbbadaf.cloudfront.net/media/details/ANI-20240124031415.jpg",
    },
    {
        id: 37,
        title: "20 Days in Mariupol",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://upload.wikimedia.org/wikipedia/en/thumb/b/be/20_Days_in_Mariupol_poster.jpg/220px-20_Days_in_Mariupol_poster.jpg",
    },
    {
        id: 38,
        title: "Letter to a Pig",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://upload.wikimedia.org/wikipedia/en/thumb/2/24/Letter_to_a_Pig_Film_Poster.jpg/220px-Letter_to_a_Pig_Film_Poster.jpg",
    },
    {
        id: 39,
        title: "Ninety-Five Senses",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://www.indieactivity.com/wp-content/uploads/2023/10/ninety-five-senses.jpg",
    },
    {
        id: 40,
        title: "Our Uniform",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
    },
    {
        id: 41,
        title: "Pachyderme",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
    },
    {
        id: 42,
        title: "War Is Over! Inspired by the Music of John & Yoko",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
    },
    {
        id: 43,
        title: "The ABCs of Book Banning",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
    },
    {
        id: 44,
        title: "The Barber of Little Rock",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
    },
    {
        id: 45,
        title: "Island in Between",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
    },
    {
        id: 46,
        title: "The Last Repair Shop",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
    },
    {
        id: 47,
        title: "Nai Nai & Wai Po",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
    },
    {
        id: 48,
        title: "The After",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
    },
    {
        id: 49,
        title: "Invincible",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
    },
    {
        id: 50,
        title: "Knight of Fortune",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
    },
    {
        id: 51,
        title: "Red, White and Blue",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
    },
    {
        id: 52,
        title: "The Wonderful Story of Henry Sugar",
        "International Feature": "United Kingdom",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
    },
]

const awards = [
    { id: 0, name: "Best Picture", nominees: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
    { id: 1, name: "Best Director", nominees: [1, 4, 6, 8, 9] },
    { id: 2, name: "Best Actor", nominees: [0, 3, 5, 6, 10] },
    { id: 3, name: "Best Actress", nominees: [1, 4, 5, 8, 11] },
    { id: 4, name: "Best Supporting Actor", nominees: [0, 2, 4, 6, 8] },
    { id: 5, name: "Best Supporting Actress", nominees: [2, 3, 6, 11, 12] },
    { id: 6, name: "Original Screenplay", nominees: [1, 3, 19, 5, 7] },
    { id: 7, name: "Adapted Screenplay", nominees: [0, 2, 6, 8, 9] },
    { id: 8, name: "Animated Feature", nominees: [20, 21, 22, 23, 24] },
    { id: 9, name: "Production Design", nominees: [2, 4, 25, 6, 8] },
    { id: 10, name: "Costume Design", nominees: [2, 4, 25, 6, 8] },
    { id: 11, name: "Cinematography", nominees: [26, 4, 5, 6, 8] },
    { id: 12, name: "Editing", nominees: [1, 3, 4, 6, 8] },
    { id: 13, name: "Makeup and Hairstyling", nominees: [27, 5, 6, 8, 15] },
    { id: 14, name: "Sound", nominees: [28, 5, 29, 8, 9] },
    { id: 15, name: "Visual Effects", nominees: [28, 30, 31, 29, 25] },
    { id: 16, name: "Original Score", nominees: [0, 32, 4, 6, 8] },
    { id: 17, name: "Original Song*", nominees: [17, 2, 18, 4] },
    { id: 18, name: "Documentary Feature", nominees: [33, 34, 35, 36, 37] },
    { id: 19, name: "International Feature", nominees: [13, 14, 15, 16, 9] },
    { id: 20, name: "Animated Short", nominees: [38, 39, 40, 41, 42] },
    { id: 21, name: "Documentary Short", nominees: [43, 44, 45, 46, 47] },
    { id: 22, name: "Live Action Short", nominees: [48, 49, 50, 51, 52] },
]

const awardsMap = new Map()
awards.forEach(award => {
    award.nominees.forEach(nominee => {
        if (awardsMap.has(nominee)) {
            awardsMap.get(nominee).push(award.name)
        } else {
            awardsMap.set(nominee, [award.name])
        }
    })
})

const totalNominations = awards.reduce((acc, award) => {
    return acc + award.nominees.length
}, 0)

export { movies, awards, awardsMap, totalNominations }
