#!/usr/bin/env python3

import argparse
import json
import logging
import os
import re
import time
from io import BytesIO
from pathlib import Path
from typing import Any, Dict, List, Optional

import requests
from PIL import Image


def sanitize_title_for_file(title: str) -> str:
    # Match the existing repository naming strategy.
    return "".join(ch for ch in title if ch.isalnum() or ch in (" ", "-")).rstrip()


def normalize_title(title: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", title.lower())


def choose_best_tmdb_result(title: str, results: List[Dict[str, Any]]) -> Dict[str, Any]:
    target = normalize_title(title)

    for result in results:
        result_title = str(result.get("title") or result.get("name") or "")
        if normalize_title(result_title) == target:
            return result

    for result in results:
        result_title = str(result.get("title") or result.get("name") or "")
        normalized_result = normalize_title(result_title)
        if normalized_result.startswith(target) or target.startswith(normalized_result):
            return result

    return results[0]


def get_movies_from_oscars_json(input_path: Path) -> List[Dict[str, Any]]:
    with input_path.open("r", encoding="utf-8") as input_file:
        parsed = json.load(input_file)

    if not isinstance(parsed, list) or not parsed:
        raise ValueError(f"Unexpected JSON shape in {input_path}")
    if not isinstance(parsed[0], list):
        raise ValueError(f"Expected first item in {input_path} to be movie list")

    movie_list = parsed[0]
    seen_titles: set[str] = set()
    movies: List[Dict[str, Any]] = []

    for movie in movie_list:
        if not isinstance(movie, dict):
            continue
        title = str(movie.get("title") or "").strip()
        if not title or title in seen_titles:
            continue
        seen_titles.add(title)
        movies.append(
            {
                "id": movie.get("id"),
                "title": title,
            },
        )

    return movies


def search_tmdb_movie(
    session: requests.Session,
    api_key: str,
    title: str,
) -> Optional[Dict[str, Any]]:
    search_url = "https://api.themoviedb.org/3/search/movie"
    params = {
        "api_key": api_key,
        "query": title,
        "language": "en-US",
        "page": 1,
        "include_adult": False,
    }

    try:
        response = session.get(search_url, params=params, timeout=15)
        response.raise_for_status()
    except requests.RequestException as exc:
        logging.warning("TMDB search failed for '%s': %s", title, exc)
        return None

    results = response.json().get("results", [])
    if not results:
        return None

    return choose_best_tmdb_result(title, results)


def get_poster_url(poster_path: Optional[str], size: str) -> Optional[str]:
    if not poster_path:
        return None
    return f"https://image.tmdb.org/t/p/{size}/{poster_path.lstrip('/')}"


def resize_and_save_image(
    session: requests.Session,
    url: str,
    output_path: Path,
    target_width: int,
) -> None:
    response = session.get(url, timeout=30)
    response.raise_for_status()

    image = Image.open(BytesIO(response.content))
    image = image.convert("RGB")

    if target_width > 0 and image.width > target_width:
        target_height = int((target_width / image.width) * image.height)
        image = image.resize((target_width, target_height), Image.Resampling.LANCZOS)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    image.save(output_path, "JPEG", quality=95, optimize=True)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate Oscar movie posters from TMDB for a given year.",
    )
    parser.add_argument("year", type=int, help="Oscar ceremony year (for file naming)")
    parser.add_argument(
        "--api-key",
        default=None,
        help="TMDB API key. Defaults to TMDB_API_KEY environment variable.",
    )
    parser.add_argument(
        "--input",
        default=None,
        help="Path to oscars JSON file. Defaults to scraping/output/oscars_<year>.json",
    )
    parser.add_argument(
        "--output-dir",
        default=None,
        help="Output poster directory. Defaults to public/posters/<year>",
    )
    parser.add_argument(
        "--metadata-output",
        default=None,
        help="Output JSON for fetched TMDB data. Defaults to scraping/output/movies_data_<year>.json",
    )
    parser.add_argument(
        "--poster-size",
        default="w500",
        help="TMDB poster size path segment (w92,w154,w185,w342,w500,w780,original).",
    )
    parser.add_argument(
        "--target-width",
        type=int,
        default=100,
        help="Max final image width. Use 0 to keep original size.",
    )
    parser.add_argument(
        "--delay-seconds",
        type=float,
        default=0.25,
        help="Delay between TMDB requests to avoid hammering the API.",
    )
    return parser.parse_args()


def main() -> int:
    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
    args = parse_args()

    script_dir = Path(__file__).resolve().parent
    repo_root = script_dir.parent

    input_path = Path(args.input) if args.input else script_dir / "output" / f"oscars_{args.year}.json"
    output_dir = Path(args.output_dir) if args.output_dir else repo_root / "public" / "posters" / str(args.year)
    metadata_output = (
        Path(args.metadata_output)
        if args.metadata_output
        else script_dir / "output" / f"movies_data_{args.year}.json"
    )

    api_key = args.api_key or os.getenv("TMDB_API_KEY")
    if not api_key:
        logging.error("Missing TMDB API key. Set TMDB_API_KEY or pass --api-key.")
        return 1

    if not input_path.exists():
        logging.error("Input file not found: %s", input_path)
        return 1

    movies = get_movies_from_oscars_json(input_path)
    if not movies:
        logging.error("No movies found in %s", input_path)
        return 1

    logging.info("Loaded %d movies from %s", len(movies), input_path)
    logging.info("Writing posters to %s", output_dir)

    session = requests.Session()

    found_count = 0
    downloaded_count = 0
    missing_titles: List[str] = []
    metadata: List[Dict[str, Any]] = []

    for movie in movies:
        title = str(movie["title"])
        logging.info("Searching TMDB: %s", title)
        result = search_tmdb_movie(session, api_key, title)

        if result is None:
            missing_titles.append(title)
            continue

        poster_url = get_poster_url(result.get("poster_path"), args.poster_size)
        if not poster_url:
            missing_titles.append(title)
            continue

        found_count += 1
        file_name = f"{sanitize_title_for_file(title)}.jpg"
        destination = output_dir / file_name

        try:
            resize_and_save_image(
                session=session,
                url=poster_url,
                output_path=destination,
                target_width=args.target_width,
            )
            downloaded_count += 1
        except requests.RequestException as exc:
            logging.warning("Download failed for '%s': %s", title, exc)
            missing_titles.append(title)
            time.sleep(args.delay_seconds)
            continue
        except OSError as exc:
            logging.warning("Image processing failed for '%s': %s", title, exc)
            missing_titles.append(title)
            time.sleep(args.delay_seconds)
            continue

        metadata.append(
            {
                "id": movie.get("id"),
                "title": title,
                "file_name": file_name,
                "poster_url": poster_url,
                "tmdb_id": result.get("id"),
                "tmdb_title": result.get("title"),
                "release_date": result.get("release_date"),
            },
        )

        time.sleep(args.delay_seconds)

    metadata_output.parent.mkdir(parents=True, exist_ok=True)
    with metadata_output.open("w", encoding="utf-8") as output_file:
        json.dump(metadata, output_file, indent=4, ensure_ascii=False)

    missing_output = metadata_output.with_name(f"missing_posters_{args.year}.txt")
    missing_output.write_text("\n".join(missing_titles), encoding="utf-8")

    logging.info("TMDB matches found: %d/%d", found_count, len(movies))
    logging.info("Posters downloaded: %d/%d", downloaded_count, len(movies))
    logging.info("Metadata written: %s", metadata_output)
    logging.info("Missing titles file: %s", missing_output)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
