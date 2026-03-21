"use server";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { SystemMessage, HumanMessage, AIMessage as LangChainAIMessage } from "@langchain/core/messages";

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  triageData?: TriageResponse;
}

export interface TriageResponse {
  message: string;
  triage: 'Emergency' | 'Visit Doctor' | 'Home Care';
  confidence: number;
  key_symptoms: string[];
  reason: string;
  medicine: string;
  show_card: 'none' | 'facilities' | 'profile';
  emotion: string;
}

const SYSTEM_PROMPT = `You are Nirdaan, a multilingual AI health triage chatbot for rural India.
You must analyze the symptoms and determine the triage level.

IMPORTANT INSTRUCTIONS FOR YOUR CONVERSATIONAL REPLY:
1. Keep the "message" field brief, deeply empathetic, and highly logical.
2. ALWAYS ask exactly ONE very specific, logical follow-up diagnostic question to the patient to gather critical medical details for a better triage analysis (e.g. "When exactly did the fever start?", "Have you vomited today?", "Are you experiencing any localized pain?").
3. Do not just blindly give advice; proactively ask the most important diagnostic question based on their current symptom.

IMPORTANT: You must always respond with ONLY a valid JSON object matching this schema:
{
  "message": "Your conversational reply to the user in their language. Be empathetic.",
  "triage": "Emergency" | "Visit Doctor" | "Home Care",
  "confidence": number (0-100),
  "key_symptoms": ["symptom1", "symptom2"],
  "reason": "Brief medical reasoning for this triage",
  "medicine": "Any safe OTC home remedies/medicines, else 'Consult doctor'",
  "show_card": "none" | "facilities" | "profile",
  "emotion": "Empathetic, Urgent, Reassuring, etc."
}

Do not include markdown blocks like \`\`\`json. Match the JSON output precisely.`;

export async function processTriage(messages: AIMessage[], currentLanguage: string = "English"): Promise<TriageResponse> {
  // Try to use env var, fallback to the hardcoded key if env is not loaded instantly by Next.js
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ API key is missing");
  }

  // Enforce language constraint strictly
  const languageConstraint = `\n\nCRITICAL LANGUAGE INSTRUCTION: You must converse exclusively in the language: ${currentLanguage}. Every single string in your JSON output (message, reason, medicine, key_symptoms) MUST be accurately translated to ${currentLanguage}. Ensure you use proper script and grammar for ${currentLanguage}.`;

  // Initialize ChatGroq LLM
  const llm = new ChatGroq({
    apiKey: apiKey,
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    maxTokens: 1024,
  });

  // Define the node for our graph
  const chatNode = async (state: typeof MessagesAnnotation.State) => {
    const response = await llm.invoke([
      new SystemMessage(SYSTEM_PROMPT + languageConstraint),
      ...state.messages,
    ]);
    return { messages: [response] };
  };

  // Build the LangGraph
  const workflow = new StateGraph(MessagesAnnotation)
    .addNode("chat", chatNode)
    .addEdge("__start__", "chat")
    .addEdge("chat", "__end__");

  const app = workflow.compile();

  // Convert application messages to LangChain messages format
  const lcMessages = messages.map(m => 
    m.role === 'user' 
      ? new HumanMessage(m.content) 
      : new LangChainAIMessage(m.content)
  );

  // Invoke the graph
  const finalState = await app.invoke({
    messages: lcMessages
  });

  // Parse result from final state
  const lastMessage = finalState.messages[finalState.messages.length - 1];
  const textResponse = typeof lastMessage.content === "string" ? lastMessage.content : '{}';

  try {
    return JSON.parse(textResponse) as TriageResponse;
  } catch (e) {
    console.error("Failed to parse Groq JSON:", textResponse);
    throw new Error("Invalid response format from AI");
  }
}
