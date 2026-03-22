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
import schemas, spoonacular_client, agent_service

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/audit", response_model=schemas.DiscoveryResponse)
async def audit_and_discover(request: schemas.IngredientRequest):
    # 1. Audit current ingredients
    eco_data = agent_service.audit_ingredients(request.ingredients)
    
    # 2. Search for recipes using the 'green search list'
    raw_recipes = spoonacular_client.get_recipes_by_ingredients(eco_data["green_search_list"])
    
    # 3. Enrich with Instructions, Macros, and Charts (AI Mode)
    final_recipes = agent_service.enrich_recipes_with_ai(raw_recipes)
    
    return {
        "total_kg_co2": eco_data["total_kg_co2"],
        "audit_breakdown": eco_data["audit_breakdown"],
        "recipe_ideas": final_recipes
    }