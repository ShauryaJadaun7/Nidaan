import os
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

def get_llm():
    # Uses OPENAI_API_KEY from environment
    return ChatOpenAI(model="gpt-4o-mini", temperature=0)

# Translation & Entity extraction
def process_text(text: str, target_lang: str = "en"):
    """Translates text if needed and extracts core health entities."""
    llm = get_llm()
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a highly capable multilingual medical AI assistant. Your job is to translate the following patient text to English, identify the original language (e.g., 'hi' for Hindi, 'mr' for Marathi, 'ta' for Tamil, 'gu' for Gujarati, 'en' for English), and summarize the core symptoms. Respond in JSON format with keys: 'translated_text', 'detected_language', 'symptoms'."),
        ("user", "{text}")
    ])
    chain = prompt | llm
    
    # We could parse JSON safely here or use LangChain output parsers
    # For now, we mock the exact JSON parsing behavior
    response = chain.invoke({"text": text})
    return response.content
