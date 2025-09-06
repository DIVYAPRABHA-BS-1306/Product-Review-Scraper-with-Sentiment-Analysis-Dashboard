from flask import Flask, request, jsonify
from flask_cors import CORS
from scrapers.scraper_api import scrape_amazon_reviews
from sentiment import analyze_sentiment
from db import get_database
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

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

        # Try to persist to MongoDB (optional)
        stored_info = {"product_id": None, "reviews_inserted": 0}
        try:
            db = get_database()
            products_col = db["products"]
            reviews_col = db["reviews"]

            product_doc = {
                "query": product_query,
                "created_at": datetime.utcnow(),
                "total_reviews": len(reviews_data)
            }
            product_insert = products_col.insert_one(product_doc)
            product_id = product_insert.inserted_id

            review_docs = []
            for r in reviews_data:
                review_docs.append({
                    "product_id": product_id,
                    "product": r.get("product"),
                    "title": r.get("title"),
                    "review": r.get("review"),
                    "rating": r.get("rating"),
                    "sentiment": r.get("sentiment"),
                    "polarity": r.get("polarity"),
                    "created_at": datetime.utcnow()
                })
            if review_docs:
                reviews_col.insert_many(review_docs)
            
            stored_info = {
                "product_id": str(product_id),
                "reviews_inserted": len(review_docs)
            }
        except Exception as db_error:
            print(f"⚠️  Database connection failed: {db_error}")
            print("   Continuing without database storage...")
            stored_info = {
                "product_id": None,
                "reviews_inserted": 0,
                "note": "Database not available - data not stored"
            }

        # Prepare response
        response_data = {
            "product": product_query,
            "query_type": "search",
            "reviews": reviews_data,
            "total_reviews": len(reviews_data),
            "stored": stored_info
        }

        return jsonify(response_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Amazon Review Scraper API is running!",
        "usage": {
            "search_by_name": "/api/reviews?product=iphone"
        }
    })

@app.route("/api/test", methods=["GET"])
def test_endpoint():
    """Test endpoint to verify API is working"""
    return jsonify({
        "status": "success",
        "message": "API is working correctly",
        "endpoints": {
            "reviews": "/api/reviews?product=test",
            "test": "/api/test"
        }
    })

@app.route("/api/products", methods=["GET"])
def get_products():
    """Get all stored products"""
    try:
        db = get_database()
        products_col = db["products"]
        products = list(products_col.find().sort("created_at", -1))
        
        # Convert ObjectId to string for JSON serialization
        for product in products:
            product["_id"] = str(product["_id"])
            if "created_at" in product:
                product["created_at"] = product["created_at"].isoformat()
        
        return jsonify({
            "products": products,
            "count": len(products),
            "status": "success"
        })
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

@app.route("/api/reviews", methods=["GET"])
def get_all_reviews():
    """Get all stored reviews"""
    try:
        db = get_database()
        reviews_col = db["reviews"]
        
        # Get query parameters
        product_id = request.args.get("product_id")
        sentiment = request.args.get("sentiment")
        limit = int(request.args.get("limit", 50))
        
        # Build query
        query = {}
        if product_id:
            from bson import ObjectId
            query["product_id"] = ObjectId(product_id)
        if sentiment:
            query["sentiment"] = sentiment
        
        reviews = list(reviews_col.find(query).sort("created_at", -1).limit(limit))
        
        # Convert ObjectId to string for JSON serialization
        for review in reviews:
            review["_id"] = str(review["_id"])
            review["product_id"] = str(review["product_id"])
            if "created_at" in review:
                review["created_at"] = review["created_at"].isoformat()
        
        return jsonify({
            "reviews": reviews,
            "count": len(reviews),
            "filters": {
                "product_id": product_id,
                "sentiment": sentiment,
                "limit": limit
            },
            "status": "success"
        })
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

@app.route("/api/stats", methods=["GET"])
def get_stats():
    """Get database statistics"""
    try:
        db = get_database()
        products_col = db["products"]
        reviews_col = db["reviews"]
        
        # Basic counts
        product_count = products_col.count_documents({})
        review_count = reviews_col.count_documents({})
        
        # Sentiment analysis
        positive_count = reviews_col.count_documents({"sentiment": "positive"})
        negative_count = reviews_col.count_documents({"sentiment": "negative"})
        neutral_count = reviews_col.count_documents({"sentiment": "neutral"})
        
        # Average polarity
        pipeline = [{"$group": {"_id": None, "avg_polarity": {"$avg": "$polarity"}}}]
        polarity_result = list(reviews_col.aggregate(pipeline))
        avg_polarity = polarity_result[0]["avg_polarity"] if polarity_result else 0
        
        return jsonify({
            "database_stats": {
                "total_products": product_count,
                "total_reviews": review_count,
                "positive_reviews": positive_count,
                "negative_reviews": negative_count,
                "neutral_reviews": neutral_count,
                "average_polarity": round(avg_polarity, 3)
            },
            "sentiment_percentages": {
                "positive": round((positive_count / review_count * 100), 1) if review_count > 0 else 0,
                "negative": round((negative_count / review_count * 100), 1) if review_count > 0 else 0,
                "neutral": round((neutral_count / review_count * 100), 1) if review_count > 0 else 0
            },
            "status": "success"
        })
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
