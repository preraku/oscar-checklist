import requests
import sys


def scrape_oscars(url, year):
    headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Cookie": "cookiebot-consent--necessary=1; CookieConsent={stamp:%27pAmVLYMcQ614PaM+h0x6sU/1TjRsiEUedF1AGTkWLCJPlBiZb/wk+Q==%27%2Cnecessary:true%2Cpreferences:true%2Cstatistics:true%2Cmarketing:true%2Cmethod:%27implied%27%2Cver:1%2Cutc:1738230798731%2Cregion:%27us-06%27}; cookiebot-consent--preferences=1; cookiebot-consent--statistics=1; cookiebot-consent--marketing=1",
        "Host": "www.oscars.org",
        "Pragma": "no-cache",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\""
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
