from langgraph.graph import StateGraph, START, END
from app.langgraph.state import TriageState
from app.langgraph.nodes import (
    analyze_input, categorize_triage, find_hospitals, 
    generate_medical_response, mental_health_response
)
from app.langgraph.router import route_intent, route_after_triage

def build_workflow():
    workflow = StateGraph(TriageState)
    
    # Add nodes
    workflow.add_node("analyze_input", analyze_input)
    workflow.add_node("categorize_triage", categorize_triage)
    workflow.add_node("find_hospitals", find_hospitals)
    workflow.add_node("generate_medical_response", generate_medical_response)
    workflow.add_node("mental_health_response", mental_health_response)
    
    # Edges
    # START -> Intent Router
    workflow.add_conditional_edges(
        START,
        route_intent,
        {
            "normal_path": "analyze_input",
            "mental_health_path": "mental_health_response"
        }
    )
    
    # Normal Path Flow
    workflow.add_edge("analyze_input", "categorize_triage")
    
    workflow.add_conditional_edges(
        "categorize_triage",
        route_after_triage,
        {
            "find_hospitals": "find_hospitals",
            "generate_medical_response": "generate_medical_response"
        }
    )
    
    workflow.add_edge("find_hospitals", "generate_medical_response")
    workflow.add_edge("generate_medical_response", END)
    
    # Mental Health flow
    workflow.add_edge("mental_health_response", END)
    
    # Compile
    app = workflow.compile()
    return app

