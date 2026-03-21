from typing import TypedDict, List, Dict, Optional, Any

class TriageState(TypedDict):
    messages: List[Dict[str, str]] # e.g., [{"role": "user", "content": "..."}]
    history: List[str]
    mode: str  # "normal" vs "mental_health"
    input_type: str # "text" vs "audio"
    language: str # Detected language
    urgency: Optional[str] # "self_care", "clinic_visit", "emergency"
    location: Optional[Dict[str, float]] # {"lat": ..., "lng": ...}
    hospitals_found: Optional[List[Dict[str, Any]]] # List of nearest hospitals
    response_text: str # Final text to send back 
    response_audio: Optional[str] # Base64 audio if requested


