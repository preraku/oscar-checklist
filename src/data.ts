import mayDecemberPoster from "../public/posters/2024/may_december.jpg"

const getMovieToNominationsMap = (
    awardsList: Award[],
): Map<number, string[]> => {
    const movieToNomsMap = new Map<number, string[]>()
    awardsList.forEach(award => {
        award.nominees.forEach(nominee => {
            const nominations = movieToNomsMap.get(nominee)
            if (nominations) {
                nominations.push(award.name)
            } else {
                movieToNomsMap.set(nominee, [award.name])
            }
        })
    })

    return movieToNomsMap
}

const getTotalNominations = (awardsList: Award[]) => {
    return awardsList.reduce((acc, award) => {
        return acc + award.nominees.length
    }, 0)
}

const POSTERS_URL = `${import.meta.env.BASE_URL}posters`

export type Movie = {
    id: number
    title: string
    imdb?: string // Unused
    watched?: boolean // Unused
    poster: string | null
    "Actor in a Leading Role"?: string
    "Actor in a Supporting Role"?: string
    "Actress in a Leading Role"?: string
    "Actress in a Supporting Role"?: string
    "Animated Feature Film"?: string
    "Animated Short Film"?: string
    Cinematography?: string
    "Costume Design"?: string
    Directing?: string
    "Documentary Feature Film"?: string
    "Documentary Short Film"?: string
    "Film Editing"?: string
    "International Feature Film"?: string
    "Makeup and Hairstyling"?: string
    "Music (Original Score)"?: string
    "Production Design"?: string
    "Live Action Short Film"?: string
    Sound?: string
    "Visual Effects"?: string
    "Writing (Adapted Screenplay)"?: string
    "Writing (Original Screenplay)"?: string
    "Music (Original Song)*"?: string
    "Best Director"?: string
    "Best Actor"?: string
    "Best Actress"?: string
    "Best Supporting Actor"?: string
    "Best Supporting Actress"?: string
    "Original Screenplay"?: string
    "Original Song*"?: string
    "International Feature"?: string
}

type Award = {
    id: number
    name: string
    nominees: number[]
}

