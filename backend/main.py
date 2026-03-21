"""
main.py (The Traffic Controller)
Person in Charge: Architect

Input: Receives an HTTP Request from the Frontend (e.g., GET /api/analyze?recipe=Beef+Tacos).

Internal Logic: 1. It calls the Librarian (spoonacular_client) to get the ingredients.
2. It passes those ingredients to the Brain (agent_service).
3. It packages the final result into the format defined in schemas.py.

Output: Returns a final JSON Response to the Frontend.
"""
