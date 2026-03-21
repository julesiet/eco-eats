"""
schemas.py (The Contract)
Person in Charge: Shared (Architect & Data Guru)

Input: Data objects from the Librarian and the Brain.

Internal Logic: It doesn't "do" math; it performs a Type Check. It ensures kg_co2 is a number and not a string.

Output: A Validated Data Class. If the data is wrong, it stops the flow before a crash happens.
"""
from pydantic import BaseModel
from typing import List

class IngredientRequest(BaseModel):
    ingredients: List[str]

class IngredientAudit(BaseModel):
    name: str
    kg_co2: float

class RecipeIdea(BaseModel):
    id: int
    title: str
    image_url: str
    estimated_co2: float  
    swap_note: str        

class DiscoveryResponse(BaseModel):
    total_kg_co2: float
    audit_breakdown: List[IngredientAudit]
    recipe_ideas: List[RecipeIdea]