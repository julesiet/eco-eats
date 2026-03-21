"""
spoonacular_client.py (The Librarian)
Person in Charge: Data Guru

Input: A string (Recipe Name) or an Integer (Spoonacular ID) passed from main.py.

Internal Logic:

Uses the API Key from .env to hit the Spoonacular API.

Filters the huge JSON response (often 100+ lines) down to just the essentials: title, image, and ingredients
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv()
SPOONACULAR_KEY = os.getenv("SPOONACULAR_API_KEY")
BASE_URL = "https://api.spoonacular.com/recipes/findByIngredients"

def get_recipes_by_ingredients(ingredients: list[str]) -> list[dict]:
    # FALLBACK DATA (if there's no key)
    if SPOONACULAR_KEY == "your_spoonacular_key_here" or not SPOONACULAR_KEY:
        return [
            {"id": 101, "title": "Eco-Friendly Veggie Bowl", "image_url": "https://spoonacular.com/recipeImages/101-312x231.jpg"},
            {"id": 102, "title": "Green Earth Stir Fry", "image_url": "https://spoonacular.com/recipeImages/102-312x231.jpg"}
        ]
    
    # --- REAL API MODE ---
    ingredients_str = ",".join(ingredients)
    params = {
        "ingredients": ingredients_str,
        "number": 3,
        "apiKey": SPOONACULAR_KEY
    }
    
    response = requests.get(BASE_URL, params=params)
    if response.status_code == 200:
        data = response.json()
        # Clean the messy data to match our schema
        return [{"id": item["id"], "title": item["title"], "image_url": item["image"]} for item in data]
    else:
        print(f"Spoonacular Error: {response.status_code}")
        return []