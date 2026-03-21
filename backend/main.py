"""
main.py (The Traffic Controller)
Person in Charge: Architect

Input: Receives an HTTP Request from the Frontend (e.g., GET /api/analyze?recipe=Beef+Tacos).

Internal Logic: 1. It calls the Librarian (spoonacular_client) to get the ingredients.
2. It passes those ingredients to the Brain (agent_service).
3. It packages the final result into the format defined in schemas.py.

Output: Returns a final JSON Response to the Frontend.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import schemas
import spoonacular_client
import agent_service

app = FastAPI(title="Eco-Eats API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/audit", response_model=schemas.DiscoveryResponse)
async def audit_and_discover(request: schemas.IngredientRequest):
    # 1. AI Audits the Fridge AND suggests a "Green Swap" list
    eco_data = agent_service.audit_ingredients(request.ingredients)
    green_ingredients = eco_data.get("green_search_list", request.ingredients)
    
    # 2. Librarian searches Spoonacular using the GREEN list (e.g. beans instead of beef)
    raw_recipes = spoonacular_client.get_recipes_by_ingredients(green_ingredients)
    
    # 3. AI assigns a CO2 score to the new recipes
    scored_recipes = agent_service.estimate_recipe_emissions(raw_recipes)
    
    # 4. Package it up and send to Frontend
    return schemas.DiscoveryResponse(
        total_kg_co2=eco_data.get("total_kg_co2", 0.0),
        audit_breakdown=eco_data.get("audit_breakdown", []),
        recipe_ideas=scored_recipes
    )