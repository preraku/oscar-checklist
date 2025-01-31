To run scraping, set up a Python virtual environment

1. From the oscar-checklist directory, run `python -m venv scraping`
2. Run `source scraping/bin/activate` (on Mac) or `scraping\Scripts\activate` (on Windows)
3. Navigate to the scraping directory `cd scraping`
4. Install dependencies `pip install -r requirements.txt`
5. Run `python fetch_page.py` to download the HTML page
6. Run `python scrape.py` to scrape the data
7. Check the output data. Best Original Song has to be hand done.
8. Copy the output data to oscar-checklist/src/data.js
