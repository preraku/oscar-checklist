import requests
from typing import Dict, Optional, List
import os
from urllib.parse import quote
import json
import time

class TMDBPosterFetcher:
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the TMDB poster fetcher with an API key.
        
        Args:
            api_key: TMDB API key. If not provided, will look for TMDB_API_KEY environment variable.
        """
        self.api_key = api_key or os.getenv('TMDB_API_KEY')
        if not self.api_key:
            raise ValueError("API key must be provided either directly or through TMDB_API_KEY environment variable")
        
        self.base_url = "https://api.themoviedb.org/3"
        self.movie_cache: Dict[str, Dict] = {}

    def search_movie(self, title: str) -> Optional[Dict]:
        """
        Search for a movie by title and return its details.
        
        Args:
            title: Movie title to search for
            
        Returns:
            Dictionary containing movie details if found, None if not found
        """
        if title in self.movie_cache:
            return self.movie_cache[title]

        search_url = f"{self.base_url}/search/movie"
        params = {
            'api_key': self.api_key,
            'query': quote(title),
            'language': 'en-US',
            'page': 1,
            'include_adult': False
        }

        try:
            response = requests.get(search_url, params=params)
            response.raise_for_status()
            results = response.json().get('results', [])
            
            if not results:
                print(f"No results found for movie: {title}")
                return None
            
            movie = results[0]
            poster_path = movie.get('poster_path')
            movie_details = {
                'title': title,
                'poster_url': self.get_poster_url(poster_path) if poster_path else None,
                'tmdb_id': movie.get('id'),
                'release_date': movie.get('release_date'),
                'overview': movie.get('overview')
            }
            
            self.movie_cache[title] = movie_details
            return movie_details
            
        except requests.exceptions.RequestException as e:
            print(f"Error searching for movie {title}: {str(e)}")
            return None

    def get_poster_url(self, poster_path: str, size: str = 'original') -> str:
        """
        Get the full URL for a movie poster.
        
        Args:
            poster_path: Poster path from TMDB API
            size: Size of poster. Options: 'w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'
        """
        if not poster_path:
            return None
        return f"https://image.tmdb.org/t/p/{size}/{poster_path.lstrip('/')}"

    def process_movie_titles(self, titles: List[str], output_file: str):
        """
        Process a list of movie titles and save the data to JSON.
        
        Args:
            titles: List of movie titles
            output_file: Path to save JSON data
        """
        movies_data = []
        
        for title in titles:
            print(f"Processing: {title}")
            movie_details = self.search_movie(title.strip())
            
            if movie_details:
                movies_data.append(movie_details)
                print(f"Found details for: {title}")
            else:
                print(f"No details found for: {title}")
            
            time.sleep(0.25)  # Respect API rate limits
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(movies_data, f, indent=4, ensure_ascii=False)
        
        print(f"\nMovie data saved to: {output_file}")

# Get API key from environment variable
api_key = os.getenv('TMDB_API_KEY')
if not api_key:
    print("Please set TMDB_API_KEY environment variable")
    exit(1)

# Initialize fetcher
fetcher = TMDBPosterFetcher(api_key)

# Read movie titles from file
try:
    with open('movie_titles.txt', 'r', encoding='utf-8') as f:
        movie_titles = [line.strip() for line in f if line.strip()]
    print(f"Loaded {len(movie_titles)} movie titles from movie_titles.txt")
except FileNotFoundError:
    print("Error: movie_titles.txt not found in the current directory")
    exit(1)
except Exception as e:
    print(f"Error reading movie_titles.txt: {str(e)}")
    exit(1)

# Process the movie titles and save to JSON
output_file = "movies_data.json"
fetcher.process_movie_titles(movie_titles, output_file)

print("Done!")