from app.langgraph.state import TriageState
from app.services.nlp_processor import process_text, get_llm
from app.services.hospital_logic import get_nearest_hospitals
from langchain_core.prompts import ChatPromptTemplate
import json

def analyze_input(state: TriageState):
    """Detects language and extracts meaning."""
    latest_msg = state['messages'][-1]['content']
    analysis_json = process_text(latest_msg)
    
    try:
        data = json.loads(analysis_json)
        # Store analysis back to state
        state['language'] = data.get('detected_language', 'en')
        # We could append the symptom summary to history or just let next nodes use latest_msg
        state['history'].append(f"Symptoms extracted: {data.get('symptoms', '')}")
    except:
        state['language'] = 'en'
        
    return state

def categorize_triage(state: TriageState):
    """LLM classifies urgency into self_care, clinic_visit, emergency."""
    llm = get_llm()
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a triage nurse AI. Based on the user's symptoms, classify the urgency exactly into one of these 3 words: 'self_care', 'clinic_visit', 'emergency'. Respond ONLY with one of the 3 words."),
        ("user", "Symptoms: {history}")
    ])
    chain = prompt | llm
    
    # Extract symptoms from history (assuming analyzed recently)
    hist_str = "\n".join(state['history'])
    res = chain.invoke({"history": hist_str})
    urgency = res.content.strip().lower()
    
    if urgency not in ["self_care", "clinic_visit", "emergency"]:
        urgency = "clinic_visit"  # default safe fallback
        
    state['urgency'] = urgency
    return state

def find_hospitals(state: TriageState):
    """Finds hospitals if clinic or emergency."""
    if state['urgency'] in ['clinic_visit', 'emergency']:
        loc = state.get('location')
        if loc and 'lat' in loc and 'lng' in loc:
            hospitals = get_nearest_hospitals(loc['lat'], loc['lng'])
            state['hospitals_found'] = hospitals
        else:
            state['hospitals_found'] = []
    return state

def generate_medical_response(state: TriageState):
    """Generates the final medical response in the user's language."""
    llm = get_llm()
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a compassionate medical AI. You must reply in the language code: {language}. Triage level is {urgency}. Nearby hospitals found: {hospitals}. Draft a helpful, empathetic response addressing their symptoms. Format any hospital info clearly. Do NOT give direct medical diagnoses, just advice or directions."),
        ("user", "User message: {msg}")
    ])
    chain = prompt | llm
    
    hosp_str = str(state.get('hospitals_found', []))
    msg = state['messages'][-1]['content']
    
    res = chain.invoke({
        "language": state['language'],
        "urgency": state['urgency'],
        "hospitals": hosp_str,
        "msg": msg
    })
    
    state['response_text'] = res.content
    return state

def mental_health_response(state: TriageState):
    """Generates an empathetic response with mood enhancing suggestions."""
    llm = get_llm()
    msg = state['messages'][-1]['content']
    
    # Simple language detection & response generation in one pass
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an empathetic listener and mental health companion. Detect the user's language and respond completely in their language. Acknowledge their feelings, provide comforting words, and suggest 1 mood-enhancing movie, 1 song/music genre, and 1 book that fits what they are going through."),
        ("user", "{msg}")
    ])
    chain = prompt | llm
    res = chain.invoke({"msg": msg})
    
    state['response_text'] = res.content
    state['urgency'] = None # Not applicable in mental health
    return state
