from flask import Flask, request, jsonify
from flask_cors import CORS
from scrapers.scraper_api import scrape_amazon_reviews
from sentiment import analyze_sentiment
from file_storage import FileStorage
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Initialize file storage
file_storage = FileStorage()

@app.route("/api/reviews", methods=["GET"])
def get_reviews():
    """
    API Endpoint:
    /api/reviews?product=<product_name>
    Example: /api/reviews?product=iphone
    """
    product_query = request.args.get("product", "").strip()

    if not product_query:
        return jsonify({"error": "Missing 'product' query parameter"}), 400

    try:
        reviews_data = scrape_amazon_reviews(product_query, max_products=3)

        if not reviews_data:
            return jsonify({"error": f"No reviews found for '{product_query}'. Try a different search term."}), 404

        # Add sentiment analysis
        for review in reviews_data:
            sentiment_result = analyze_sentiment(review["review"])
            review["sentiment"] = sentiment_result["label"]
            review["polarity"] = sentiment_result["polarity"]

        # Save to file storage
        product_doc = {
            "query": product_query,
            "total_reviews": len(reviews_data)
        }
        
        product_id = file_storage.save_product(product_doc)
        reviews_saved = file_storage.save_reviews(reviews_data, product_id)

        # Prepare response
        response_data = {
            "product": product_query,
            "query_type": "search",
            "reviews": reviews_data,
            "total_reviews": len(reviews_data),
            "stored": {
                "product_id": product_id,
                "reviews_inserted": reviews_saved,
                "storage_type": "JSON Files",
                "storage_location": "data/"
            }
        }

        return jsonify(response_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/stats", methods=["GET"])
def get_stats():
    """Get storage statistics"""
    try:
        stats = file_storage.get_stats()
        return jsonify(stats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/products", methods=["GET"])
def get_products():
    """Get all stored products"""
    try:
        products = file_storage.get_products()
        return jsonify({"products": products, "count": len(products)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/reviews/<int:product_id>", methods=["GET"])
def get_reviews_by_product(product_id):
    """Get reviews for a specific product"""
    try:
        reviews = file_storage.get_reviews(product_id)
        return jsonify({"reviews": reviews, "count": len(reviews), "product_id": product_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Amazon Review Scraper API with File Storage",
        "usage": {
            "search_by_name": "/api/reviews?product=iphone",
            "get_stats": "/api/stats",
            "get_products": "/api/products",
            "get_reviews": "/api/reviews/{product_id}"
        },
        "storage": "JSON Files in data/ directory"
    })

@app.route("/api/test", methods=["GET"])
def test_endpoint():
    """Test endpoint to verify API is working"""
    return jsonify({
        "status": "success",
        "message": "API is working correctly",
        "storage_type": "JSON Files",
        "endpoints": {
            "reviews": "/api/reviews?product=test",
            "stats": "/api/stats",
            "products": "/api/products",
            "test": "/api/test"
        }
    })

if __name__ == "__main__":
    print("🚀 Starting Product Scraper with File Storage...")
    print("📁 Data will be stored in: data/ directory")
    print("🌐 API available at: http://localhost:5000")
    app.run(debug=True, host="0.0.0.0", port=5000)
