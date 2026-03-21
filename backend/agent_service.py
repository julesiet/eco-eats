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
import random
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
ASI_KEY = os.getenv("ASI_ONE_API_KEY")

client = OpenAI(
    api_key=ASI_KEY,
    base_url="https://api.asi1.ai/v1"
)

def get_eco_equivalent(kg_saved: float) -> str:
    """Calculates real-world equivalents for CO2 savings."""
    # 1 kg CO2 ≈ 4 km driving a gas car
    km_driven = round(kg_saved * 4, 1)
    # 1 kg CO2 ≈ 122 smartphone charges
    phone_charges = int(kg_saved * 122)
    
    options = [
        f"That's like driving {abs(km_driven)} km in a gas car!",
        f"Equivalent to charging a smartphone {abs(phone_charges)} times.",
        f"That's like powering a house for {abs(round(kg_saved * 0.15, 2))} days!",
        f"Equal to the weight of {abs(int(kg_saved * 0.1))} large bags of landfill waste recycled instead of burned."
    ]
    return random.choice(options)

def audit_ingredients(ingredients: list[str]) -> dict:
    if ASI_KEY == "your_asi_one_key_here" or not ASI_KEY:
        return {
            "total_kg_co2": 29.6,
            "audit_breakdown": [{"name": i, "kg_co2": 27.0 if "beef" in i.lower() else 1.3} for i in ingredients],
            "green_search_list": ["black beans" if "beef" in i.lower() else i for i in ingredients]
        }

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
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": f"Ingredients: {', '.join(ingredients)}"}],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"AI Error: {e}")
        return {"total_kg_co2": 0.0, "audit_breakdown": [], "green_search_list": ingredients}

def estimate_recipe_emissions(recipes: list[dict], original_total: float) -> list[dict]:
    if ASI_KEY == "your_asi_one_key_here" or not ASI_KEY:
        for r in recipes:
            saved = max(0, original_total - 3.5)
            r["estimated_co2"] = 3.5 
            r["swap_note"] = f"You save {saved:.1f} kg CO2! {get_eco_equivalent(saved)}"
        return recipes

    titles = [r["title"] for r in recipes]

    system_prompt = f"""
    Estimate the CO2 (kg) for these recipe titles. Compare to the user's original meal of {original_total}kg.
    Return ONLY JSON:
    {{"estimates": [{{"title": "string", "estimated_co2": float, "kg_saved": float}}]}}
    """
    
    try:
        response = client.chat.completions.create(
            model="asi1-mini",
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": f"Recipes: {', '.join(titles)}"}],
            response_format={"type": "json_object"}
        )
        ai_data = json.loads(response.choices[0].message.content).get("estimates", [])
        
        for recipe in recipes:
            match = next((item for item in ai_data if item["title"] == recipe["title"]), None)
            if match:
                est = match["estimated_co2"]
                saved = match["kg_saved"]
                recipe["estimated_co2"] = est
                recipe["swap_note"] = f"You save {abs(saved):.1f} kg CO2! {get_eco_equivalent(saved)}"
            else:
                recipe["estimated_co2"] = 5.0
                recipe["swap_note"] = "Great eco-friendly choice."
        
        return recipes
    except Exception as e:
        print(f"AI Error: {e}")
        return recipes