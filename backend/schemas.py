"""
schemas.py (The Contract)
Person in Charge: Shared (Architect & Data Guru)

Input: Data objects from the Librarian and the Brain.

Internal Logic: It doesn't "do" math; it performs a Type Check. It ensures kg_co2 is a number and not a string.

Output: A Validated Data Class. If the data is wrong, it stops the flow before a crash happens.
"""
from pydantic import BaseModel
from typing import List, Optional

class IngredientRequest(BaseModel):
    ingredients: List[str]

class IngredientAudit(BaseModel):
    name: str
    kg_co2: float

class ChartData(BaseModel):
    name: str
    value: float

# NEW: Define the structure for inferred ingredients
class IngredientDetail(BaseModel):
    name: str
    amount: float
    unit: str

class RecipeIdea(BaseModel):
    id: int
    title: str
    image_url: str
    estimated_co2: float
    swap_note: str
    instructions: List[str]
    prep_time: int
    cook_time: int
    co2_split: List[ChartData]
    macros: List[ChartData]
    # NEW: Add this field so the backend can pass the AI's guess
    inferred_ingredients: List[IngredientDetail]

class DiscoveryResponse(BaseModel):
    total_kg_co2: float
    audit_breakdown: List[IngredientAudit]
    recipe_ideas: List[RecipeIdea]