# backend/sentiment.py
from textblob import TextBlob

def analyze_sentiment(text):
    """Return polarity and label."""
    try:
        blob = TextBlob(text)
        polarity = round(blob.sentiment.polarity, 4)  # -1..1
    except Exception:
        polarity = 0.0

    if polarity > 0.1:
        label = 'positive'
    elif polarity < -0.1:
        label = 'negative'
    else:
        label = 'neutral'

    return {"polarity": polarity, "label": label}
