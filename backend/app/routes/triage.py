from flask import Blueprint, request, jsonify
from app.langgraph.workflow import build_workflow
import base64
import os
# from openai import OpenAI # Used for TTS later if needed

triage_bp = Blueprint('triage', __name__)

# Compile graph once
graph = build_workflow()

@triage_bp.route('/api/triage', methods=['POST'])
def process_triage():
    data = request.json
    text_input = data.get('text', '')
    mode = data.get('mode', 'normal')
    input_type = data.get('input_type', 'text')
    location = data.get('location', None)
    
    initial_state = {
        "messages": [{"role": "user", "content": text_input}],
        "history": [],
        "mode": mode,
        "input_type": input_type,
        "language": "en", # will be populated by AI
        "urgency": None,
        "location": location,
        "hospitals_found": [],
        "response_text": "",
        "response_audio": None
    }
    
    # Execute workflow
    try:
        result_state = graph.invoke(initial_state)
        
        response_text = result_state.get('response_text', "I'm sorry, I couldn't process that.")
        language = result_state.get('language', 'en')
        
        # Audio generation logic (Mocked fallback, requires OPENAI_API_KEY and actual client setup)
        audio_b64 = None
        if input_type == 'audio':
            # client = OpenAI()
            # response = client.audio.speech.create(model="tts-1", voice="alloy", input=response_text)
            # audio_b64 = base64.b64encode(response.content).decode('utf-8')
            pass

        return jsonify({
            "message": "Success",
            "reply": response_text,
            "language": language,
            "urgency": result_state.get('urgency'),
            "hospitals": result_state.get('hospitals_found'),
            "audio_blob": audio_b64
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
