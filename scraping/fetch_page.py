import requests
from bs4 import BeautifulSoup
import json
import time


def scrape_oscars(url):
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
    # Save the response to a file
    with open("response.html", "w", encoding="utf-8") as f:
        f.write(response.text)

    soup = BeautifulSoup(response.text, "html.parser")

    categories = soup.find_all("div", class_="view-grouping")
    oscars_data = []

    for category in categories:
        category_name_tag = category.find("div", class_="view-grouping-header")
        if not category_name_tag:
            continue
        category_name = category_name_tag.get_text(strip=True)

        nominees = []
        for nominee in category.find_all("div", class_="views-row"):
            nominee_name_tag = nominee.find("div", class_="views-field-title")
            movie_name_tag = nominee.find(
                "div", class_="views-field-field-film-title")

            if not nominee_name_tag:
                continue

            nominee_name = nominee_name_tag.get_text(strip=True)
            movie_name = movie_name_tag.get_text(
                strip=True) if movie_name_tag else ""

            nominees.append({"nominee": nominee_name, "movie": movie_name})

        if nominees:
            oscars_data.append(
                {"category": category_name, "nominees": nominees})

    return oscars_data


url = "https://www.oscars.org/oscars/ceremonies/2025"
oscars_data = scrape_oscars(url)

if oscars_data:
    with open("oscars_202.json", "w", encoding="utf-8") as f:
        json.dump(oscars_data, f, indent=4, ensure_ascii=False)
    print("Oscars data saved to oscars_202.json")

print("Done!")
