import sys

import requests


def scrape_oscars(url, year):
    headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:147.0) Gecko/20100101 Firefox/147.0",
    }

    try:
        response = requests.get(url, headers=headers, timeout=5)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Error fetching the page: {e}")
        return None

    with open(f"scraping/output/response_{year}.html", "w", encoding="utf-8") as f:
        f.write(response.text)
    print(f"Response saved to response_{year}.html")


year = int(sys.argv[1])
if not year:
    print("Please provide a year")
    sys.exit(1)

url = f"https://www.oscars.org/oscars/ceremonies/{year}"
scrape_oscars(url, year)
