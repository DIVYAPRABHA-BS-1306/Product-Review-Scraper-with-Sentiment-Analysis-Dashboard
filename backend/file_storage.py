import json
import os
from datetime import datetime
from pathlib import Path

class FileStorage:
    def __init__(self, storage_dir="data"):
        self.storage_dir = Path(storage_dir)
        self.storage_dir.mkdir(exist_ok=True)
        self.products_file = self.storage_dir / "products.json"
        self.reviews_file = self.storage_dir / "reviews.json"
        
        # Initialize files if they don't exist
        self._init_files()
    
    def _init_files(self):
        """Initialize JSON files if they don't exist"""
        if not self.products_file.exists():
            with open(self.products_file, 'w') as f:
                json.dump([], f)
        
        if not self.reviews_file.exists():
            with open(self.reviews_file, 'w') as f:
                json.dump([], f)
    
    def save_product(self, product_data):
        """Save product data to JSON file"""
        try:
            with open(self.products_file, 'r') as f:
                products = json.load(f)
            
            product_data['id'] = len(products) + 1
            product_data['created_at'] = datetime.utcnow().isoformat()
            products.append(product_data)
            
            with open(self.products_file, 'w') as f:
                json.dump(products, f, indent=2)
            
            return product_data['id']
        except Exception as e:
            print(f"Error saving product: {e}")
            return None
    
    def save_reviews(self, reviews_data, product_id):
        """Save reviews data to JSON file"""
        try:
            with open(self.reviews_file, 'r') as f:
                reviews = json.load(f)
            
            for review in reviews_data:
                review['id'] = len(reviews) + 1
                review['product_id'] = product_id
                review['created_at'] = datetime.utcnow().isoformat()
                reviews.append(review)
            
            with open(self.reviews_file, 'w') as f:
                json.dump(reviews, f, indent=2)
            
            return len(reviews_data)
        except Exception as e:
            print(f"Error saving reviews: {e}")
            return 0
    
    def get_products(self):
        """Get all products from JSON file"""
        try:
            with open(self.products_file, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading products: {e}")
            return []
    
    def get_reviews(self, product_id=None):
        """Get reviews from JSON file, optionally filtered by product_id"""
        try:
            with open(self.reviews_file, 'r') as f:
                reviews = json.load(f)
            
            if product_id:
                return [r for r in reviews if r.get('product_id') == product_id]
            return reviews
        except Exception as e:
            print(f"Error loading reviews: {e}")
            return []
    
    def get_stats(self):
        """Get storage statistics"""
        products = self.get_products()
        reviews = self.get_reviews()
        
        return {
            "total_products": len(products),
            "total_reviews": len(reviews),
            "storage_type": "JSON Files",
            "storage_location": str(self.storage_dir.absolute())
        }
