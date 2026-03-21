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
