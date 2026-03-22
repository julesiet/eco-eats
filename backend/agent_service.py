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

client = OpenAI(api_key=ASI_KEY, base_url="https://api.asi1.ai/v1")

def audit_ingredients(ingredients: list[str]) -> dict:
    if ASI_KEY == "your_asi_one_key_here" or not ASI_KEY:
        return {
            "total_kg_co2": 25.4,
            "audit_breakdown": [{"name": i, "kg_co2": 22.0 if "beef" in i.lower() else 1.2} for i in ingredients],
            "green_search_list": ["lentils" if "beef" in i.lower() else i for i in ingredients]
        }

    system_prompt = """
    Analyze ingredients for CO2 impact. Replace high-carbon items with green alternatives in 'green_search_list'.
    Return ONLY JSON:
    {"total_kg_co2": float, "audit_breakdown": [{"name": "string", "kg_co2": float}], "green_search_list": ["string"]}
    """
    response = client.chat.completions.create(
        model="asi1-mini",
        messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": f"Ingredients: {ingredients}"}],
        response_format={"type": "json_object"}
    )
    return json.loads(response.choices[0].message.content)

def enrich_recipes_with_ai(recipes: list[dict]) -> list[dict]:
    """Generates instructions, macros, and CO2 breakdown for the dashboard."""
    titles = [r["title"] for r in recipes]
    
    system_prompt = """
    For each recipe title, provide:
    1. instructions (list of strings)
    2. prep_time & cook_time (minutes)
    3. co2_split (list of {name: "ingredient", value: kg_co2})
    4. macros (list of {name: "Protein/Carbs/Fat", value: grams})
    Return ONLY JSON: {"estimates": [{"title": "string", "instructions": [], "prep_time": 0, "cook_time": 0, "co2_split": [], "macros": []}]}
    """
    
    try:
        response = client.chat.completions.create(
            model="asi1-mini",
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": str(titles)}],
            response_format={"type": "json_object"}
        )
        ai_data = json.loads(response.choices[0].message.content).get("estimates", [])
        
        for recipe in recipes:
            match = next((item for item in ai_data if item["title"] == recipe["title"]), None)
            if match:
                recipe.update({
                    "instructions": match["instructions"],
                    "prep_time": match["prep_time"],
                    "cook_time": match["cook_time"],
                    "co2_split": match["co2_split"],
                    "macros": match["macros"],
                    "estimated_co2": sum(item["value"] for item in match["co2_split"]),
                    "swap_note": "A climate-positive choice!"
                })
        return recipes
    except:
        return recipes