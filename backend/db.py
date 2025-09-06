import os
from urllib.parse import quote_plus
from pymongo import MongoClient


def get_mongo_connection_uri() -> str:
    """Build a MongoDB connection URI for local development.

    Uses environment variables if provided, otherwise defaults to localhost.
    Supported env vars: MONGO_HOST, MONGO_PORT, MONGO_DB, MONGO_USER, MONGO_PASSWORD.
    """
    host = os.getenv("MONGO_HOST", "127.0.0.1")
    port = os.getenv("MONGO_PORT", "27017")
    database = os.getenv("MONGO_DB", "reviews_db")
    username = os.getenv("MONGO_USER")
    password = os.getenv("MONGO_PASSWORD")

    if username and password:
        user_enc = quote_plus(username)
        pass_enc = quote_plus(password)
        return f"mongodb://{user_enc}:{pass_enc}@{host}:{port}/{database}?authSource=admin"
    return f"mongodb://{host}:{port}/{database}"


def get_mongo_client() -> MongoClient:
    uri = get_mongo_connection_uri()
    return MongoClient(uri, serverSelectionTimeoutMS=3000)


def get_database():
    client = get_mongo_client()
    db_name = os.getenv("MONGO_DB", "reviews_db")
    return client[db_name]


