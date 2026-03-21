import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as Blob;
        const languageCode = formData.get('language_code') as string || 'en-IN';
        
        if (!file) {
            return NextResponse.json({ error: 'Audio file is required' }, { status: 400 });
        }

        // Forward multipart form data to Sarvam STT
        const sarvamFormData = new FormData();
        sarvamFormData.append('file', file, 'audio.webm');
        sarvamFormData.append('model', 'saaras:v1');
        sarvamFormData.append('language_code', languageCode);

        const res = await fetch("https://api.sarvam.ai/speech-to-text", {
            method: "POST",
            headers: {
                "api-subscription-key": process.env.SARVAM_API_KEY || ''
            },
            body: sarvamFormData
        });

        const data = await res.json();
        
        if (data.transcript) {
            return NextResponse.json({ transcript: data.transcript });
        } else {
            return NextResponse.json({ error: "Failed to transcribe", details: data }, { status: 500 });
        }

    } catch (error) {
        console.error("STT API error:", error);
        return NextResponse.json({ error: "Failed to process audio" }, { status: 500 });
    }
}