const movies2024: Movie[] = [
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
        "Original Song*": "I'm Just Ken & What Was I Made For?*",
        imdb: "https://www.imdb.com/title/tt23561238",
        watched: false,
        poster: "https://m.media-amazon.com/images/I/71BgdzmFDAL._AC_UF894,1000_QL80_.jpg",
    },
    {
        id: 3,
        title: "The Holdovers",
        "Best Actor": "Paul Giamatti",
        "Best Supporting Actress": "Da'Vine Joy Randolph",
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
        poster: "http://www.impawards.com/2023/posters/rustin.jpg",
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
        poster: "https://i.ebayimg.com/images/g/HQkAAOSwXxRlaIAA/s-l1200.webp",
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
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://m.media-amazon.com/images/M/MV5BOWI1MzYxYjEtMzkwNS00ZGU4LWFjZGUtMDM3OGY3MTM5MGY4XkEyXkFqcGdeQXVyMTUzOTczNzYx._V1_.jpg",
    },
    {
        id: 19,
        title: "May December",
        imdb: "https://www.imdb.com/title/tt23561250",
        watched: false,
        poster: mayDecemberPoster,
    },
    {
        id: 20,
        title: "The Boy and the Heron",
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
        poster: "http://www.impawards.com/intl/misc/2023/posters/el_conde_ver2.jpg",
    },
    {
        id: 27,
        title: "Golda",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://m.media-amazon.com/images/M/MV5BNjJlMGUwNmEtYjQ1YS00MzgxLWJhMTUtMTU2ZWEwZmYxMDZmXkEyXkFqcGdeQXVyMjMyMzI4MzY@._V1_.jpg",
    },
    {
        id: 28,
        title: "The Creator",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://i.etsystatic.com/27062086/r/il/4397ff/5332652257/il_570xN.5332652257_p2fd.jpg",
    },
    {
        id: 29,
        title: "Mission Impossible — Dead Reckoning Part One",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://i.ebayimg.com/images/g/N0AAAOSwAwtklta6/s-l1200.webp",
    },
    {
        id: 30,
        title: "Godzilla Minus One",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://upload.wikimedia.org/wikipedia/en/e/e0/Godzilla_Minus_One_Poster.jpeg",
    },
    {
        id: 31,
        title: "Guardians of the Galaxy Vol. 3",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://preview.redd.it/made-a-gotg3-poster-recently-wanted-a-more-retro-style-v0-84sh42npn8za1.png?width=640&crop=smart&auto=webp&s=af1f132fe69b62fde6e58f1b1f229d91b4ba0401",
    },
    {
        id: 32,
        title: "Indiana Jones and the Dial of Destiny",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://media.wdwnt.com/2022/12/Indiana-Jones-5.jpg",
    },
    {
        id: 33,
        title: "Bobi Wine: The People's President",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://cdn.cinematerial.com/p/297x/xsk3nxgo/bobi-wine-ghetto-president-british-movie-poster-md.jpg?v=1691359278",
    },
    {
        id: 34,
        title: "The Eternal Memory",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://s3.amazonaws.com/nightjarprod/content/uploads/sites/130/2023/06/29184206/eternal-memory-poster.jpeg",
    },
    {
        id: 35,
        title: "Four Daughters",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://www.marinarts.org/wp-content/uploads/sites/www.marinarts.org/images/2023/11/Four-Daughters.jpg",
    },
    {
        id: 36,
        title: "To Kill a Tiger",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://d3lzcn6mbbadaf.cloudfront.net/media/details/ANI-20240124031415.jpg",
    },
    {
        id: 37,
        title: "20 Days in Mariupol",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://upload.wikimedia.org/wikipedia/en/thumb/b/be/20_Days_in_Mariupol_poster.jpg/220px-20_Days_in_Mariupol_poster.jpg",
    },
    {
        id: 38,
        title: "Letter to a Pig",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://upload.wikimedia.org/wikipedia/en/thumb/2/24/Letter_to_a_Pig_Film_Poster.jpg/220px-Letter_to_a_Pig_Film_Poster.jpg",
    },
    {
        id: 39,
        title: "Ninety-Five Senses",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: "https://www.indieactivity.com/wp-content/uploads/2023/10/ninety-five-senses.jpg",
    },
    {
        id: 40,
        title: "Our Uniform",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: null,
    },
    {
        id: 41,
        title: "Pachyderme",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: null,
    },
    {
        id: 42,
        title: "War Is Over! Inspired by the Music of John & Yoko",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: null,
    },
    {
        id: 43,
        title: "The ABCs of Book Banning",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: null,
    },
    {
        id: 44,
        title: "The Barber of Little Rock",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: null,
    },
    {
        id: 45,
        title: "Island in Between",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: null,
    },
    {
        id: 46,
        title: "The Last Repair Shop",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: null,
    },
    {
        id: 47,
        title: "Nai Nai & Wai Po",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: null,
    },
    {
        id: 48,
        title: "The After",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: null,
    },
    {
        id: 49,
        title: "Invincible",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: null,
    },
    {
        id: 50,
        title: "Knight of Fortune",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: null,
    },
    {
        id: 51,
        title: "Red, White and Blue",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: null,
    },
    {
        id: 52,
        title: "The Wonderful Story of Henry Sugar",
        imdb: "https://www.imdb.com/title/tt23561249",
        watched: false,
        poster: null,
    },
]

