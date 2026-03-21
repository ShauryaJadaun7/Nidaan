import { NextResponse } from 'next/server';

const PHYSICAL_PROMPT = `You are Nirdaan AI, a clinical triage assistant. You MUST respond in valid JSON format ONLY. No text before or after the JSON.

RESPONSE JSON SCHEMA (strictly follow):
{
  "triage": "EMERGENCY" | "VISIT_CLINIC" | "STAY_HOME",
  "confidence": <number 0-100>,
  "summary": "<1-2 sentence plain text overview of the condition>",
  "keySymptoms": ["symptom1", "symptom2"],
  "medicalReasoning": "<2-3 sentence plain text explaining HOW you reached this conclusion, referencing specific symptoms/findings>",
  "suggestedCare": "<specific actionable advice in plain text, include medicines with dosages if applicable>",
  "nextStep": "<one clear action the patient should take>"
}

TRIAGE CLASSIFICATION RULES:
- "EMERGENCY": chest pain, stroke signs, severe bleeding, breathing difficulty, unconsciousness, severe allergy, poisoning, seizures
- "VISIT_CLINIC": persistent fever >3 days, unexplained rashes, moderate pain, infections, medication side effects, abnormal labs
- "STAY_HOME": mild cold/cough, minor headache, mild stomach upset, minor cuts, general wellness, medication clarifications

IMPORTANT RULES:
- Output ONLY the JSON object, nothing else
- No markdown formatting anywhere
- If unsure, classify higher severity (safety first)
- Never diagnose definitively, use "likely", "suggestive of", "consistent with"
- Be culturally aware of Indian healthcare context`;

const MENTAL_HEALTH_PROMPT = `You are Nirdaan AI, a compassionate mental health screening assistant. You MUST respond in valid JSON format ONLY.

SCREENING PROTOCOL:
If the user has not yet shared enough information, your "summary" field should be a kind question to gather more data. 
You must sequentially screen for these 4 areas if not already discussed:
1. Mood (Feeling down, depressed, or hopeless?)
2. Sleep (Trouble falling/staying asleep, or sleeping too much?)
3. Anxiety (Feeling nervous, anxious, or on edge?)
4. Interest (Little interest or pleasure in doing things?)

JSON SCHEMA (strictly follow):
{
  "triage": "EMERGENCY" | "VISIT_CLINIC" | "STAY_HOME",
  "confidence": <number 0-100>,
  "summary": "<The question you are asking OR a summary of their state>",
  "keySymptoms": ["finding1", "finding2"],
  "medicalReasoning": "<Analysis of their mental state based on their answers>",
  "suggestedCare": "<Compassionate self-care advice or professional referral>",
  "nextStep": "<Next question to answer OR recommended clinical action>"
}

TRIAGE RULES (Mental Health):
- "EMERGENCY": Thoughts of self-harm, suicidal ideation, severe psychosis, inability to care for self.
- "VISIT_CLINIC": Symptoms of moderate-to-severe depression or anxiety, significant impact on daily life.
- "STAY_HOME": Mild stress, temporary sadness, general mental wellness check, no immediate risk.

IMPORTANT:
- If screening is incomplete, set triage to "STAY_HOME" and confidence to 30.
- Only provide a definitive triage when all 4 areas are discussed.
- Use warm, empathetic language.`;

export async function POST(req: Request) {
    try {
        const { messages, image, mode = 'physical', language = 'en-IN' } = await req.json();

        if (!messages) {
            return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
        }

        let activePrompt = mode === 'mental' ? MENTAL_HEALTH_PROMPT : PHYSICAL_PROMPT;
        
        // Add language instruction
        activePrompt += `\n\nCRITICAL: Respond in ${language}. Ensure all text values in the JSON are correctly translated into ${language}. Keep formatting consistent.`;

        // --- IMAGE PATH: Use Groq vision model ---
        if (image) {
            const lastUserMsg = messages[messages.length - 1];
            const textMessages = messages.slice(0, -1).map((m: any) => ({
                role: m.role, content: m.content
            }));

            const visionMessage = {
                role: "user",
                content: [
                    { type: "text", text: `${activePrompt}\n\nUser request: ${lastUserMsg.content}` },
                    { type: "image_url", image_url: { url: image } }
                ]
            };

            const visionModels = ["meta-llama/llama-4-scout-17b-16e-instruct", "llama-3.2-11b-vision-preview"];
            
            for (const visionModel of visionModels) {
                try {
                    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            model: visionModel,
                            messages: [...textMessages, visionMessage],
                            temperature: 0.3,
                            max_tokens: 1024,
                        })
                    });
                    const data = await res.json();
                    
                    if (data.choices && data.choices.length > 0) {
                        return NextResponse.json({ reply: data.choices[0].message.content });
                    }
                    if (data.error) {
                        console.error(`Groq vision (${visionModel}) error:`, data.error.message);
                        continue;
                    }
                } catch (e) {
                    console.error(`Model ${visionModel} failed:`, e);
                    continue;
                }
            }
            return NextResponse.json({ reply: JSON.stringify({ triage: "VISIT_CLINIC", confidence: 50, summary: "Image analysis is temporarily unavailable. Please describe the image in text.", keySymptoms: [], medicalReasoning: "Unable to process the image at this time.", suggestedCare: "Please describe what you see in the image as text.", nextStep: "Type a description of the image content." }) });
        }

        // --- TEXT PATH: Use Groq ---
        const systemMessage = { role: "system", content: activePrompt };
        const apiMessages = [systemMessage, ...messages];

        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: apiMessages,
                temperature: 0.3,
                max_tokens: 1024,
            })
        });

        const data = await res.json();

        if (data.error) {
            console.error("Groq API error:", JSON.stringify(data.error));
            const errorMsg = typeof data.error === 'object' ? data.error.message : data.error;
            return NextResponse.json({ reply: `API Error: ${errorMsg}` });
        }

        if (data.choices && data.choices.length > 0) {
            return NextResponse.json({ reply: data.choices[0].message.content });
        }
        return NextResponse.json({ reply: "I'm having trouble connecting. Please try again." });

    } catch (error) {
        console.error("Chat API error:", error);
        return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
    }
}
