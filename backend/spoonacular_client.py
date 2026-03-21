"""
spoonacular_client.py (The Librarian)
Person in Charge: Data Guru

Input: A string (Recipe Name) or an Integer (Spoonacular ID) passed from main.py.

Internal Logic:

Uses the API Key from .env to hit the Spoonacular API.

Filters the huge JSON response (often 100+ lines) down to just the essentials: title, image, and ingredients
"""
