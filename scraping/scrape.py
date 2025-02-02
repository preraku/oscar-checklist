from bs4 import BeautifulSoup
import json
import sys


def clean_text(text):
    # Fix text like the following:
    # e.g. "Instruments of a Beating\n                                                    Heart",
    return ' '.join(text.split())


# Specific awards are flipped, so I have flip them back.
awards_to_flip = set(
    [
        # "Actor in a Leading Role",
        # "Actress in a Leading Role",
        # "Actor in a Supporting Role",
        # "Actress in a Supporting Role",
        "International Feature Film",
    ]
)

# The following award is too tough to scrape, so it must be hand done.
# Music (Original Song)
awards_to_ignore = set(
    [
        "Music (Original Song)",
    ]
)

# For best picture, I do not care about the nominee, just the film.
# I want the first element of the awards list to be "Best Picture".
# I do not want to add the nominee to the movie data.


def scrape_oscars(year):
    with open(f"scraping/output/response_{year}.html", "r", encoding="utf-8") as f:
        response = f.read()

    soup = BeautifulSoup(response, "html.parser")

    award_categories = soup.find_all(
        'div', class_='paragraph--type--award-category')

    movie_name_to_id = {}
    award_name_to_award_data = {}
    movie_id_to_movie_data = {}

    # Seed Best Picture
    award_name_to_award_data["Best Picture"] = {
        'id': 0,
        'name': "Best Picture",
        'nominees': [],
    }

    for category in award_categories:
        category_name = clean_text(category.find(
            'div', class_='field--name-field-award-category-oscars').get_text(strip=True))
        if category_name in awards_to_ignore:
            continue

        if category_name not in award_name_to_award_data:
            award_name_to_award_data[category_name] = {
                'id': len(award_name_to_award_data),
                'name': category_name,
                'nominees': [],
            }

        nominees = category.find_all(
            'div', class_='paragraph--type--award-honoree')

        for nominee in nominees:
            nominee_div = nominee.find(
                'div', class_='field--name-field-award-entities').find('div', class_='field__item')

            nominee_name = clean_text(nominee_div.get_text(strip=True))
            film_name = clean_text(nominee.find_all('div', class_='field--name-field-award-film')[
                0].get_text(strip=True))

            if category_name in awards_to_flip:
                film_name, nominee_name = nominee_name, film_name
            if film_name not in movie_name_to_id:
                movie_name_to_id[film_name] = len(movie_name_to_id)
                film_id = movie_name_to_id[film_name]
                movie_id_to_movie_data[film_id] = {
                    'id': film_id,
                    'title': film_name,
                    'poster': '',
                }
            else:
                film_id = movie_name_to_id[film_name]

            movie_data = movie_id_to_movie_data[film_id]

            if category_name != "Best Picture":
                movie_data[category_name] = nominee_name
            award_name_to_award_data[category_name]['nominees'].append(film_id)

    movie_list = []
    for movie_data in movie_id_to_movie_data.values():
        movie_list.append(movie_data)

    awards_list = []
    for award_data in award_name_to_award_data.values():
        awards_list.append(award_data)

    return movie_list, awards_list


year = int(sys.argv[1])
data = scrape_oscars(year)
with open(f"scraping/output/oscars_{year}.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=4, ensure_ascii=False)
print(f"""Oscars data saved to scraping/output/oscars_{year}.json
You will have to manually add {awards_to_ignore}.
Please also check the nominees for Best Picture.
      """)
