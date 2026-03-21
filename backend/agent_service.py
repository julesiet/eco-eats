"""
agent_service.py (The Brain)
Person in Charge: Architect

Input: The cleaned ingredient list from the Librarian.

Internal Logic:

Formulates a prompt for the ASI:One Agent.

Uses the ASI Key from .env to send the request.

Interprets the AI's "thought process" to extract the CO2 numbers and the "Green Swap."

Output: An Eco-Analysis Object (CO2 values and a text recommendation).
"""
import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
ASI_KEY = os.getenv("ASI_ONE_API_KEY")

client = OpenAI(
    api_key=ASI_KEY,
    base_url="https://api.asi1.ai/v1"
)

def audit_ingredients(ingredients: list[str]) -> dict:
    # --- DUMMY DATA MODE ---
    if ASI_KEY == "your_asi_one_key_here" or not ASI_KEY:
        return {
            "total_kg_co2": 29.6,
            "audit_breakdown": [{"name": i, "kg_co2": 27.0 if "beef" in i.lower() else 1.3} for i in ingredients],
            "green_search_list": ["black beans" if "beef" in i.lower() else i for i in ingredients]
        }

    # --- REAL API MODE ---
    system_prompt = """
    You are an expert environmental scientist.
    1. Calculate the CO2 emissions in kg for the provided ingredients.
    2. Create a 'green_search_list' by replacing high-carbon items (like beef/lamb) with low-carbon alternatives (like beans/lentils). Keep low-carbon items the same.
    Return ONLY JSON:
    {
        "total_kg_co2": float,
        "audit_breakdown": [{"name": "string", "kg_co2": float}],
        "green_search_list": ["string", "string"]
    }
    """
    
    try:
        response = client.chat.completions.create(
            model="asi1-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Ingredients: {', '.join(ingredients)}"}
            ],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"AI Error: {e}")
        return {"total_kg_co2": 0.0, "audit_breakdown": [], "green_search_list": ingredients}


def estimate_recipe_emissions(recipes: list[dict]) -> list[dict]:
    # --- DUMMY DATA MODE ---
    if ASI_KEY == "your_asi_one_key_here" or not ASI_KEY:
        for r in recipes:
            r["estimated_co2"] = 3.5  # Fake low score
            r["swap_note"] = "Plant-based swap!"
        return recipes

    # --- REAL API MODE ---
    # We ask the AI to quickly assign a CO2 score based on the title of the recipes
    titles = [r["title"] for r in recipes]
    system_prompt = """
    Estimate the total CO2 emissions (kg) for these recipe titles. 
    Add a short 'swap_note' praising the green ingredients.
    Return ONLY JSON:
    {"estimates": [{"title": "string", "estimated_co2": float, "swap_note": "string"}]}
    """
    
    try:
        response = client.chat.completions.create(
            model="asi1-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Recipes: {', '.join(titles)}"}
            ],
            response_format={"type": "json_object"}
        )
        ai_data = json.loads(response.choices[0].message.content).get("estimates", [])
        
        # Merge the AI scores back into the recipe objects
        for recipe in recipes:
            match = next((item for item in ai_data if item["title"] == recipe["title"]), None)
            recipe["estimated_co2"] = match["estimated_co2"] if match else 5.0
            recipe["swap_note"] = match["swap_note"] if match else "Great eco-friendly choice."
        
        return recipes
    except Exception as e:
        print(f"AI Error: {e}")
        return recipes