from app.langgraph.state import TriageState

def route_intent(state: TriageState):
    """Detects mode to route to corresponding workflow path."""
    mode = state.get("mode", "normal")
    if mode == "mental_health":
        return "mental_health_path"
    return "normal_path"

def route_after_triage(state: TriageState):
    """Checks urgency to decide if hospital search is needed."""
    urgency = state.get("urgency")
    if urgency in ["clinic_visit", "emergency"]:
        return "find_hospitals"
    return "generate_medical_response"
