"""
Mock scraper for testing without ScraperAPI
This provides sample data when ScraperAPI is not available
"""

def scrape_amazon_reviews_mock(query, max_products=3):
    """Mock scraper that returns sample review data"""
    
    # Sample review data for testing
    sample_reviews = [
        {
            "product": f"Sample {query.title()} Product 1",
            "review": f"This is a great {query} with excellent quality and performance. I highly recommend it to anyone looking for a reliable product.",
            "title": "Excellent Product!",
            "rating": 5
        },
        {
            "product": f"Sample {query.title()} Product 2", 
            "review": f"The {query} is okay but could be better. It works as expected but has some minor issues that could be improved.",
            "title": "Decent Product",
            "rating": 3
        },
        {
            "product": f"Sample {query.title()} Product 3",
            "review": f"I'm not satisfied with this {query}. The quality is poor and it doesn't meet my expectations. Would not recommend.",
            "title": "Disappointed",
            "rating": 2
        },
        {
            "product": f"Sample {query.title()} Product 4",
            "review": f"Amazing {query}! The features are outstanding and the build quality is excellent. Worth every penny.",
            "title": "Outstanding Quality",
            "rating": 5
        },
        {
            "product": f"Sample {query.title()} Product 5",
            "review": f"This {query} is average. Nothing special but it gets the job done. Good value for money.",
            "title": "Average Product",
            "rating": 3
        }
    ]
    
    # Return a subset based on max_products
    return sample_reviews[:max_products]
