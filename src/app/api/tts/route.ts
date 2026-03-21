import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { text, languageCode = 'en-IN' } = await req.json();
        
        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const res = await fetch("https://api.sarvam.ai/text-to-speech", {
            method: "POST",
            headers: {
                "api-subscription-key": process.env.SARVAM_API_KEY || '',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: [text],
                target_language_code: languageCode,
                speaker: "meera",
                pitch: 0,
                pace: 1.0,
                loudness: 1.5,
                speech_sample_rate: 8000,
                enable_preprocessing: true,
                model: "bulbul:v1"
            })
        });

        const data = await res.json();
        
        if (data.audios && data.audios.length > 0) {
            return NextResponse.json({ audioBase64: data.audios[0] });
        } else {
            return NextResponse.json({ error: "Failed to generate TTS", details: data }, { status: 500 });
        }

    } catch (error) {
        console.error("TTS API error:", error);
        return NextResponse.json({ error: "Failed to process text" }, { status: 500 });
    }
}
