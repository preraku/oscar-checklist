To run scraping, set up a Python virtual environment

1. From the oscar-checklist directory, run `python -m venv scraping`
2. Run `source scraping/bin/activate` (on Mac) or `scraping\Scripts\activate` (on Windows)
3. Install dependencies `pip install -r scraping/requirements.txt`
4. Run `python scraping/fetch_page.py <YEAR>` to download the Oscar ceremony HTML
5. Run `python scraping/scrape.py <YEAR>` to scrape the data into `scraping/output/oscars_<YEAR>.json`
6. Check the output data. Best Original Song has to be hand done.
7. Copy the output data to `src/data.ts`

To generate local poster images for a year (for example 2026):

1. Set your TMDB key: `export TMDB_API_KEY=...`
2. Run `python scraping/generate_posters.py 2026`
3. Posters will be written to `public/posters/2026/`
4. TMDB match metadata is written to `scraping/output/movies_data_2026.json`
5. Titles with no poster match are listed in `scraping/output/missing_posters_2026.txt`
