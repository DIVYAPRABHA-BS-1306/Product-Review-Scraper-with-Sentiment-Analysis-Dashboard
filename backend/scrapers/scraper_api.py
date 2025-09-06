import os
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

SCRAPER_API_KEY = os.getenv("SCRAPER_API_KEY")
if not SCRAPER_API_KEY or SCRAPER_API_KEY == "your_scraper_api_key_here":
    print("⚠️  ScraperAPI key not configured. Using mock data for testing.")
    SCRAPER_API_KEY = None

BASE_URL = "https://api.scraperapi.com"

def get_html(url):
    params = {
        "api_key": SCRAPER_API_KEY,
        "url": url,
        "country_code": "in",
        "render": "false"
    }
    response = requests.get(BASE_URL, params=params)
    response.raise_for_status()
    return response.text

def scrape_amazon_reviews(query, max_products=3):
    """Scrape Amazon reviews by product search query"""
    
    # If no API key, use mock data
    if not SCRAPER_API_KEY:
        from .mock_scraper import scrape_amazon_reviews_mock
        print(f"📝 Using mock data for query: {query}")
        return scrape_amazon_reviews_mock(query, max_products)
    
    try:
        search_url = f"https://www.amazon.in/s?k={query}"
        search_html = get_html(search_url)
        soup = BeautifulSoup(search_html, "html.parser")

        products = soup.select("a.a-link-normal.s-no-outline")[:max_products]
        all_reviews = []

        for p in products:
            product_link = f"https://www.amazon.in{p['href']}"
            product_name = p.get_text(strip=True)

            product_html = get_html(product_link)
            product_soup = BeautifulSoup(product_html, "html.parser")
            reviews = [rev.text.strip() for rev in product_soup.select(".review-text-content span")]

            for review in reviews:
                all_reviews.append({
                    "product": product_name, 
                    "review": review,
                    "title": "Product Review",  # Default title for search-based reviews
                    "rating": None  # Rating extraction can be added later
                })

        return all_reviews
        
    except Exception as e:
        print(f"⚠️  ScraperAPI failed: {e}")
        print("📝 Falling back to mock data...")
        from .mock_scraper import scrape_amazon_reviews_mock
        return scrape_amazon_reviews_mock(query, max_products)
