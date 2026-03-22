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

def get_recipes_by_ingredients(ingredients: list[str]) -> list[dict]:
    if not SPOONACULAR_KEY or SPOONACULAR_KEY == "your_key":
        return [{"id": 1, "title": "Mock Green Stew", "image": "https://placehold.co/400x300?text=Green+Stew"}]
    
    url = "https://api.spoonacular.com/recipes/findByIngredients"
    params = {"ingredients": ",".join(ingredients), "number": 3, "apiKey": SPOONACULAR_KEY}
    res = requests.get(url, params=params).json()
    return [{"id": r["id"], "title": r["title"], "image_url": r["image"]} for r in res]

def get_recipe_details(recipe_id: int):
    """Fetches real nutrition and instructions from Spoonacular."""
    if not SPOONACULAR_KEY: return None
    url = f"https://api.spoonacular.com/recipes/{recipe_id}/information?includeNutrition=true&apiKey={SPOONACULAR_KEY}"
    res = requests.get(url).json()
    
    return {
        "instructions": [s["step"] for s in res.get("analyzedInstructions", [{}])[0].get("steps", [])],
        "prep_time": res.get("readyInMinutes", 20) // 2,
        "cook_time": res.get("readyInMinutes", 20) // 2,
        "macros": [{"name": n["name"], "value": n["amount"]} for n in res["nutrition"]["nutrients"] if n["name"] in ["Protein", "Fat", "Carbohydrates"]]
    }
    