const awards2024: Award[] = [
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

const POSTERS_URL_2025 = `${POSTERS_URL}/2025`

const movies2025: Movie[] = [
    {
        id: 0,
        title: "The Brutalist",
        poster: `${POSTERS_URL_2025}/The Brutalist.jpg`,
        "Actor in a Leading Role": "Adrien Brody",
        "Actor in a Supporting Role": "Guy Pearce",
        "Actress in a Supporting Role": "Felicity Jones",
        Cinematography: "Lol Crawley",
        Directing: "Brady Corbet",
        "Film Editing": "David Jancso",
        "Music (Original Score)": "Daniel Blumberg",
        "Production Design":
            "Production Design: Judy Becker; Set Decoration: Patricia Cuccia",
        "Writing (Original Screenplay)":
            "Written by Brady Corbet, Mona Fastvold",
    },
    {
        id: 1,
        title: "A Complete Unknown",
        poster: `${POSTERS_URL_2025}/A Complete Unknown.jpg`,
        "Actor in a Leading Role": "Timothée Chalamet",
        "Actor in a Supporting Role": "Edward Norton",
        "Actress in a Supporting Role": "Monica Barbaro",
        "Costume Design": "Arianne Phillips",
        Directing: "James Mangold",
        Sound: "Tod A. Maitland, Donald Sylvester, Ted Caplan, Paul Massey and David Giammarco",
        "Writing (Adapted Screenplay)":
            "Screenplay by James Mangold and Jay Cocks",
    },
    {
        id: 2,
        title: "Sing Sing",
        poster: `${POSTERS_URL_2025}/Sing Sing.jpg`,
        "Actor in a Leading Role": "Colman Domingo",
        "Music (Original Song)*": "Like a Bird",
        "Writing (Adapted Screenplay)":
            'Screenplay by Clint Bentley, Greg Kwedar; Story by Clint Bentley, Greg Kwedar, Clarence Maclin, John "Divine G" Whitfield',
    },
    {
        id: 3,
        title: "Conclave",
        poster: `${POSTERS_URL_2025}/Conclave.jpg`,
        "Actor in a Leading Role": "Ralph Fiennes",
        "Actress in a Supporting Role": "Isabella Rossellini",
        "Costume Design": "Lisy Christl",
        "Film Editing": "Nick Emerson",
        "Music (Original Score)": "Volker Bertelmann",
        "Production Design":
            "Production Design: Suzie Davies; Set Decoration: Cynthia Sleiter",
        "Writing (Adapted Screenplay)": "Screenplay by Peter Straughan",
    },
    {
        id: 4,
        title: "The Apprentice",
        poster: `${POSTERS_URL_2025}/The Apprentice.jpg`,
        "Actor in a Leading Role": "Sebastian Stan",
        "Actor in a Supporting Role": "Jeremy Strong",
    },
    {
        id: 5,
        title: "Anora",
        poster: `${POSTERS_URL_2025}/Anora.jpg`,
        "Actor in a Supporting Role": "Yura Borisov",
        "Actress in a Leading Role": "Mikey Madison",
        Directing: "Sean Baker",
        "Film Editing": "Sean Baker",
        "Writing (Original Screenplay)": "Written by Sean Baker",
    },
    {
        id: 6,
        title: "A Real Pain",
        poster: `${POSTERS_URL_2025}/A Real Pain.jpg`,
        "Actor in a Supporting Role": "Kieran Culkin",
        "Writing (Original Screenplay)": "Written by Jesse Eisenberg",
    },
    {
        id: 7,
        title: "Wicked",
        poster: `${POSTERS_URL_2025}/Wicked.jpg`,
        "Actress in a Leading Role": "Cynthia Erivo",
        "Actress in a Supporting Role": "Ariana Grande",
        "Costume Design": "Paul Tazewell",
        "Film Editing": "Myron Kerstein",
        "Makeup and Hairstyling": "Frances Hannon, Laura Blount and Sarah Nuth",
        "Music (Original Score)": "John Powell and Stephen Schwartz",
        "Production Design":
            "Production Design: Nathan Crowley; Set Decoration: Lee Sandales",
        Sound: "Simon Hayes, Nancy Nugent Title, Jack Dolman, Andy Nelson and John Marquis",
        "Visual Effects":
            "Pablo Helman, Jonathan Fawkner, David Shirk and Paul Corbould",
    },
    {
        id: 8,
        title: "Emilia Pérez",
        poster: `${POSTERS_URL_2025}/Emilia Pérez.jpg`,
        "Actress in a Leading Role": "Karla Sofía Gascón",
        "Actress in a Supporting Role": "Zoe Saldaña",
        Cinematography: "Paul Guilhaume",
        Directing: "Jacques Audiard",
        "Film Editing": "Juliette Welfling",
        "International Feature Film": "France",
        "Makeup and Hairstyling":
            "Julia Floch Carbonel, Emmanuel Janvier and Jean-Christophe Spadaccini",
        "Music (Original Score)": "Clément Ducol and Camille",
        "Music (Original Song)*": "El Mal, Mi Camino*",
        Sound: "Erwan Kerzanet, Aymeric Devoldère, Maxence Dussère, Cyril Holtz and Niels Barletta",
        "Writing (Adapted Screenplay)":
            "Screenplay by Jacques Audiard; In collaboration with Thomas Bidegain, Léa Mysius and Nicolas Livecchi",
    },
    {
        id: 9,
        title: "The Substance",
        poster: `${POSTERS_URL_2025}/The Substance.jpg`,
        "Actress in a Leading Role": "Demi Moore",
        Directing: "Coralie Fargeat",
        "Makeup and Hairstyling":
            "Pierre-Olivier Persin, Stéphanie Guillon and Marilyne Scarselli",
        "Writing (Original Screenplay)": "Written by Coralie Fargeat",
    },
    {
        id: 10,
        title: "I'm Still Here",
        poster: `${POSTERS_URL_2025}/Im Still Here.jpg`,
        "Actress in a Leading Role": "Fernanda Torres",
        "International Feature Film": "Brazil",
    },
    {
        id: 11,
        title: "Flow",
        poster: `${POSTERS_URL_2025}/Flow.jpg`,
        "Animated Feature Film":
            "Gints Zilbalodis, Matīss Kaža, Ron Dyens and Gregory Zalcman",
        "International Feature Film": "Latvia",
    },
    {
        id: 12,
        title: "Inside Out 2",
        poster: `${POSTERS_URL_2025}/Inside Out 2.jpg`,
        "Animated Feature Film": "Kelsey Mann and Mark Nielsen",
    },
    {
        id: 13,
        title: "Memoir of a Snail",
        poster: `${POSTERS_URL_2025}/Memoir of a Snail.jpg`,
        "Animated Feature Film": "Adam Elliot and Liz Kearney",
    },
    {
        id: 14,
        title: "Wallace & Gromit: Vengeance Most Fowl",
        poster: `${POSTERS_URL_2025}/Wallace  Gromit Vengeance Most Fowl.jpg`,
        "Animated Feature Film":
            "Nick Park, Merlin Crossingham and Richard Beek",
    },
    {
        id: 15,
        title: "The Wild Robot",
        poster: `${POSTERS_URL_2025}/The Wild Robot.jpg`,
        "Animated Feature Film": "Chris Sanders and Jeff Hermann",
        "Music (Original Score)": "Kris Bowers",
        Sound: "Randy Thom, Brian Chumney, Gary A. Rizzo and Leff Lefferts",
    },
    {
        id: 16,
        title: "Beautiful Men",
        poster: `${POSTERS_URL_2025}/Beautiful Men.jpg`,
        "Animated Short Film": "Nicolas Keppens and Brecht Van Elslande",
    },
    {
        id: 17,
        title: "In the Shadow of the Cypress",
        poster: `${POSTERS_URL_2025}/In the Shadow of the Cypress.jpg`,
        "Animated Short Film": "Shirin Sohani and Hossein Molayemi",
    },
    {
        id: 18,
        title: "Magic Candies",
        poster: `${POSTERS_URL_2025}/Magic Candies.jpg`,
        "Animated Short Film": "Daisuke Nishio and Takashi Washio",
    },
    {
        id: 19,
        title: "Wander to Wonder",
        poster: `${POSTERS_URL_2025}/Wander to Wonder.jpg`,
        "Animated Short Film": "Nina Gantz and Stienette Bosklopper",
    },
    {
        id: 20,
        title: "Yuck!",
        poster: `${POSTERS_URL_2025}/Yuck.jpg`,
        "Animated Short Film": "Loïc Espuche and Juliette Marquet",
    },
    {
        id: 21,
        title: "Dune: Part Two",
        poster: `${POSTERS_URL_2025}/Dune Part Two.jpg`,
        Cinematography: "Greig Fraser",
        "Production Design":
            "Production Design: Patrice Vermette; Set Decoration: Shane Vieau",
        Sound: "Gareth John, Richard King, Ron Bartlett and Doug Hemphill",
        "Visual Effects":
            "Paul Lambert, Stephen James, Rhys Salcombe and Gerd Nefzer",
    },
    {
        id: 22,
        title: "Maria",
        poster: `${POSTERS_URL_2025}/Maria.jpg`,
        Cinematography: "Ed Lachman",
    },
    {
        id: 23,
        title: "Nosferatu",
        poster: `${POSTERS_URL_2025}/Nosferatu.jpg`,
        Cinematography: "Jarin Blaschke",
        "Costume Design": "Linda Muir",
        "Makeup and Hairstyling":
            "David White, Traci Loader and Suzanne Stokes-Munton",
        "Production Design":
            "Production Design: Craig Lathrop; Set Decoration: Beatrice Brentnerová",
    },
    {
        id: 24,
        title: "Gladiator II",
        poster: `${POSTERS_URL_2025}/Gladiator II.jpg`,
        "Costume Design": "Janty Yates and Dave Crossman",
    },
    {
        id: 25,
        title: "Black Box Diaries",
        poster: `${POSTERS_URL_2025}/Black Box Diaries.jpg`,
        "Documentary Feature Film": "Shiori Ito, Eric Nyari and Hanna Aqvilin",
    },
    {
        id: 26,
        title: "No Other Land",
        poster: `${POSTERS_URL_2025}/No Other Land.jpg`,
        "Documentary Feature Film":
            "Basel Adra, Rachel Szor, Hamdan Ballal and Yuval Abraham",
    },
    {
        id: 27,
        title: "Porcelain War",
        poster: `${POSTERS_URL_2025}/Porcelain War.jpg`,
        "Documentary Feature Film":
            "Brendan Bellomo, Slava Leontyev, Aniela Sidorska and Paula DuPre' Pesmen",
    },
    {
        id: 28,
        title: "Soundtrack to a Coup d'Etat",
        poster: `${POSTERS_URL_2025}/Soundtrack to a Coup dEtat.jpg`,
        "Documentary Feature Film":
            "Johan Grimonprez, Daan Milius and Rémi Grellety",
    },
    {
        id: 29,
        title: "Sugarcane",
        poster: `${POSTERS_URL_2025}/Sugarcane.jpg`,
        "Documentary Feature Film": "Nominees to be determined",
    },
    {
        id: 30,
        title: "Death by Numbers",
        poster: `${POSTERS_URL_2025}/Death by Numbers.jpg`,
        "Documentary Short Film": "Kim A. Snyder and Janique L. Robillard",
    },
    {
        id: 31,
        title: "I Am Ready, Warden",
        poster: `${POSTERS_URL_2025}/I Am Ready Warden.jpg`,
        "Documentary Short Film": "Smriti Mundhra and Maya Gnyp",
    },
    {
        id: 32,
        title: "Incident",
        poster: `${POSTERS_URL_2025}/Incident.jpg`,
        "Documentary Short Film": "Bill Morrison and Jamie Kalven",
    },
    {
        id: 33,
        title: "Instruments of a Beating Heart",
        poster: `${POSTERS_URL_2025}/Instruments of a Beating Heart.jpg`,
        "Documentary Short Film": "Ema Ryan Yamazaki and Eric Nyari",
    },
    {
        id: 34,
        title: "The Only Girl in the Orchestra",
        poster: `${POSTERS_URL_2025}/The Only Girl in the Orchestra.jpg`,
        "Documentary Short Film": "Molly O'Brien and Lisa Remington",
    },
    {
        id: 35,
        title: "The Girl with the Needle",
        poster: `${POSTERS_URL_2025}/The Girl with the Needle.jpg`,
        "International Feature Film": "Denmark",
    },
    {
        id: 36,
        title: "The Seed of the Sacred Fig",
        poster: `${POSTERS_URL_2025}/The Seed of the Sacred Fig.jpg`,
        "International Feature Film": "Germany",
    },
    {
        id: 37,
        title: "A Different Man",
        poster: `${POSTERS_URL_2025}/A Different Man.jpg`,
        "Makeup and Hairstyling":
            "Mike Marino, David Presto and Crystal Jurado",
    },
    {
        id: 38,
        title: "Nickel Boys",
        poster: `${POSTERS_URL_2025}/Nickel Boys.jpg`,
        "Writing (Adapted Screenplay)":
            "Screenplay by RaMell Ross & Joslyn Barnes",
    },
    {
        id: 39,
        title: "A Lien",
        poster: `${POSTERS_URL_2025}/A Lien.jpg`,
        "Live Action Short Film": "Sam Cutler-Kreutz and David Cutler-Kreutz",
    },
    {
        id: 40,
        title: "Anuja",
        poster: `${POSTERS_URL_2025}/Anuja.jpg`,
        "Live Action Short Film": "Adam J. Graves and Suchitra Mattai",
    },
    {
        id: 41,
        title: "I'm Not a Robot",
        poster: `${POSTERS_URL_2025}/Im Not a Robot.jpg`,
        "Live Action Short Film": "Victoria Warmerdam and Trent",
    },
    {
        id: 42,
        title: "The Last Ranger",
        poster: `${POSTERS_URL_2025}/The Last Ranger.jpg`,
        "Live Action Short Film": "Cindy Lee and Darwin Shaw",
    },
    {
        id: 43,
        title: "The Man Who Could Not Remain Silent",
        poster: `${POSTERS_URL_2025}/The Man Who Could Not Remain Silent.jpg`,
        "Live Action Short Film": "Nebojša Slijepčević and Danijel Pek",
    },
    {
        id: 44,
        title: "Alien: Romulus",
        poster: `${POSTERS_URL_2025}/Alien Romulus.jpg`,
        "Visual Effects":
            "Eric Barba, Nelson Sepulveda-Fauser, Daniel Macarin and Shane Mahan",
    },
    {
        id: 45,
        title: "Better Man",
        poster: `${POSTERS_URL_2025}/Better Man.jpg`,
        "Visual Effects":
            "Luke Millar, David Clayton, Keith Herft and Peter Stubbs",
    },
    {
        id: 46,
        title: "Kingdom of the Planet of the Apes",
        poster: `${POSTERS_URL_2025}/Kingdom of the Planet of the Apes.jpg`,
        "Visual Effects":
            "Erik Winquist, Stephen Unterfranz, Paul Story and Rodney Burke",
    },
    {
        id: 47,
        title: "September 5",
        poster: `${POSTERS_URL_2025}/September 5.jpg`,
        "Writing (Original Screenplay)":
            "Written by Moritz Binder, Tim Fehlbaum; Co-Written by Alex David",
    },
    {
        id: 48,
        title: "Elton John: Never Too Late",
        poster: `${POSTERS_URL_2025}/Elton John Never Too Late.jpg`,
        "Music (Original Song)*":
            "Never Too Late - Music and Lyric by Elton John, Brandi Carlile, Andrew Watt and Bernie Taupin",
    },
    {
        id: 49,
        title: "The Six Triple Eight",
        poster: `${POSTERS_URL_2025}/The Six Triple Eight.jpg`,
        "Music (Original Song)*":
            "The Journey - Music and Lyric by Diane Warren",
    },
]

const awards2025: Award[] = [
    {
        id: 0,
        name: "Best Picture",
        nominees: [5, 0, 1, 3, 21, 8, 10, 38, 9, 7],
    },
    {
        id: 1,
        name: "Actor in a Leading Role",
        nominees: [0, 1, 2, 3, 4],
    },
    {
        id: 2,
        name: "Actor in a Supporting Role",
        nominees: [5, 6, 1, 0, 4],
    },
    {
        id: 3,
        name: "Actress in a Leading Role",
        nominees: [7, 8, 5, 9, 10],
    },
    {
        id: 4,
        name: "Actress in a Supporting Role",
        nominees: [1, 7, 0, 3, 8],
    },
    {
        id: 5,
        name: "Animated Feature Film",
        nominees: [11, 12, 13, 14, 15],
    },
    {
        id: 6,
        name: "Animated Short Film",
        nominees: [16, 17, 18, 19, 20],
    },
    {
        id: 7,
        name: "Cinematography",
        nominees: [0, 21, 8, 22, 23],
    },
    {
        id: 8,
        name: "Costume Design",
        nominees: [1, 3, 24, 23, 7],
    },
    {
        id: 9,
        name: "Directing",
        nominees: [5, 0, 1, 8, 9],
    },
    {
        id: 10,
        name: "Documentary Feature Film",
        nominees: [25, 26, 27, 28, 29],
    },
    {
        id: 11,
        name: "Documentary Short Film",
        nominees: [30, 31, 32, 33, 34],
    },
    {
        id: 12,
        name: "Film Editing",
        nominees: [5, 0, 3, 8, 7],
    },
    {
        id: 13,
        name: "International Feature Film",
        nominees: [10, 35, 8, 36, 11],
    },
    {
        id: 14,
        name: "Makeup and Hairstyling",
        nominees: [37, 8, 23, 9, 7],
    },
    {
        id: 15,
        name: "Music (Original Score)",
        nominees: [0, 3, 8, 7, 15],
    },
    {
        id: 16,
        name: "Production Design",
        nominees: [0, 3, 21, 23, 7],
    },
    {
        id: 17,
        name: "Live Action Short Film",
        nominees: [39, 40, 41, 42, 43],
    },
    {
        id: 18,
        name: "Sound",
        nominees: [1, 21, 8, 7, 15],
    },
    {
        id: 19,
        name: "Visual Effects",
        nominees: [44, 45, 21, 46, 7],
    },
    {
        id: 20,
        name: "Writing (Adapted Screenplay)",
        nominees: [1, 3, 8, 38, 2],
    },
    {
        id: 21,
        name: "Writing (Original Screenplay)",
        nominees: [5, 0, 6, 47, 9],
    },
    {
        id: 22,
        name: "Music (Original Song)*",
        nominees: [8, 48, 2, 49],
    },
]

type AnnualFilmData = {
    movies: Movie[]
    awards: Award[]
    movieToNomsMap: Map<number, string[]>
    totalNominations: number
}

const filmData: Record<string, AnnualFilmData> = {
    2024: {
        movies: movies2024,
        awards: awards2024,
        movieToNomsMap: getMovieToNominationsMap(awards2024),
        totalNominations: getTotalNominations(awards2024),
    },
    2025: {
        movies: movies2025,
        awards: awards2025,
        movieToNomsMap: getMovieToNominationsMap(awards2025),
        totalNominations: getTotalNominations(awards2025),
    },
}

export { filmData }
